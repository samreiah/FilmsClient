<template>
    <div clss="row">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading"><h1>Login</h1></div>

                <span v-if="errors.has('server_error')" class="help-block text-center text-danger">
                    <strong>{{ errors.first('server_error') }}</strong>
                </span>

                <div class="panel-body">
                    <form v-on:submit.prevent="validateBeforeSubmit" method="POST">
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input  type="email" 
                                    class="form-control" 
                                    id="email" 
                                    aria-describedby="emailHelp" 
                                    placeholder="Enter email"
                                    v-model="login.email"
                                    v-validate.initial data-vv-rules="required|email">
                            <span v-if="errors.has('email')" class="help-block text-danger">
                                <strong>{{ errors.first('email') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" 
                                    class="form-control" 
                                    id="password" 
                                    aria-describedby="passwordHelp" 
                                    placeholder="Password"
                                    v-model="login.password"
                                    v-validate.initial data-vv-rules="required">
                            <span v-if="errors.has('password')" class="help-block text-danger">
                                <strong>{{ errors.first('password') }}</strong>
                            </span>
                        </div>

                        <button class="btn btn-primary">Login</button>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {loginUrl, getUserUrl, getPasswordHeader} from '../config'
import {passwordClientId, passwordClientSecret} from '../env'
import {mapState} from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      login: {
        email: 'samreiah@gmail.com',
        password: 'Film@123'
      }
    }
  },
  created () {
    if (this.userStore.authUser !== null && this.userStore.authUser.access_token !== null) {
      this.$router.push({name: 'Home'})
    }
  },
  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },
  methods: {

    validateBeforeSubmit (e) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.HandleLogin()
      }
    },

    HandleLogin () {
      const postData = {
        grant_type: 'password',
        client_id: passwordClientId,
        client_secret: passwordClientSecret,
        username: this.login.email,
        password: this.login.password,
        scope: '*'
      }

      const authUser = {}

      this.$http.post(loginUrl, postData)
      .then(response => {
        if (response.status === 200) {
          authUser.access_token = response.data.access_token
          authUser.refresh_token = response.data.refresh_token
          authUser.expires_in = response.data.expires_in
          window.localStorage.setItem('authUser', JSON.stringify(authUser))
          this.retrieveUser(authUser)
        }
      })
      .catch(errors => {
        let ServerErrorMessage = errors.body.message
        if (ServerErrorMessage) {
          this.errors.add('server_error', ServerErrorMessage)
        }
      })
    },

    retrieveUser (authUser) {
      this.$http.get(getUserUrl, {headers: getPasswordHeader()})
      .then(response => {
        authUser.email = response.body.data.email
        authUser.name = response.body.data.name
        window.localStorage.setItem('authUser', JSON.stringify(authUser))
        this.$store.dispatch('setUserObj', authUser)
        this.$router.push({name: 'Home'})
      })
      .catch(errors => {
        let ServerErrorMessage = errors.body.message
        if (ServerErrorMessage) {
          this.errors.add('server_error', ServerErrorMessage)
        }
      })
    }
  }
}
</script>