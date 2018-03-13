import fileHelpers from '@/helpers/file'
export default class FileUpload {
  constructor (file) {
    this.file = file
    this.filesize = file.size
    this.formattedFilesize = fileHelpers.fileSize(file.size)
    this.error = null
    this.percentageUploaded = 0
    this.uploadedParts = []
    this.totalParts = 1
    this.extension = fileHelpers.fileExtension(file.name)
    this.isUploading = false
  }

  setProgress (progressEvent) {
    this.percentageUploaded = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  }

  setMultipartProgress (progressEvent, totalParts, currentPart) {
    this.totalParts = totalParts
    this.addPart(currentPart)
    const index = this.uploadedParts.findIndex(part => part.part === currentPart)
    this.uploadedParts[index].loaded = Math.round((progressEvent.loaded * 100) / progressEvent.total)

    return this.percent
  }

  addPart (part) {
    if (this.uploadedParts.indexOf(part) === -1) {
      this.uploadedParts.push({
        part: part,
        loaded: 0
      })
    }
  }

  get singlepartUploadPercent () {
    return this.percentageUploaded
  }

  get multipartUploadPercent () {
    const partSize = 100 / this.totalParts
    const percent = this.uploadedParts.reduce((acc, val) => {
      return acc + (val.loaded * partSize / 100)
    }, 0)
    return percent
  }
}
