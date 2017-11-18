import axios from 'axios'
import {ClientId, ClientSecret, apiDomain, apiVersion} from './env'

export const apiDomainWithVersion = apiDomain + apiVersion
export const loginUrl = apiDomain + 'oauth/token'

/* Routes Related to user */
export const getUserUrl = apiDomainWithVersion + 'user'
export const registerUserUrl = apiDomainWithVersion + 'user/register'

/* Routes related to Films */
export const filmImageUrl = apiDomain + 'images/films/'
export const GetAllFilmsUrl = apiDomainWithVersion + 'film/get-films'
export const GetFilmUrl = apiDomainWithVersion + 'film/get-film-by-slug'
export const AddCommentUrl = apiDomainWithVersion + 'film/add-comment'
export const AddFilmUrl = apiDomainWithVersion + 'film/add-film'

export const getPasswordHeader = function () {
  const tokenData = JSON.parse(window.localStorage.getItem('authUser'))

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + tokenData.access_token
  }

  return headers
}

export const getHeaders = function () {
  const clientHeaders = JSON.parse(window.localStorage.getItem('clientHeaders'))
  let isExpired = false

  if (clientHeaders !== null) {
    if (clientHeaders.access_token !== null && clientHeaders.expires_in !== null && clientHeaders.expires_in > Date.now()) {
      return {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + clientHeaders.access_token
      }
    } else {
      isExpired = true
    }
  } else {
    isExpired = true
  }

  if (isExpired === true) {
    const postData = {
      grant_type: 'client_credentials',
      client_id: ClientId,
      client_secret: ClientSecret
    }

    const clientHeaders = {}

    axios.post(loginUrl, postData)
    .then(response => {
      clientHeaders.access_token = response.data.access_token
      clientHeaders.expires_in = Date.now() + response.data.expires_in

      window.localStorage.setItem('clientHeaders', JSON.stringify(clientHeaders))
      getHeaders()
    })
    .catch(errors => {
      window.localStorage.setItem('clientHeaders', JSON.stringify(clientHeaders))
      getHeaders()
    })
  }
}
