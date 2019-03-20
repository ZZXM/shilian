import Vue from 'vue'
import Router from 'vue-router'
import Loading from '../view/Loading.vue'
import Draw from '../view/Draw.vue'
import Show from '../view/Show.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // 加载页
    {
      path: '/',
      name: 'Loading',
      component: Loading
    },
    // 绘图页
    {
      path: '/draw',
      name: 'Draw',
      component: Draw
    },
    // 展示页
    {
      path: '/show',
      name: 'Show',
      component: Show
    },
    // one for all
    {
      path: '*',
      redirect: '/'
    }

  ]
})
