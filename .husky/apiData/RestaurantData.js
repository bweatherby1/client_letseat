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

const deleteRestaurant = async (id) => {
  const response = await fetch(`${endpoint}/restaurants/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete restaurant');
  }
  return true;
};

// .husky/apiData/RestaurantData.js

const createSelectedRestaurant = async (restaurantId, userId) => {
  try {
    const url = `${endpoint}/selected_restaurants`;
    const data = { restaurant_id: restaurantId, user_uid: userId };
    console.log('Creating selected restaurant with data:', data); // Log the data being sent
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating selected restaurant:', error);
    throw error;
  }
};

const deleteSelectedRestaurant = async (restaurantId, userId) => {
  try {
    const url = `${endpoint}/selected_restaurants/${restaurantId}`;
    const data = { restaurant_id: restaurantId, user_uid: userId };
    console.log('Deleting selected restaurant with data:', data); // Log the data being sent
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting selected restaurant:', error);
    throw error;
  }
};


const getUserSelectedRestaurants = async (userId) => {
  try {
    const data = { user_uid: userId };
    const response = await fetch(`${endpoint}/selected_restaurants/by_user?user_uid=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching selected restaurants:', error);
    throw error;
  }
};


const getUserRestaurants = async (userId) => {
  const response = await fetch(`${endpoint}/restaurants/by_user?user=${userId}`);
   
  if (!response.ok) {
    throw new Error('Failed to fetch user restaurants');
  }
   
  return response.json();
};

export {
  getAllRestaurants,
  getSingleRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createSelectedRestaurant,
  deleteSelectedRestaurant,
  getUserSelectedRestaurants,
  getUserRestaurants,
};
