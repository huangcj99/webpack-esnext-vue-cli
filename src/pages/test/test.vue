<template>
  <div class="content">
    <!-- 去除注释可查看对应例子 -->
    <TestSvg></TestSvg>
    <!-- <TestAspectRatio></TestAspectRatio> -->
    <!-- <TestPostcssPlugin></TestPostcssPlugin> -->
  </div>
</template>

<script>
import TestSvg from './components/test-svg'
import TestAspectRatio from './components/test-aspect-ratio'
import TestPostcssPlugin from './components/test-postcss-auto-set-imageset'

export default {
  components: {
    TestSvg,
    TestAspectRatio,
    TestPostcssPlugin
  },
  props: {},
  data () {
    return {}
  },
  created () {},
  computed: {},
  methods: {}
}
</script>

<style lang="scss">
.content {
  width: 100vw;
  height: 100vh;
  font-size: 40px;
}
</style>
