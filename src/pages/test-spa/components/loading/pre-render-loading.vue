<template>
  <div class="loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
    </svg>
  </div>
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
