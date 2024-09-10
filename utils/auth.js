import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

const checkUser = (userName, password) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/checkuser`, {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

const registerUser = (userInfo) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL.replace(/"/g, '')}/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: userInfo.name,
      userName: userInfo.userName,
      password: userInfo.password,
      bio: userInfo.bio,
      profilePicture: userInfo.profilePicture,
      streetAddress: userInfo.streetAddress,
      city: userInfo.city,
      state: userInfo.state,
      zipCode: userInfo.zipCode,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
      return resp.json();
    })
    .then(resolve)
    .catch(reject);
});

const signInWithUsername = (userName, password) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL.replace(/"/g, '')}/checkuser`, {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error('Invalid credentials');
      }
      return resp.json();
    })
    .then(resolve)
    .catch(reject);
});

const signOut = () => {
  firebase.auth().signOut();
  localStorage.removeItem('auth_token');
};

export {
  checkUser,
  registerUser,
  signInWithUsername,
  signOut,
};
