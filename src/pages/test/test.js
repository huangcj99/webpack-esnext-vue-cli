// style import
import 'assets/css/reset.css'
import './test.scss'
// components import
import 'babel-polyfill'
import Vue from 'vue'
import App from './test.vue'

Vue.config.productionTip = false

/* eslint no-new: "off" */
new Vue({
  el: '#app',
  render: h => h(App)
})
