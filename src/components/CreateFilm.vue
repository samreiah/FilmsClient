<template>
    <div clss="row">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading"><h1>Add Film</h1></div>

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
                                    placeholder="Enter Name"
                                    v-model="film.name"
                                    v-validate.initial data-vv-rules="required">
                            <span v-if="errors.has('name')" class="help-block text-danger">
                                <strong>{{ errors.first('name') }}</strong>
                            </span>
                        </div>

                        <label for="name">Released On</label>
                        <datepicker :format="customFormatter" v-model="film.released_on"></datepicker>

                        <div class="form-group">
                            <label for="country">Country</label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="country" 
                                    name="country"
                                    placeholder="Enter country"
                                    v-model="film.country"
                                    v-validate.initial data-vv-rules="required">
                            <span v-if="errors.has('country')" class="help-block text-danger">
                                <strong>{{ errors.first('country') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="ticket_price">Ticket Price</label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="ticket_price" 
                                    name="ticket_price"
                                    placeholder="Enter Price"
                                    v-model="film.ticket_price"
                                    v-validate.initial data-vv-rules="required|numeric">
                            <span v-if="errors.has('ticket_price')" class="help-block text-danger">
                                <strong>{{ errors.first('ticket_price') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="rating">Rating</label>
                            <input  type="text" 
                                    class="form-control" 
                                    id="rating" 
                                    name="rating"
                                    placeholder="Enter rating"
                                    v-model="film.rating"
                                    v-validate.initial data-vv-rules="required|numeric|max_value:5|min_value:1">
                            <span v-if="errors.has('rating')" class="help-block text-danger">
                                <strong>{{ errors.first('rating') }}</strong>
                            </span>
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea name="description"
                                      class="form-control" 
                                      v-model="film.description"
                                      v-validate.initial data-vv-rules="required"></textarea>
                            <span v-if="errors.has('description')" class="help-block text-danger">
                                <strong>{{ errors.first('description') }}</strong>
                            </span>                    
                        </div>

                        <div class="form-group">
                            <label for="image">Select Image</label>
                            <input type="file" @change="onFileChange">
                        </div>

                        <div v-if="film.imageBase64">
                            <img class="preview" :src="film.imageBase64" />
                        </div>

                        <button class="btn btn-primary">Create</button>

                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {AddFilmUrl, getPasswordHeader} from '../config'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import {mapState} from 'vuex'

export default {
  name: 'CreateFilm',

  components: {
    Datepicker
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  created () {
    if (this.userStore.authUser === null || this.userStore.authUser.access_token === null) {
      this.$router.push({name: 'Home'})
    }
  },

  data () {
    return {
      film: {
        name: '',
        description: '',
        released_on: '',
        ticket_price: '',
        rating: '',
        country: '',
        image: '',
        imageBase64: ''
      }
    }
  },

  methods: {
    validateBeforeSubmit (e) {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        this.addFilm()
      }
    },

    addFilm () {
      const postData = {
        name: this.film.name,
        description: this.film.description,
        released_on: this.film.released_on,
        ticket_price: this.film.ticket_price,
        rating: this.film.rating,
        country: this.film.country
      }

      this.$http.post(AddFilmUrl, postData, {headers: getPasswordHeader()})
      .then(response => {
        this.$router.push({name: 'Films'})
      })
      .catch(errors => {
        let ServerErrorMessage = errors.body.message
        if (ServerErrorMessage) {
          this.errors.add('server_error', ServerErrorMessage)
        }
      })
    },

    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },

    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0])
    },

    createImage (file) {
      this.image = new Image()
      let reader = new FileReader()

      reader.onload = (e) => {
        this.film.image = file
        this.film.imageBase64 = e.target.result
      }
      reader.readAsDataURL(file)
    }

  }
}
</script>

<style>
.vdp-datepicker input[type="text"] {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
}

.preview {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
</style>