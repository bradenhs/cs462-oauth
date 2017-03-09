const config = require('./oauthConfig')
const axios = require('axios').default
const firebase = require('firebase')

firebase.initializeApp({
  apiKey: "AIzaSyB4pSlsJFpRDcUGJ7r5WoSwJtXS00q7lWs",
  authDomain: "cs462oauth.firebaseapp.com",
  databaseURL: "https://cs462oauth.firebaseio.com",
  storageBucket: "cs462oauth.appspot.com",
  messagingSenderId: "930521555452"
});


const access_token = document.location.hash.split('#access_token=')[1]

const loginButton = document.querySelector('#login')
const data = document.querySelector('#data')
const usersEl = document.querySelector('#users')

firebase.database().ref('users').on('value', function(snapshot) {
  const users = snapshot.val()
  let html = '<h1>Users</h1><div>'
  Object.keys(users).forEach(key => {
    html += '<a href="https://foursquare.com/user/' + key + '">' +
      users[key].firstName + ' ' + users[key].lastName +
    '</a>';
  })
  usersEl.innerHTML = html + '</div>'
})

if (access_token) {
  loginButton.remove()
  axios.get('https://api.foursquare.com/v2/users/self', {
    params: { oauth_token: access_token, v: '20170309' }
  }).then(function(response) {
    let data = response.data.response;
    firebase.database().ref('users/' + data.user.id).set({
      firstName: data.user.firstName,
      lastName: data.user.lastName,
    })
  })
  axios.get('https://api.foursquare.com/v2/users/self/checkins', {
    params: { oauth_token: access_token, v: '20170309' }
  }).then(function(response) {
    data.innerHTML = '<h2>Your checkin data</h2>' +
      JSON.stringify(response.data, null, ':::').replace(/\n/g, '<br/>')
  })
} else {
  loginButton.addEventListener('click', function() {
    document.location =
      'https://foursquare.com/oauth2/authenticate' +
      '?client_id=' + config.clientId +
      '&response_type=token' +
      '&redirect_uri=https://oauth.bradenhs.com'
  })
}


// const OAuth2 = require('oauth').OAuth2

// const oauth = new OAuth2(
//   config.clientId,
//   config.clientSecret,
//   'https://foursquare.com/',
//   null,
//   'oauth2/authenticate',
//   null
// )

// oauth.getOAuthAccessToken(
//   '',
//   {'grant_type':'client_credentials'},
//   function (e, access_token, refresh_token, results) {
//     console.log('bearer: ',access_token);
//   }
// );
