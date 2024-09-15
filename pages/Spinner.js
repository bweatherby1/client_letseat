import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getAllUsers } from '../.husky/apiData/UserData';
import { getSingleRestaurant } from '../.husky/apiData/RestaurantData';
import RestaurantSpinner from '../components/RestaurantSpinner';

export default function Spinner() {
  const { user, selectedRestaurants } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter((u) => u.uid !== user.uid));

      const restaurantData = await Promise.all(
        selectedRestaurants.map((id) => getSingleRestaurant(id)),
      );
      setRestaurants(restaurantData);
    };

    fetchData();
  }, [user, selectedRestaurants]);

  const handleUserSelect = async (userId) => {
    const selected = users.find((u) => u.uid === userId);
    setSelectedUser(selected);

    const currentUserUid = user.uid;
    const currentUserSelectedRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${currentUserUid}`)) || [];
    const selectedUserRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${selected.uid}`)) || [];

    const combinedRestaurantIds = [...new Set([...currentUserSelectedRestaurants, ...selectedUserRestaurants])];

    // Fetch full restaurant objects
    const restaurantObjects = await Promise.all(
      combinedRestaurantIds.map((id) => getSingleRestaurant(id)),
    );

    localStorage.setItem(`selectedRestaurants_${currentUserUid}`, JSON.stringify(combinedRestaurantIds));
    setRestaurants(restaurantObjects);
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const totalRotation = 360 * 5 + Math.floor(Math.random() * 360);
    const duration = 5000;

    wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      setSpinning(false);
      wheelRef.current.style.transition = 'none';
      const actualRotation = totalRotation % 360;
      wheelRef.current.style.transform = `rotate(${actualRotation}deg)`;
      const winningIndex = Math.floor(restaurants.length - (actualRotation / (360 / restaurants.length)));
      alert(`You've won: ${restaurants[winningIndex].name}!`);
    }, duration);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Restaurant Spinner</h1>
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedUser ? `Add ${selectedUser.name}'s restaurants` : 'Add another user\'s restaurants'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {users.map((u) => (
            <Dropdown.Item key={u.uid} onClick={() => handleUserSelect(u.uid)}>
              {u.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <RestaurantSpinner restaurants={restaurants} onSpin={handleSpin} ref={wheelRef} />
    </div>
  );
}
