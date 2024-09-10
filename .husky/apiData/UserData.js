import { clientCredentials } from "../../utils/client";

const getAllUsers = () => {
  return fetch(`${clientCredentials.databaseURL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    });
};

const getSingleUser = (uid) => {
  return fetch(`${clientCredentials.databaseURL}/users/${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    });
};

const deleteUser = (uid) => {
  return fetch(`${clientCredentials.databaseURL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return response.json();
    });
};

const updateUser = (uid, updatedUser) => {
  return fetch(`${clientCredentials.databaseURL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return response.json();
    });
};

export { deleteUser, updateUser, getAllUsers, getSingleUser };
