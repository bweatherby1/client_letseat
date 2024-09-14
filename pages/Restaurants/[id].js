import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Image, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getSingleRestaurant, toggleRestaurantSelection, deleteRestaurant } from '../../.husky/apiData/RestaurantData';
import { getSingleCategory } from '../../.husky/apiData/CategoryData';

export default function RestaurantDetails() {
  const [restaurant, setRestaurant] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      getSingleRestaurant(id)
        .then(async (restaurantData) => {
          const categoryData = await getSingleCategory(restaurantData.category);
          setRestaurant({ ...restaurantData, category: categoryData });
        })
        .catch(console.error);
    }
  }, [id]);

  const handleToggle = async () => {
    if (restaurant) {
      const updatedSelection = await toggleRestaurantSelection(id, user.uid);
      setIsSelected(!!updatedSelection.is_selected);
    }
  };

  const handleUpdate = () => {
    router.push(`/Restaurants/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteRestaurant(id);
      router.push('/Restaurants');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  if (!restaurant) return <div>Loading...</div>;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.street_address}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip_code}`)}`;

  return (
    <div className="restaurant-details">
      <Image src={restaurant.image_url} alt={restaurant.name} fluid />
      <h1>{restaurant.name}</h1>
      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
        <p>{restaurant.street_address}</p>
        <p>{`${restaurant.city}, ${restaurant.state} ${restaurant.zip_code}`}</p>
      </a>
      <p>Category: {restaurant.category?.name || 'Uncategorized'}</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
        />
        <span className="slider round" aria-label={`Select ${restaurant.name}`} />
      </label>
      <Button variant="primary" onClick={handleUpdate}>Update</Button>
      <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>
      <Button variant="secondary" onClick={() => router.back()}>Back</Button>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this restaurant?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
