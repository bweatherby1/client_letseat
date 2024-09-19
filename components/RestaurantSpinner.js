import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { getUserSelectedRestaurants, getSingleRestaurant } from '../.husky/apiData/RestaurantData';
import { getSingleUser } from '../.husky/apiData/UserData';
import { useAuth } from '../utils/context/authContext';

const RestaurantSpinner = ({ onSpin, restaurants, setRestaurants }) => {
  const wheelRef = useRef(null);
  const { user } = useAuth();
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + 2880 + randomDegree;
    setRotation(totalRotation);
    wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      const sliceAngle = 360 / restaurants.length;
      const winningIndex = Math.floor(((360 - (totalRotation % 360)) % 360) / sliceAngle);
      const winningRestaurant = restaurants[winningIndex];
      if (onSpin) onSpin(winningRestaurant);
    }, 4000);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        if (user?.uid) {
          const userData = await getSingleUser(user.uid);
          if (userData && userData.uid) {
            const selectedRestaurants = await getUserSelectedRestaurants(userData.uid);
            if (isMounted && selectedRestaurants && selectedRestaurants.length > 0) {
              const restaurantDetails = await Promise.all(
                selectedRestaurants.map(async (data) => {
                  try {
                    const restaurantId = data.restaurant;
                    return await getSingleRestaurant(restaurantId);
                  } catch (error) {
                    console.error(`Error fetching details for restaurant ID ${data.restaurant}:`, error);
                    return null;
                  }
                }),
              );
              if (isMounted) {
                setRestaurants(restaurantDetails.filter(Boolean));
              }
            } else if (isMounted) {
              setRestaurants([]);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching restaurants:', error);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [user, setRestaurants]);

  return (
    <div className="spinner-container">
      <div className="spinner">
        <ul className="spinner-list" ref={wheelRef} style={{ '--total-slices': restaurants.length }}>
          {restaurants.map((restaurant, index) => (
            <li
              key={restaurant.id}
              className="spinner-slice"
              style={{
                '--rotate': `${(360 / restaurants.length) * index}deg`,
                '--slice-color': `hsl(${(360 / restaurants.length) * index}, 70%, 60%)`,
              }}
            >
              <p className="spinner-slice-text">{restaurant.name}</p>
            </li>
          ))}
        </ul>
        <div className="spinner-pointer" />
        <Button className="spin-button" onClick={handleSpin}>Spin</Button>
      </div>
    </div>
  );
};

RestaurantSpinner.propTypes = {
  onSpin: PropTypes.func,
  restaurants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  setRestaurants: PropTypes.func.isRequired,
};

RestaurantSpinner.defaultProps = {
  onSpin: () => {},
};

export default RestaurantSpinner;
