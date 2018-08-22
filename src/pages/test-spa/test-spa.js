import 'assets/css/reset.css'
// components import
import Vue from 'vue'
import router from './router'
import App from './test-spa.vue'

Vue.config.productionTip = false

/* eslint no-new: "off" */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
