<template>
  <ul 
    class="activity-list" 
    >
    <li 
      class="item"
      v-for="(activity, idx) in activities"
      :key="idx"
      :data-proxy="activity.id"
      @click="redirect(activity)"
      >
      <span>{{ activity.name }}</span>
      <i></i>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'activity-list',
  data () {
    return {
      activities: [
        {
          id: 'score',
          name: '积分兑换'
        },
        {
          id: 'share',
          name: '分享有奖'
        },
        {
          id: 'healthy',
          name: '健康沙龙'
        },
        {
          id: 'activity',
          name: '用户活动'
        }
      ]
    }
  },
  methods: {
    redirect (activity) {
      this.$router.push(activity.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-list {
  color: blue;
}
</style>



