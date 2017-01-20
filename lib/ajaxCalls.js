import React from 'react';

import { AsyncStorage } from 'react-native';

import { store } from './reduxStore';
import { baseUrl } from './localvars.js';

var api = {};

// Many of our api requests have a similar structure. Since 'fetch' is somewhat length,
// this template is used to shorten future uses. DRYAF
var fetchTemplate = function(callback, endpoint, method, body = null) {
  AsyncStorage.getItem('JWTtoken').then((token) => {
    return fetch(endpoint, {
      method: method || 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ('JWT ' + token)
      },
      body: body
    })
  })
  .then(function(response) {
    if (!method || method === 'GET') {
      var a = response._bodyInit;
      a = JSON.parse(a);
      callback(a);
    } else {
      callback(response);
    }
  })
  // .catch(function(error) {
  //   console.log('API call error', error);
  // });
};

api.uploadPhoto = function(options, callback) {
  AsyncStorage.getItem('JWTtoken').then((token) => {
    options.headers['Content-Type'] = 'multipart/formdata';
    options.headers['Authorization'] = 'JWT ' + token;
    options.headers['Cache-Control'] = 'no-cache';
    return fetch(baseUrl + '/media/upload', options);
  })
  .then(function(response) {
    callback(response)
  })
}


api.getNearbyEvents = function(callback) {

  var lat = arguments[1] || 37.773972, lon = arguments[2] || -122.431297;

  fetchTemplate(callback, baseUrl + '/api/activities/nearby/' + lat + '/' + lon + '/25');
}

api.getSports = function(callback) {
  fetchTemplate(callback, baseUrl + '/api/sports');
}

api.getFriendsEvents = function(callback) {
  fetchTemplate(callback, baseUrl + '/api/activities/myfriends/25');
}

api.getUserByUsername = function(username, callback) {
  fetchTemplate(callback, baseUrl + '/api/profile/' + username);
}

api.getEventById = function(id, callback) {
  if (id === undefined) console.log('ID IS UNDEFINED. WTF.');
  fetchTemplate(callback, baseUrl + '/api/activities/' + id);
}

api.createEvent = function(event) {
  AsyncStorage.getItem('JWTtoken').then((token) => {
    fetch(baseUrl + '/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('JWT ' + token)
      },
      body: JSON.stringify(event)
    });
  })

}

api.editEvent = function(id, callback) {
  fetchTemplate(callback, baseUrl + '/api/activities/' + id, 'PUT');
}

api.signupUser = function(callback, body) {
  fetchTemplate(callback, baseUrl + '/auth/signup', 'POST', body);
}

api.editProfile = function(id, callback, body) {
  fetchTemplate(callback, baseUrl + '/api/profile/' + id, 'PATCH', body);
}

api.editInterests = function(callback, body) {
  fetchTemplate(callback, baseUrl + '/api/interests', 'PATCH', body);
}

api.getFriendListById = function(id, callback) {
  fetchTemplate(callback, baseUrl + '/api/friends/' + id);
}

api.getFriendRequests = function(callback) {
  fetchTemplate(callback, baseUrl + '/api/friends/myrequests');
}

api.acceptFriendRequests = function(id, callback) {
  fetchTemplate(callback, baseUrl + '/api/friends/accept/' + id, 'PUT');
}

api.deleteFriendRequests = function(id, callback) {
  fetchTemplate(callback, baseUrl + '/api/friends/myrequests/' + id, 'DELETE');
}

api.makeFriendRequest = function(id, callback) {
  fetchTemplate(callback, baseUrl + '/api/friends/makerequest/' + id, 'PUT');
}

api.filterEvents = function(eventList, options, callback) {

  console.log('we are trying to run!')

  // Parse the options object.
  var eventArrType,
      date,
      sports,
      filterUrl = '/api/activities/';

  if (eventList === 'nearbyEvents') eventArrType = 'nearby/25/25';
  if (eventList === 'friendsEvents') eventArrType = 'myfriends';
  if (eventList === 'myEvents') eventArrType = 'mine';

  if (!options.date) date = false;
  else data = options.date;

  if (!options.sports) sports = false;
  else sports = options.sports;

  var comp = store.getState().sportsToIds;

  // transform comp
  newComp = {};
  for (var i = 0; i < comp.length; i++) {
    newComp[comp[i].sport] = comp[i].id;
  }
  console.log('newComp is:', newComp);

  var parsedSports = [];

  if (sports) {
    sports.forEach(function(sport) {
      parsedSports.push(newComp[sport]);
    })
  }

  sports = parsedSports;
  console.log("sports is:", sports);


  filterUrl += eventArrType + '/25';

  if (date && date.start) filterUrl += '?start=' + date.start;
  if (date && date.end) filterUrl += '?end=' + date.end
  if (sports) filterUrl += '?sportIds=' + JSON.stringify(sports)

  console.log('The final, filtered url is:', filterUrl);

  AsyncStorage.getItem('JWTtoken').then((token) => {
    return fetch(baseUrl + filterUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ('JWT ' + token)
      }
    })
    .then(function(response) {
      var data = response._bodyInit;
      data = JSON.parse(data);
      callback(data);
    })
  })
}

api.getInterests = function(callback) {
  fetchTemplate(callback, baseUrl + '/api/sports');
}

module.exports = {
  api: api
}
