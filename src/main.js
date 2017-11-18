// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import router from './router'
import store from './store'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VeeValidate)

VeeValidate.Validator.extend('passphrase', {
  getMessage: field => 'Sorry dude, wrong pass phrase.',
  validate: value => value.toUpperCase() === 'Demogorgon'.toUpperCase()
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authUser = JSON.parse(window.localStorage.getItem('authUser'))
    if (authUser && authUser.access_token) {
      next()
    } else {
      next({name: 'HelloWorld'})
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: { App }
})
