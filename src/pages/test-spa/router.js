import Vue from 'vue'
import Router from 'vue-router'
import ActivityList from './components/activity-list.vue'
// 互动活动个子页面
const Score = () => import(/* webpackChunkName: "score" */ './components/score/score.vue')
const Healthy = () => import(/* webpackChunkName: "healthy" */ './components/healthy/healthy.vue')
const Activity = () => import(/* webpackChunkName: "activity" */ './components/activity/activity.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '互动活动',
      component: ActivityList,
      meta: {
        title: '互动活动'
      }
    },
    // 积分兑换和有奖分享一样
    {
      path: '/score',
      name: '积分兑换',
      component: Score,
      meta: {
        title: '积分兑换'
      }
    },
    {
      path: '/share',
      name: '分享有奖',
      component: Score,
      meta: {
        title: '分享有奖'
      }
    },
    {
      path: '/healthy',
      name: '健康沙龙',
      component: Healthy,
      meta: {
        title: '健康沙龙'
      }
    },
    {
      path: '/activity',
      name: '用户活动',
      component: Activity,
      meta: {
        title: '用户活动'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 路由变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  next()
})

export default router
