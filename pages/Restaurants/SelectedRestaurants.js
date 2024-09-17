import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import RestaurantCard from '../../components/RestaurantCard';
import { getUserSelectedRestaurants, getSingleRestaurant } from '../../.husky/apiData/RestaurantData';

export default function SelectedRestaurants() {
  const { user } = useAuth(); // Get user from context
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSelectedRestaurants = async () => {
      if (user && user.uid) {
        try {
          const selectedRestaurantData = await getUserSelectedRestaurants(user.uid);

          if (selectedRestaurantData && selectedRestaurantData.length > 0) {
            // Fetch restaurant details for each selected restaurant
            const restaurantDetails = await Promise.all(
              selectedRestaurantData.map((data) => {
                // Use 'data.restaurant' for the restaurant ID
                if (data.restaurant) {
                  return getSingleRestaurant(data.restaurant);
                }
                console.error('Invalid restaurant ID:', data.restaurant);
                return null;
              }).filter(Boolean), // Remove any null values
            );
            setRestaurants(restaurantDetails);
          } else {
            setRestaurants([]);
          }
        } catch (error) {
          console.error('Error fetching selected restaurants:', error);
        }
      } else {
        console.error('User not authenticated or user.uid is missing');
      }
    };

    fetchSelectedRestaurants();
  }, [user]);

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
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
