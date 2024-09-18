import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getUserSelectedRestaurants, toggleSelectedRestaurant } from '../.husky/apiData/RestaurantData';

const RestaurantCard = ({
  id, name, imageUrl, streetAddress, city, state, zipCode,
}) => {
  const { user } = useAuth();
  const userUid = user?.uid;
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch selected restaurants and set the initial state
  useEffect(() => {
    const fetchSelectedRestaurants = async () => {
      if (userUid) {
        try {
          const data = await getUserSelectedRestaurants(userUid);
          const selectedIds = data.map((item) => item.restaurant);
          setIsSelected(selectedIds.includes(id));
        } catch (error) {
          console.error('Error fetching selected restaurants:', error);
        }
      }
    };

    fetchSelectedRestaurants();
  }, [userUid, id]);

  const handleToggle = useCallback(async (event) => {
    if (loading) {
      return; // Prevent multiple requests
    }

    const newValue = event.target.checked;

    setLoading(true); // Set loading to true to prevent multiple requests

    try {
      await toggleSelectedRestaurant(id, userUid); // Pass id and userUid here
      setIsSelected(newValue); // Update the local state
    } catch (error) {
      console.error('Error toggling restaurant selection:', error);
    } finally {
      setLoading(false); // Reset loading state after request
    }
  }, [id, userUid, loading]); // Include userUid in dependencies

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${streetAddress}, ${city}, ${state} ${zipCode}`)}`;

  return (
    <div className={`restaurant-card ${isSelected ? 'selected' : ''}`}>
      <Image src={imageUrl} alt={name} className="restaurant-image" />
      <div className="restaurant-info">
        <h3>{name}</h3>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          <p>{streetAddress}</p>
          <p>{`${city}, ${state} ${zipCode}`}</p>
        </a>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
          disabled={loading}
        />
        <span className="slider round" aria-label={`Select ${name}`} />
      </label>
      <Link href={`/restaurants/${id}`} passHref>
        <Button variant="primary">View Details</Button>
      </Link>
    </div>
  );
};

RestaurantCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  streetAddress: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
};

export default RestaurantCard;
