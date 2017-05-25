<template>
  <div id="app">
    <uploader end-point="http://localhost:5000" :multiple="true" :multipart="true"></uploader>
  </div>
</template>

<script>
import Uploader from './components/Uploader'

export default {
  name: 'app',
  components: {
    Uploader
  }
}
</script>

<style>
#app {

}
</style>
