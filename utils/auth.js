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
      user_name: userInfo.user_name,
      password: userInfo.password,
      bio: userInfo.bio,
      profile_picture: userInfo.profile_picture,
      street_address: userInfo.street_address,
      city: userInfo.city,
      state: userInfo.state,
      zip_code: userInfo.zip_code,
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
    body: JSON.stringify({ user_name: userName, password }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      const storedSelectedRestaurants = localStorage.getItem(`selectedRestaurants_${data.uid}`);
      const selectedRestaurants = storedSelectedRestaurants ? JSON.parse(storedSelectedRestaurants) : [];
      resolve({
        ...data,
        selectedRestaurants,
      });
    })
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
