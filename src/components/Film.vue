<template>
    <div class="col-xs-12" id="filmInfo">
        <div class="col-xs-12">
            <router-link :to="{ name: 'Films', 
                        query: { page: 1 }}" class="btn btn-primary pull-right">All Films 
            </router-link>
        </div>
        <div class="col-xs-12 col-md-8 col-md-push-2" v-if="film">
            <h1>{{ film.name }} <small>{{ film.description }}</small></h1>
            <p><span class="glyphicon glyphicon-calendar"></span> Released on : {{ film.released_on }}<b></b></p>
            <p>Ticket Price {{ film.ticket_price}} Country : {{ film.country }}</p>
            <p>Rating {{film.rating}}</p>
            <ul class="nav nav-pills" v-if="film.genres">
                <li role="presentation" v-for="genre in film.genres"><a href="#">{{genre.name}}</a></li>
            </ul>
            <div class="col-xs-12 col-md-8 col-md-push-2 text-center">
                <img class="img-responsive" :src="filmImageUrl + film.photo" align="center"/>
            </div>

            <div class="col-xs-12">
                <h1>Comments</h1>
                <div class="col-xs-8 col-md-8 col-md-offset-2 text-left" v-for="comment in film.comments" v-if="film.comments.length > 0">
                  <h4>{{ comment.user.name }}</h4>
                  <p>{{ comment.description }}</p>
                </div>
                <p v-if="film.comments.length == 0">Sorry No Comments Available</p>
            </div>

            <div class="col-xs-12" v-if="userStore.authUser !== null && userStore.authUser.access_token !== null">
                <form v-on:submit.prevent="postComment" action="POST">
                    <div class="form-group">
                    <label class="control-label">Enter your comment below</label>
                    <textarea 
                        name="comment"
                        class="form-control" 
                        v-model="comment" rows="5"
                        v-validate.initial data-vv-rules="required"></textarea>

                        <span v-if="errors.has('comment')" class="help-block text-center text-danger">
                            <strong>{{ errors.first('comment') }}</strong>
                        </span>
                    </div>

                    <div class="form-group">
                        <button class="btn btn-success" type="submit">Post comment</button>
                    </div>
                </form>
            </div>

        </div>

        <span v-if="errors.has('server_error')" class="help-block text-center text-danger">
            <strong>{{ errors.first('server_error') }}</strong>
        </span>

        
    </div>
</template>

<script>
import {getHeaders, GetFilmUrl, filmImageUrl, AddCommentUrl, getPasswordHeader} from './../config'
import {mapState} from 'vuex'
export default {
  name: 'Films',

  data () {
    return {
      slug: '',
      film: null,
      filmImageUrl: filmImageUrl,
      comment: ''
    }
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  created () {
    this.slug = this.$route.params.slug
    this.getFilm()
  },

  methods: {
    getFilm () {
      this.$http.get(GetFilmUrl, {headers: getHeaders(), params: {slug: this.slug}})
      .then(response => {
        this.film = response.data.data
      })
      .catch(errors => {
        let ServerErrorMessage = errors.body.message
        if (ServerErrorMessage) {
          this.errors.add('server_error', ServerErrorMessage)
        }
      })
    },

    postComment () {
      if (this.comment !== null && this.comment !== '' && this.comment !== undefined) {
        const postData = {
          'comment': this.comment,
          'film_id': this.film.id
        }

        this.$http.post(AddCommentUrl, postData, {headers: getPasswordHeader()})
        .then(response => {
          this.film.comments.push(response.data.data)
          this.comment = ''
        })
        .catch(errors => {
          console.log(errors)
        })
      } else {
        this.errors.add('commment', 'Empty Comment - Comment is required')
      }
    }
  }

}
</script>