<template>
  <Dashboard v-if="loggedIn" />
  <Home v-else />
</template>

<script>
import Home from './Home.vue'
import Dashboard from './Dashboard.vue'
export default {
  name: 'Root',
  components: { Home, Dashboard },
  data: function () {
    return {
      loggedIn: false
    }
  },
  mounted: function () {
    this.loggedIn = !!localStorage.getItem('accessToken')
  }
}
</script>
