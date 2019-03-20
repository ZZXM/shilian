// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 开发用vConsole
// import vConsole from 'vconsole';
// new vConsole();

// 引入 FastClick
import FastClick from 'fastclick'
FastClick.attach(document.body);

// 引入 jquery
import $ from 'jquery';

// 引入bus
import Bus from './bus.js';
Vue.prototype.$bus = Bus;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
