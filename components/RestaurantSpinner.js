import React, { forwardRef, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

const RestaurantSpinner = forwardRef(({ restaurants, onSpin }, ref) => {
  useEffect(() => {
    const items = ref.current.querySelectorAll('.slice');
    items.forEach((item, index) => {
      const rotation = (index / items.length) * 360;
      item.style.setProperty('--rotation', `${rotation}deg`);
    });
  }, [restaurants, ref]);

  return (
    <div className="spinner-container">
      <div className="pizza-spinner">
        <div className="wheel" ref={ref}>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="slice">
              <div className="content">
                <Image src={restaurant.image_url} alt={restaurant.name} />
                <span>{restaurant.name}</span>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={onSpin} className="spin-button">SPIN</Button>
      </div>
    </div>
  );
});

RestaurantSpinner.propTypes = {
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSpin: PropTypes.func.isRequired,
};

RestaurantSpinner.displayName = 'RestaurantSpinner';

export default RestaurantSpinner;
