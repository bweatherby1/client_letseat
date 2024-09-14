import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Image } from 'react-bootstrap';
import { toggleRestaurantSelection } from '../.husky/apiData/RestaurantData';
import { useAuth } from '../utils/context/authContext';

const RestaurantCard = ({
  id, name, imageUrl, streetAddress, city, state, zipCode,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const { user } = useAuth();

  const toggleSelection = async () => {
    try {
      await toggleRestaurantSelection(id, user.uid);
      setIsSelected(!isSelected);
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
        <input type="checkbox" checked={isSelected} onChange={toggleSelection} />
        <span className="slider round" aria-label={`Select ${name}`} />
      </label>
      <Link href={`/Restaurants/${id}`} passHref>
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
