<template>
  <div>
    <h2>变粗的1px细线：</h2>
    <div id="common-1px"></div>
    <h2>真正的1px细线（不支持圆角）：</h2>
    <div id="real-1px"></div> 
    <h2>上边框（ios与部分低端安卓，另外三条边框任然显示）：</h2>
    <div id="real-top-1px-no-fixed"></div>
    <h2>上边框（兼容低版本安卓与iphone）：</h2>
    <div id="real-top-1px"></div>
    <h2>右边框：</h2>
    <div id="real-right-1px"></div>
    <h2>下边框：</h2>
    <div id="real-bottom-1px"></div>
    <h2>左边框：</h2>
    <div id="real-left-1px"></div>
    <h2>圆角1px细线（transform与伪类实现）：</h2>
    <div class="circle"></div>

    <img src="../imgs/test-svg-1px-border.png" alt="">
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
/* svg绘线函数文件路径 src/assets/sass/svg.scss 已通过webpack引入 */
#real-1px {
  margin: 10px;
  height: 20px;
}

#real-1px {
  border: 1px solid;
  border-image: svg(1px-border param(--color red)) 1 stretch;
}

#common-1px {
  margin: 10px;
  height: 20px;
  border: 1px solid red;
}

#real-top-1px {
  margin: 10px;
  height: 20px;
  
  // ios与一部分低端安卓需要将其余三条边的border设置成0, 这里用一个mixin解决
  @include setSvgSingleBorder(top)
  border-image: svg(1px-border param(--color red)) 1 stretch;
}

#real-top-1px-no-fixed {
  margin: 10px;
  height: 20px;
  
  border-top: 1px solid;
  border-image-source: svg(1px-border param(--color red));
  border-image-slice: 1;
  border-image-repeat: stretch;
}

#real-right-1px {
  margin: 10px;
  height: 20px;
  
  @include setSvgSingleBorder(right)
  border-image: svg(1px-border param(--color red)) 1 stretch;
}

#real-bottom-1px {
  margin: 10px;
  height: 20px;
  
  @include setSvgSingleBorder(bottom)
  border-image: svg(1px-border param(--color red)) 1 stretch;
}

#real-left-1px {
  margin: 10px;
  height: 20px;
  
  @include setSvgSingleBorder(left)
  border-image: svg(1px-border param(--color red)) 1 stretch;
}

// transform和伪类也可以实现1px细线（支持圆角）
.circle {
  width: 50px;
  height: 50px;
  margin: 10px;
  border-radius: 50px;
  position: relative;

  &:after {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid red;
    border-radius: 100px;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
  }
}

img {
  width: 100%;
  margin-top: 10px;
}
</style>


