<template>
  <div class="vuejs-uploader">
    <label>
      <slot name="browse" v-if="isSingleFileUpload">
        <span class="vuejs-uploader__btn">Browse</span>
        <p v-if="files[0] && files[0].error">{{ files[0].error }}</p>
      </slot>
      <span v-if="isMultipleFileUpload" class="vuejs-uploader__btn">Browse</span>
      <input type="file" :multiple="multiple" @change="addFiles">
    </label>
    <span v-if="isMultipleFileUpload">
      <button type="button" class="vuejs-uploader__btn" @click="upload">Upload</button>
      <button type="button" class="vuejs-uploader__btn" @click="clear">Clear</button>
    </span>
    <div v-if="errorMessage" class="vuejs-uploader__error">{{ errorMessage }}</div>
    <ul class="vuejs-uploader__queue" v-if="isMultipleFileUpload">
      <li v-for="fileObj in this.files" class="vuejs-uploader__file">
        <div class="vuejs-uploader__file--preview">
          <div class="loading" v-if="fileObj.constructor.name === 'ImageUpload' && !fileObj.image"></div>
          <img :src="fileObj.image" v-if="fileObj.image" />
        </div>
        <div class="vuejs-uploader__file--meta">
          <p class="vuejs-uploader__file--filename">{{ fileObj.file.name }}</p>
          <p class="vuejs-uploader__file--filesize">{{ fileSize(fileObj.file.size) }}</p>
          <p v-if="fileObj.error">{{ fileObj.error }}</p>
          <div class="vuejs-uploader__progress">
            <div class="vuejs-uploader__progress-bar" :style="progressBarStyle(fileObj)"></div>
          </div>
        </div>
        <div>
          <button type="button" class="vuejs-uploader__btn vuejs-uploader__btn--delete" @click="removeFile(fileObj)">Remove</button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
/**
 * @TODO
 * Allow axios config to be passed via prop
 */
import axios from 'axios'
import FileUpload from '../FileUpload'
import ImageUpload from '../ImageUpload'
export default {
  props: {
    /**
     * Server end point to send files to
     * @type {String}
     */
    endPoint: {
      type: String,
      required: true
    },
    /**
     * Upload multiple files at once
     * @type {Boolean}
     */
    multiple: {
      type: Boolean
    },
    /**
     * Upload larger files as multipart uploads?
     * @type {Boolean}
     */
    multipart: {
      type: Boolean
    },
    /**
     * Multipart upload chunk size
     * @type {Number}
     */
    multipartChunkSize: {
      type: Number,
      default: 1024 * 1024 * 2 // 2mb
    },
    /**
     * Number of files that can be added to the queue
     * @type {Object}
     */
    maxUploads: {
      type: Number,
      default: 5
    },
    /**
     * Maximun preview image width
     * @type {Object}
     */
    maxThumbWidth: {
      type: Number,
      default: 80
    },
    /**
     * Maximun preview image height
     * @type {Object}
     */
    maxThumbHeight: {
      type: Number,
      default: 80
    }
  },
  data () {
    return {
      files: [],
      errorMessage: null
    }
  },
  computed: {
    getFiles () {
      return this.files
    },
    isSingleFileUpload () {
      return !this.multiple
    },
    isMultipleFileUpload () {
      return this.multiple
    }
  },
  methods: {
    /**
     * Initiate the upload
     */
    upload () {
      this.resetError()
      this.files.forEach(file => this.uploadFile(file))
    },

    /**
     * Empty the file upload queue
     */
    clear () {
      this.resetError()
      this.files = []
    },

    /**
     * Upload a single file
     *
     * @param  {FileUpload} fileObj
     */
    uploadFile (fileObj) {
      if (this.multipart && fileObj.file.size > this.multipartChunkSize) {
        this.multipartUploadFile(fileObj)
        return true
      }

      const data = new FormData()
      data.append('file', fileObj.file)
      const config = {
        onUploadProgress: (progressEvent) => {
          fileObj.setProgress(progressEvent)
        }
      }
      axios.post(this.endPoint, data, config)
        .then((res) => {
          this.$emit('fileUploaded', fileObj)
        })
        .catch((error) => {
          fileObj.error = error.response.data
        })
    },

    /**
     * Upload a file in chunks
     *
     * @param  {FileUpload} fileObj
     */
    multipartUploadFile (fileObj) {
      const totalParts = Math.ceil(fileObj.file.size / this.multipartChunkSize)
      let i = 1
      do {
        const currentPart = i
        const blob = this.getFileChunk(fileObj, currentPart)
        const data = new FormData()
        const config = {
          onUploadProgress: (progressEvent) => {
            let p = fileObj.setMultipartProgress(progressEvent, totalParts, currentPart)
            if (p === 100) {
              this.$emit('fileUploaded', fileObj)
            }
          }
        }
        data.append('multipart', true)
        data.append('file', blob)
        data.append('filename', fileObj.file.name)
        data.append('totalSize', fileObj.file.size)
        data.append('partSize', this.multipartChunkSize)
        data.append('totalParts', totalParts)
        data.append('currentPart', currentPart)
        axios.post(this.endPoint, data, config)
          .then((res) => {
            this.$emit('chunkUploaded', fileObj, currentPart)
          })
          .catch((error) => {
            fileObj.error = error.response.data
          })
        i++
      } while (i <= totalParts)
    },

    /**
     * Slice a File object into chunks
     *
     * @param  {FileUpload} fileObj
     * @param  {Number} part
     * @return {Blob}
     */
    getFileChunk (fileObj, part) {
      const start = (part - 1) * this.multipartChunkSize
      const end = Math.min((start + this.multipartChunkSize), fileObj.file.size)
      return fileObj.file.slice(start, end)
    },

    /**
     * Add file(s) to the file list
     *
     * @param {Event} event
     */
    addFiles (event) {
      Array.from(event.target.files).forEach(file => {
        if (this.files.length === this.maxUploads) {
          this.setError('Only ' + this.maxUploads + ' files can be uploaded at one time')
          return false
        }
        if (this.files.findIndex(existingFile => existingFile.file.name === file.name) === -1) {
          const fileObj = this.uploadFactory(file)
          this.files.push(fileObj)
        }
      })
      // start upload if queue is not being used i.e not multiple
      if (!this.multiple) {
        this.upload()
      }
    },

    /**
     * Set an error message
     *
     * @param {String} error
     */
    setError (error) {
      this.errorMessage = error
    },

    /**
     * Reset the error message
     */
    resetError () {
      this.errorMessage = null
    },

    /**
     * Returns a FileUpload object
     *
     * @param  {File} file
     * @return {FileUpload|ImageUpload}
     */
    uploadFactory (file) {
      let fileObj
      if (this.isImage(file)) {
        fileObj = new ImageUpload(file)
        this.getImage(fileObj)
        return fileObj
      }
      return new FileUpload(file)
    },

    /**
     * Remove file from the file list
     *
     * @param  {File} file
     */
    removeFile (file) {
      this.resetError()
      const index = this.files.indexOf(file)
      this.files.splice(index, 1)
    },

    /**
     * Is the file an Image?
     *
     * @param {File} file
     * @return {Boolean}
     */
    isImage (file) {
      return ['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) !== -1
    },

    /**
     * Get a preview image
     *
     * @param {Object} fileObj
     */
    getImage (fileObj) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.resizeImage(e.target.result, this.maxThumbWidth, this.maxThumbHeight, fileObj)
      }
      reader.readAsDataURL(fileObj.file)
    },

    /**
     * Create resized image.
     * Draw reader result onto resized canvas element then set the dataUri to the ImageUpload.image property
     *
     * @param {String} src
     * @param {Number} maxWidth
     * @param {Number} maxHeight
     * @param {ImageUpload} fileObj
     */
    resizeImage (src, maxWidth, maxHeight, fileObj) {
      const canvas = document.createElement('canvas')
      const img = new Image()
      const ctx = canvas.getContext('2d')
      img.src = src
      img.onload = () => {
        const resize = this.calculateAspectRatioFit(img.width, img.height, maxWidth, maxHeight)
        canvas.width = resize.width
        canvas.height = resize.height
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
        fileObj.image = canvas.toDataURL(fileObj.file.type, 0.8)
      }
    },

    /**
     * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
     * images to fit into a certain area.
     *
     * @param {Number} srcWidth Source area width
     * @param {Number} srcHeight Source area height
     * @param {Number} maxWidth Fittable area maximum available width
     * @param {Number} maxHeight Fittable area maximum available height
     * @return {Object} { width, heigth }
     */
    calculateAspectRatioFit (srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
      }
    },

    /**
     * Formats bytes to human string
     * @see https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable#answer-20463021
     * @param  {Number} a
     * @param  {[type]} b
     * @param  {[type]} c
     * @param  {[type]} d
     * @param  {[type]} e
     * @return {String}
     */
    fileSize (a, b, c, d, e) {
      const size = (b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) +
        ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
      return size
    },

    /**
     * Style object for the progress bar
     *
     * @return {Object}
     */
    progressBarStyle (fileObj) {
      return {
        width: fileObj.percent + '%'
      }
    }
  },
  mounted () {
    this.$on('fileUploaded', file => this.removeFile(file))
  }
}
</script>
<style lang="stylus">
.vuejs-uploader
  label
    cursor pointer
  [type=file]
    display none

