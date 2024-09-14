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
  console.log('Fetching restaurant with ID:', id);
  console.log('Full URL:', `${endpoint}/restaurants/${id}`);
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

const getRestaurantById = async (id) => {
    const response = await fetch(`${clientCredentials.databaseURL}/restaurants/${id}`);
    console.log('API URL:', `${clientCredentials.databaseURL}/restaurants/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch restaurant');
    }
    return response.json();
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
  getRestaurantById,
  toggleRestaurantSelection,
};
