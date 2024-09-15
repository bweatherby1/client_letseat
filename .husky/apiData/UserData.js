import { clientCredentials } from "../../utils/client";

const getAllUsers = () => {
  const apiUrl = clientCredentials.databaseURL.replace(/"/g, '');
  return fetch(`${apiUrl}/users`, {
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
  if (!uid) throw new Error('User ID is undefined');
  const apiUrl = clientCredentials.databaseURL.replace(/"/g, '');
  return fetch(`${apiUrl}/users/${uid}`)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed to fetch user: ${response.status} - ${text}`);
        });
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error in getSingleUser:', error);
      throw error;
    });
};

const deleteUser = (uid) => {
  const apiUrl = clientCredentials.databaseURL.replace(/"/g, '');
  return fetch(`${apiUrl}/users/${uid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 204) {
        return {};
      }
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return response.json();
    });
};

const updateUser = (uid, updatedUser) => {
  const apiUrl = clientCredentials.databaseURL.replace(/"/g, '');
  return fetch(`${apiUrl}/users/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  })
    .then(response => response.ok ? response.json() : Promise.reject(`Failed to update user: ${response.status}`))
    .catch(error => {
      console.error('Error in updateUser:', error);
      throw error;
    });
};

export { deleteUser, updateUser, getAllUsers, getSingleUser };
