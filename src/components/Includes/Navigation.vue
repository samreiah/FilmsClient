<template>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link :to="{ name: 'Home'}" class="navbar-brand">Films</router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <router-link :to="{ name: 'Films'}" class="">Films</router-link>
            </li>
            <li v-if="userStore.authUser !== null && userStore.authUser.access_token !== null">
              <a href="#">Welcome {{ userStore.authUser.name }}</a>
            </li>
            <li v-if="userStore.authUser !== null && userStore.authUser.access_token !== null">
              <a href="#" v-on:click="handleLogout">Logout</a>
            </li>
            <li v-if="userStore.authUser === null || userStore.authUser.access_token === null">
              <router-link :to="{ name: 'Login'}" class="">Login</router-link>
            </li>
            <li v-if="userStore.authUser === null || userStore.authUser.access_token === null">
              <router-link :to="{ name: 'Signup'}" class="">SignUp</router-link>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div><!--/.container-fluid -->
    </nav>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'Navigation',
  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },
  methods: {
    handleLogout () {
      const authUser = null
      window.localStorage.setItem('authUser', JSON.stringify(authUser))
      this.$store.dispatch('setUserObj', authUser)
      this.$router.push({name: 'Home'})
    }
  }
}
</script>