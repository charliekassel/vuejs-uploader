<template>
  <div id="app">
    <h1>Uploader demos</h1>
    <ul>
      <li>
        <p>Single file multipart uploader</p>
        <uploader end-point="http://localhost:5000" :multipart="true" :showProgressBar="true" @fileUploaded="demo1Status" @startUpload="resetLog(demo1)">
          <img-placeholder :width="200" :height="150" slot="browse"></img-placeholder>
        </uploader>
        <pre>{{ demo1 }}</pre>
      </li>

      <li>
        <p>Multiple File multipart uploader</p>
        <uploader end-point="http://localhost:5000" :multipart="true" :multiple="true"></uploader>
      </li>

      <li>
        <p>Multiple File multipart uploader with extra form element slot</p>
        <uploader end-point="http://localhost:5000" :multipart="true" :multiple="true" :userDefinedProperties="[{property: 'type', required: true}]">
          <template slot="extra" scope="props">
            <select v-model="props.fileObj.type">
              <option :value="null">select type</option>
              <option value="1">one</option>
              <option value="2">two</option>
              <option value="3">three</option>
            </select>
            <div><pre>{{ props.fileObj }}</pre></div>
          </template>
        </uploader>
      </li>

      <li>
        <p>Uploading with additional headers</p>
        <uploader end-point="http://localhost:5000" :headers="{Authorization: 'Bearer 123456'}"></uploader>
      </li>


      <li>
        <p>Using error handler</p>
        <uploader end-point="http://localhost:5000" :errorHandler="errorHandler"></uploader>
      </li>

    </ul>
  </div>
</template>

<script>
import Uploader from './components/Uploader'
import ImgPlaceholder from 'vuejs-image-placeholder'
export default {
  name: 'app',
  components: {
    Uploader,
    ImgPlaceholder
  },
  data () {
    return {
      demo1: null
    }
  },
  methods: {
    demo1Status (response) {
      this.demo1 = response
    },
    resetLog (prop) {
      this[prop] = null
    },

    errorHandler (error) {
      console.error(error, error.response)
      alert(error.message)
    }
  }
}
</script>

<style>
#app {
  padding: 20px 30px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 30px;
}
</style>
