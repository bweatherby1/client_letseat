import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Image } from 'react-bootstrap';
import { getUserSelectedRestaurants, getSingleRestaurant } from '../.husky/apiData/RestaurantData';
import { getSingleUser } from '../.husky/apiData/UserData';
import { useAuth } from '../utils/context/authContext';

const RestaurantSpinner = ({ onSpin }) => {
  const [restaurants, setRestaurants] = useState([]);
  const wheelRef = useRef(null);
  const { user } = useAuth();
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + 2880 + randomDegree; // Spin 8 times + random degree
    setRotation(totalRotation);
    wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.42, 0, 0.58, 1)'; // Smooth transition
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    if (onSpin) onSpin(); // Call the onSpin callback if needed
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        if (user?.uid) {
          const userData = await getSingleUser(user.uid);

          if (userData && userData.uid) {
            const selectedRestaurants = await getUserSelectedRestaurants(userData.uid);

            if (selectedRestaurants && selectedRestaurants.length > 0) {
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

              setRestaurants(restaurantDetails.filter(Boolean));
            } else {
              setRestaurants([]);
            }
          } else {
            console.error('Failed to retrieve valid user data');
          }
        } else {
          console.error('User ID is undefined, cannot fetch restaurants');
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [user]);

  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-wheel" ref={wheelRef}>
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="spinner-slice"
              style={{
                transform: `rotate(${(360 / restaurants.length) * index}deg)`,
              }}
            >
              <div className="spinner-slice-content" style={{ transform: `rotate(${-(360 / restaurants.length) * index}deg)` }}>
                <Image src={restaurant.image_url} alt={restaurant.name} className="spinrestaurant-image" />
                <div className="restaurant-name">{restaurant.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div id="peg" />
        <Button id="button" onClick={handleSpin}>Spin</Button>
      </div>
    </div>
  );
};

RestaurantSpinner.propTypes = {
  onSpin: PropTypes.func,
};

RestaurantSpinner.defaultProps = {
  onSpin: () => {},
};

export default RestaurantSpinner;
