import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext'; // Adjust the path as needed
import { createSelectedRestaurant, deleteSelectedRestaurant, getUserSelectedRestaurants } from '../.husky/apiData/RestaurantData';

const RestaurantCard = ({
  id, name, imageUrl, streetAddress, city, state, zipCode,
}) => {
  const { toggleSelectedRestaurant, user } = useAuth();
  const userUid = user?.uid;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const fetchSelectedRestaurants = async () => {
      try {
        if (userUid) {
          const data = await getUserSelectedRestaurants(userUid);

          // Ensure each item in data has the correct property
          const selectedIds = data.map((item) => item.restaurant);

          setIsSelected(selectedIds.includes(id));
        }
      } catch (error) {
        console.error('Error fetching selected restaurants:', error);
      }
    };

    fetchSelectedRestaurants();
  }, [userUid, id]);

  const handleToggle = async (event) => {
    const newValue = event.target.checked;
    try {
      if (newValue) {
        await createSelectedRestaurant(id, userUid);
      } else {
        await deleteSelectedRestaurant(id, userUid);
      }
      setIsSelected(newValue);
      toggleSelectedRestaurant(id); // Update selected restaurants list
    } catch (error) {
      console.error('Error toggling restaurant selection:', error);
    }
  };

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
        <input type="checkbox" checked={isSelected} onChange={handleToggle} />
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
