import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import RestaurantCard from '../../components/RestaurantCard';
import { getUserRestaurants } from '../../.husky/apiData/RestaurantData';

export default function MyPlaces() {
  const [myRestaurants, setMyRestaurants] = useState([]);
  const { user } = useAuth();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true; // Set to true when component is mounted

    if (user && user.uid) {
      getUserRestaurants(user.uid).then((restaurants) => {
        if (isMounted.current) {
          setMyRestaurants(restaurants); // Only update state if component is still mounted
        }
      });
    }

    return () => {
      isMounted.current = false; // Cleanup function to mark component as unmounted
    };
  }, [user]);

  return (
    <Container className="text-center my-4">
      <h1>My Restaurants</h1>
      {myRestaurants.length === 0 ? (
        <p>You have not created any restaurants yet.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {myRestaurants.map((restaurant) => (
            <Col key={restaurant.id}>
              <RestaurantCard
                id={restaurant.id}
                name={restaurant.name}
                imageUrl={restaurant.image_url}
                streetAddress={restaurant.street_address}
                city={restaurant.city}
                state={restaurant.state}
                zipCode={restaurant.zip_code}
                onUpdate={() => {
                  if (isMounted.current) {
                    getUserRestaurants(user.uid).then(setMyRestaurants);
                  }
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
