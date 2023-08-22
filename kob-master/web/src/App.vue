<template>
<NavBar></NavBar>
  <router-view/> <!--router-view会自动跟着网址变,在router里的index定义-->
</template>

<script>

//import $ from 'jquery';
//import { ref } from 'vue';
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"

  //前后端通信的固定写法
export default {
  components: {
    NavBar
  },
  setup() {

  }
  }

</script>

<style>
body {
  background-image: url("@/assets/background2.png");
  background-size: cover; 
} 
</style> 
 