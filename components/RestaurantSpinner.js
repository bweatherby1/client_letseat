import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';

const RestaurantSpinner = ({ restaurants, onSpin }) => {
  const wheelRef = useRef(null);

  return (
    <div className="spinner-container">
      <div className="spinner-wrapper">
        <div className="wheel" ref={wheelRef}>
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="slice"
              style={{ '--rotation': `${(360 / restaurants.length) * index}deg` }}
            >
              <div className="content">
                <Image src={restaurant.image_url} alt={restaurant.name} className="restaurant-image" />
                <div>{restaurant.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer" />
        <Button className="spin-button" onClick={onSpin}>
          Spin
        </Button>
      </div>
    </div>
  );
};

RestaurantSpinner.propTypes = {
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSpin: PropTypes.func.isRequired,
};

export default RestaurantSpinner;
