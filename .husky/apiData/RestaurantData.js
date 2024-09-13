import { clientCredentials } from "../../utils/client";

const baseURL = 'http://localhost:8000';

const getAllRestaurants = () => {
  const url = `${baseURL}/restaurants`;
  console.log('Fetching from URL:', url);
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};


const getSingleRestaurant = (restaurantId) => {
  return fetch(`${clientCredentials.databaseURL}/restaurants/${restaurantId}`, {
    method: 'GET',
     headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching restaurant:', error);
      throw error;
    });
  };

const createRestaurant = (restaurant) => {
  return fetch(`${clientCredentials.databaseURL}/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurant),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error creating restaurant:', error);
      throw error;
    });
  };

const updateRestaurant = (restaurant) => {
  return fetch(`${clientCredentials.databaseURL}/restaurants/${restaurant.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurant),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error updating restaurant:', error);
      throw error;
    });
  };

const deleteRestaurant = (restaurantId) => {
  return fetch(`${clientCredentials.databaseURL}/restaurants/${restaurantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error deleting restaurant:', error);
      throw error;
    });
  };

export {
  getAllRestaurants,
  getSingleRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