.vuejs-uploader__error
  background pink
  padding 10px
  margin 10px 0

.vuejs-uploader__queue
  list-style-type none
  padding 0
  border-top 1px solid #eee
  padding-top 10px

.vuejs-uploader__btn
  overflow hidden
  position relative
  padding 6px 10px
  border 1px solid #ccc
  border-radius 3px
  font-size 100%
  background inherit
  font-family inherit
  margin-right 2px

.vuejs-uploader__btn--delete
  padding 3px 6px

.vuejs-uploader__file
  border-bottom 1px solid #eee
  padding-bottom 10px
  margin-bottom 10px
  display flex

.vuejs-uploader__file--preview
  display inline-block
  width 100px
  display flex
  align-items center
  justify-content center

.vuejs-uploader__file--meta
  display inline-block
  flex-grow 1

.vuejs-uploader__file--filename
.vuejs-uploader__file--filesize
  vertical-align top
  margin 0

.vuejs-uploader__progress-bar
  display inline-block
  height 2px
  background limegreen

.loading:after
  content ''
  display block
  font-size 10px
  width 1em
  height 1em
  margin-top -0.5em
  animation spinner 1500ms infinite linear
  border-radius 0.5em
  box-shadow rgba(0, 0, 0, 0.25) 1.5em 0 0 0, rgba(0, 0, 0, 0.25) 1.1em 1.1em 0 0, rgba(0, 0, 0, 0.25) 0 1.5em 0 0, rgba(0, 0, 0, 0.25) -1.1em 1.1em 0 0, rgba(0, 0, 0, 0.25) -1.5em 0 0 0, rgba(0, 0, 0, 0.25) -1.1em -1.1em 0 0, rgba(0, 0, 0, 0.25) 0 -1.5em 0 0, rgba(0, 0, 0, 0.25) 1.1em -1.1em 0 0

@keyframes spinner
  0%
    transform: rotate(0deg);

  100%
    transform: rotate(360deg);

</style>
