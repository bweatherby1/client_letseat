// pages/Restaurants/edit/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../utils/context/authContext';
import RestaurantForm from '../../../components/Forms/RestaurantForm';
import { getSingleRestaurant, updateRestaurant } from '../../../.husky/apiData/RestaurantData';

export default function EditRestaurant() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getSingleRestaurant(id).then(setRestaurant);
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const updatedData = {
        ...formData,
        user: user.uid,
      };
      await updateRestaurant(id, updatedData);
      router.push(`/Restaurants/${id}`);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h1>Edit Restaurant</h1>
      <RestaurantForm onSubmit={handleSubmit} initialData={{ ...restaurant, category: restaurant.category }} />
    </div>
  );
}
