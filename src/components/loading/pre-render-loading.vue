<template>
  <!-- 用于webpack在编译时预渲染到html中 -->
  <div class="loading-img"></div>
</template>

<script>
export default {
  
}
</script>

<style>
.loading-img {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url('./imgs/loading.gif') no-repeat center center;
  background-size: contain;
}
</style>
