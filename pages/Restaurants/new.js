import React from 'react';
import { useRouter } from 'next/router';
import RestaurantForm from '../../components/Forms/RestaurantForm';
import { createRestaurant } from '../../.husky/apiData/RestaurantData';
import { useAuth } from '../../utils/context/authContext';

export default function NewRestaurant() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const newRestaurant = await createRestaurant({ ...formData, user: user.uid });
      router.push(`/Restaurants/${newRestaurant.id}`);
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add New Restaurant</h1>
      <RestaurantForm onSubmit={handleSubmit} />
    </div>
  );
}
