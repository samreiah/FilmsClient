<template>
  <div id="app" class="text-center">
    <Navigation/>
    <router-view/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Navigation from './components/Includes/Navigation'
  export default {
    name: 'app',

    components: {
      Navigation
    },
    computed: {
      ...mapState({
        userStore: state => state.userStore
      })
    },
    created () {
      const userObj = JSON.parse(window.localStorage.getItem('authUser'))
      this.$store.dispatch('setUserObj', userObj)
    }
  }
</script>


<style lang="sass">
  @import './assets/css/bootstrap.css'
</style>

