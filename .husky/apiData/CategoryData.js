// .husky/apiData/CategoryData.js
import { clientCredentials } from '../../utils/client';

const endpoint = clientCredentials.databaseURL.replace(/"/g, '');

const getAllCategories = () => {
  return fetch(`${endpoint}/categories`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching categories:', error);
      throw error;
    });
};

const getSingleCategory = (id) => {
  return fetch(`${endpoint}/categories/${id}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching category:', error);
      throw error;
    });
};

export { getAllCategories, getSingleCategory };
