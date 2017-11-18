<template>
    <div clss="row">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading"><h1>Signup</h1></div>

                <span v-if="errors.has('server_error')" class="help-block text-center text-danger">
                    <strong>{{ errors.first('server_error') }}</strong>
                </span>

                <div class="panel-body">
                    <form v-on:submit.prevent="validateBeforeSubmit" method="POST">

                        <div class="form-group">
                            <label for="name">Name</label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="name" 
                                    name="name"
                                    aria-describedby="nameHelp" 
                                    placeholder="Enter Name"
                                    v-model="name"
                                    v-validate.initial data-vv-rules="required">
                            <span v-if="errors.has('name')" class="help-block text-danger">
                                <strong>{{ errors.first('name') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input  type="email" 
                                    class="form-control" 
                                    id="email" 
                                    name="email"
                                    aria-describedby="emailHelp" 
                                    placeholder="Enter email"
                                    v-model="email"
                                    v-validate.initial data-vv-rules="required|email">
                            <span v-if="errors.has('email')" class="help-block text-danger">
                                <strong>{{ errors.first('email') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input  type="password" 
                                    class="form-control" 
                                    id="password" 
                                    aria-describedby="passwordHelp" 
                                    placeholder="Enter Password"
                                    v-model="password"
                                    v-validate.initial data-vv-rules="required|confirmed:password_confirmation">
                            <span v-if="errors.has('password')" class="help-block text-danger">
                                <strong>{{ errors.first('password') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="password_confirmation">Password Confirmation</label>
                            <input  type="password" 
                                    class="form-control" 
                                    id="password_confirmation" 
                                    name="password_confirmation"
                                    aria-describedby="passwordHelp" 
                                    placeholder="Confirm Password"
                                    v-model="password_confirmation"
                                    v-validate.initial data-vv-rules="required">
                            <span v-if="errors.has('password_confirmation')" class="help-block text-danger">
                                <strong>{{ errors.first('password_confirmation') }}</strong>
                            </span>
                        </div>

                        <button class="btn btn-primary">SignUp</button>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {registerUserUrl, getHeaders} from '../config'
import {mapState} from 'vuex'

export default {
  name: 'Signup',

  data () {
    return {
      email: null,
      name: null,
      password: null,
      password_confirmation: null
    }
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  created () {
    if (this.userStore.authUser !== null && this.userStore.authUser.access_token !== null) {
      this.$router.push({name: 'Home'})
    }
  },

  methods: {
    validateBeforeSubmit (e) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.HandleSignup()
      }
    },

    HandleSignup () {
      const postData = {
        email: this.email,
        name: this.name,
        password: this.password,
        password_confirmation: this.password_confirmation
      }

      this.$http.post(registerUserUrl, postData, {headers: getHeaders()})
      .then(response => {
        this.$router.push({name: 'Login'})
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