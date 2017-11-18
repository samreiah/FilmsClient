<template>
    <div class="col-xs-12" id="filmList">
        <div class="col-xs-12">
            <router-link :to="{ name: 'CreateFilm'}" class="btn btn-primary pull-right" v-if="userStore.authUser !== null && userStore.authUser.access_token !== null">Add Films 
            </router-link>
        </div>
        <div class="col-xs-12 col-md-8 col-md-push-2" v-for="film in films">
            <h1><router-link :to="{ name: 'Film', 
                        params: { slug: film.slug }}" class="">{{ film.name }} 
                </router-link>
            </h1>
            <p>{{ film.description }}</p>
            <div class="col-xs-12 col-md-8 col-md-push-2 text-center">
                <img class="img-responsive" :src="filmImageUrl + film.photo" align="center"/>
            </div>
        </div>

        <br/>

        <div class="col-xs-12">
            <ul class="pagination">
                <li v-if="currentPage > 1">
                    <router-link 
                        :to="{ name: 'Films', 
                        query: { page: currentPage - 1 }}" 
                        class="" 
                        aria-label="Previous">
                        <span aria-hidden="true">«</span>
                    </router-link>
                </li>
                <li v-for="page in pagesNumber" :class="{'active': page == currentPage}">
                    <router-link 
                        :to="{ name: 'Films', 
                        query: { page: page }}" class="">{{ page }}
                    </router-link>
                </li>
                <li v-if="currentPage < lastPage">
                    <router-link 
                        :to="{ name: 'Films', query: { page: currentPage + 1 }}" 
                        class="" aria-label="Next">
                        <span aria-hidden="true">»</span>
                    </router-link>
                </li>

            </ul>
            {{currentPage}}
        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getHeaders, GetAllFilmsUrl, filmImageUrl} from './../config'
  export default {
    name: 'Films',

    data () {
      return {
        currentPage: 0,
        fromPage: 0,
        toPageNumber: 1,
        totalPages: null,
        films: [],
        filmImageUrl: filmImageUrl,
        offset: 0,
        lastPage: 0
      }
    },

    created () {
      let page = parseInt(this.$route.query.page)

      if (page === null || page === 0 || page === '' || page === undefined || isNaN(page)) {
        this.toPageNumber = 1
        this.currentPage = 1
      } else {
        this.toPageNumber = page + 1
        this.currentPage = page
      }

      this.getFilms()
    },

    methods: {
      getFilms () {
        this.$http.get(GetAllFilmsUrl, {headers: getHeaders(), params: {page: this.toPageNumber}})
        .then(response => {
          this.fromPage = response.data.data.from
          this.toPageNumber = response.data.data.to
          this.totalPages = response.data.data.total
          this.films = response.data.data.data
          this.offset = response.data.data.per_page
          this.lastPage = response.data.data.last_page
        })
        .catch(errors => {
          let ServerErrorMessage = errors.body.message
          if (ServerErrorMessage) {
            this.errors.add('server_error', ServerErrorMessage)
          }
          this.data = []
        })
      }

    },

    computed: {
      ...mapState({
        userStore: state => state.userStore
      }),

      pagesNumber: function () {
        if (!this.toPageNumber) {
          return []
        }
        let pagesArray = []
        for (let from = 1; from <= this.totalPages; from++) {
          pagesArray.push(from)
        }
        return pagesArray
      }
    }
  }
</script>