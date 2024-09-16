import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
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
  const [winningRestaurant, setWinningRestaurant] = useState(null);

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

    // Calculate total rotation with extra spins and random end angle
    const totalRotation = 360 * 5 + Math.floor(Math.random() * 360);
    const duration = 5000; // Spin for 5 seconds

    // Apply rotation to the wheel
    wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      setSpinning(false);
      wheelRef.current.style.transition = 'none';

      // Calculate the final resting position of the wheel
      const actualRotation = totalRotation % 360;
      const sliceAngle = 360 / restaurants.length;

      // Adjust for pointer position (12 o'clock is 0 degrees)
      const winningIndex = Math.floor((360 - actualRotation + (sliceAngle / 2)) / sliceAngle) % restaurants.length;
      setWinningRestaurant(restaurants[winningIndex]);

      // Show popup
      document.getElementById('result-popup').style.display = 'flex';
    }, duration);
  };

  const handlePopupClose = (confirm) => {
    document.getElementById('result-popup').style.display = 'none';

    if (confirm) {
      // Navigate to the winning restaurant's view page
      window.location.href = `/Restaurants/${winningRestaurant.id}`;
    } else {
      // Remove the winning restaurant and reset the spinner
      setRestaurants((prev) => prev.filter((r) => r.id !== winningRestaurant.id));
      setWinningRestaurant(null);
    }
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

      {/* Result Popup */}
      {winningRestaurant && (
        <div id="result-popup" className="popup">
          <div className="popup-content">
            <p>{`It looks like ${winningRestaurant.name} is the place to be, but is it the place for you?`}</p>
            <Button onClick={() => handlePopupClose(true)}>Yes</Button>
            <Button onClick={() => handlePopupClose(false)}>No</Button>
          </div>
        </div>
      )}
    </div>
  );
}
