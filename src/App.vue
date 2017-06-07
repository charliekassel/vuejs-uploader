<template>
  <div id="app">
    <uploader end-point="http://localhost:5000" :multipart="true">
      <img-placeholder :show-ratio="true" slot="browse"></img-placeholder>
    </uploader>
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
