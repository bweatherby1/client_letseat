import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

const checkUser = (uid, password) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/checkuser`, {
    method: 'POST',
    body: JSON.stringify({ uid, password }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

const generateUID = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const registerUser = (userInfo) => new Promise((resolve, reject) => {
  const uid = generateUID();

  fetch(`${clientCredentials.databaseURL.replace(/"/g, '')}/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: userInfo.name,
      uid,
      password: userInfo.password,
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
    .then((data) => {
      localStorage.setItem('auth_token', data.token);
      resolve(data);
    })
    .catch(reject);
});

const signInWithUsername = (username, password) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL.replace(/"/g, '')}/checkuser`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
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
