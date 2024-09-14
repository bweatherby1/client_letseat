import { clientCredentials } from "../../utils/client";

const endpoint = clientCredentials.databaseURL.replace(/"/g, '');

const getAllRestaurants = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/restaurants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});





const getSingleRestaurant = (id) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/restaurants/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});

const createRestaurant = (restaurant) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restaurant),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});

const updateRestaurant = async (id, restaurantData) => {
  const response = await fetch(`${endpoint}/restaurants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...restaurantData,
      user: restaurantData.user.uid
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update restaurant');
  }
  return response.json();
};

const deleteRestaurant = (id) => {
  return fetch(`${clientCredentials.databaseURL}/restaurants/${id}`, {
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

  
const toggleRestaurantSelection = async (restaurantId, userId) => {
    const response = await fetch(`${clientCredentials.databaseURL}/selected_restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restaurant_id: restaurantId, user_id: userId }),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle restaurant selection');
    }
    return response.json();
  };

export {
  getAllRestaurants,
  getSingleRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantSelection,
};
