<template>
  <div id="app">
    <ul>
      <li>Single file uploader
        <uploader end-point="http://localhost:5000" :multipart="true">
          <img-placeholder :width="200" :height="150" slot="browse"></img-placeholder>
        </uploader>
      </li>
      <li>Multiple File uploader
        <uploader end-point="http://localhost:5000" :multipart="true" :multiple="true"></uploader>
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

}
</style>
