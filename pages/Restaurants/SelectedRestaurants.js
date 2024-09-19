import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import RestaurantCard from '../../components/RestaurantCard';
import { getUserSelectedRestaurants, getSingleRestaurant } from '../../.husky/apiData/RestaurantData';

export default function SelectedRestaurants() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchSelectedRestaurants = async () => {
      if (user && user.uid) {
        const selectedRestaurantData = await getUserSelectedRestaurants(user.uid);

        if (isMounted && selectedRestaurantData && selectedRestaurantData.length > 0) {
          const restaurantDetails = await Promise.all(
            selectedRestaurantData.map((data) => {
              if (data.restaurant) {
                return getSingleRestaurant(data.restaurant);
              }
              return null;
            }).filter(Boolean),
          );
          if (isMounted) {
            setRestaurants(restaurantDetails);
          }
        } else if (isMounted) {
          setRestaurants([]);
        }
      }
    };

    fetchSelectedRestaurants();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Function to remove a restaurant from the list when it's toggled off
  const handleRemoveRestaurant = (restaurantId) => {
    setRestaurants((prevRestaurants) => prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId));
  };

  const handleSpinnerClick = () => {
    router.push('/Spinner');
  };

  return (
    <div>
      <h1>Selected Restaurants</h1>
      <Button onClick={handleSpinnerClick} className="mb-3">Go to Spinner</Button>
      <Row xs={1} md={2} lg={3} className="g-4">
        {restaurants.map((restaurant) => (
          <Col key={restaurant.id}>
            <RestaurantCard
              id={restaurant.id}
              name={restaurant.name}
              imageUrl={restaurant.image_url}
              streetAddress={restaurant.street_address}
              city={restaurant.city}
              state={restaurant.state}
              zipCode={restaurant.zip_code}
              onToggleOff={handleRemoveRestaurant}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
