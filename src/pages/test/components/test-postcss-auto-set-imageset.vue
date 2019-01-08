<template>
  <div class="img"></div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.img {
  // 现在项目是小于3kb的图片会被内联到css文件中，会增大css的体积，url-loader可以设置成0，这样全部图片都会抽出来
  // 也可以在mixin中集成背景图的设置，同样也是要通过注释标记
  // 也可以使用@include setBackgroundImage仅设置
  @include setFixedBackground(109px, 77px, '../imgs/@2x/icon_mes@2x.png');

  // 在设置的2x图后加上3x的注释，postcss插件会自动加入含有3x图的image-set属性
  // width: 109px;
  // height: 77px;
  // background-image: url('../imgs/@2x/icon_mes@2x.png'); /* 3x */
  // background-size: contain;
}
</style>


