<template>
  <div id="app">
    <h1>Uploader demos</h1>
    <ul>
      <li>Single file multipart uploader
        <uploader end-point="http://localhost:5000" :multipart="true">
          <img-placeholder :width="200" :height="150" slot="browse"></img-placeholder>
        </uploader>
      </li>

      <li>Multiple File multipart uploader
        <uploader end-point="http://localhost:5000" :multipart="true" :multiple="true"></uploader>
      </li>

      <li>Multiple File multipart uploader with extra form element slot
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
