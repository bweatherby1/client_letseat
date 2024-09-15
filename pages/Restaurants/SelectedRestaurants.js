import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import RestaurantCard from '../../components/RestaurantCard';
import { getSingleRestaurant } from '../../.husky/apiData/RestaurantData';

export default function SelectedRestaurants() {
  const { selectedRestaurants } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSelectedRestaurants = async () => {
      const selectedRestaurantData = await Promise.all(
        selectedRestaurants.map((id) => getSingleRestaurant(id)),
      );
      setRestaurants(selectedRestaurantData);
    };

    if (selectedRestaurants.length > 0) {
      fetchSelectedRestaurants();
    }
  }, [selectedRestaurants]);

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
