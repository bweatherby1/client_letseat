import React, { useState, useEffect } from 'react';
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
  const [winningRestaurant, setWinningRestaurant] = useState(null);
  const [spinning, setSpinning] = useState(false);

  // Dummy restaurant data for testing
  const dummyRestaurants = [
    { id: 1, name: 'Restaurant A', image_url: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Restaurant B', image_url: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Restaurant C', image_url: 'https://via.placeholder.com/80' },
  ];

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const duration = Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
    const totalRotation = 360 * 5 + Math.floor(Math.random() * 360);

    if (document.querySelector('.wheel')) {
      const wheel = document.querySelector('.wheel');
      wheel.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      wheel.style.transform = `rotate(${totalRotation}deg)`;

      setTimeout(() => {
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${totalRotation % 360}deg)`;

        const sliceAngle = 360 / dummyRestaurants.length;
        const finalRotation = totalRotation % 360;
        const winningIndex = Math.floor((finalRotation + (sliceAngle / 2)) / sliceAngle) % dummyRestaurants.length;

        setWinningRestaurant(dummyRestaurants[winningIndex]);
        setSpinning(false);
      }, duration);
    }
  };

  const handlePopupClose = (confirm) => {
    document.getElementById('result-popup').style.display = 'none';

    if (confirm && winningRestaurant) {
      window.location.href = `/restaurants/${winningRestaurant.id}`;
    } else {
      setRestaurants((prev) => prev.filter(({ id }) => id !== winningRestaurant.id));
      setWinningRestaurant(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter(({ uid }) => uid !== user.uid));

      const restaurantData = await Promise.all(
        selectedRestaurants.map((id) => getSingleRestaurant(id)),
      );
      setRestaurants(restaurantData);
    };

    fetchData();
  }, [user, selectedRestaurants]);

  const handleUserSelect = async (userId) => {
    const selected = users.find(({ uid }) => uid === userId);
    setSelectedUser(selected);

    const currentUserUid = user.uid;
    const currentUserSelectedRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${currentUserUid}`)) || [];
    const selectedUserRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${selected.uid}`)) || [];

    const combinedRestaurantIds = [...new Set([...currentUserSelectedRestaurants, ...selectedUserRestaurants])];

    const restaurantObjects = await Promise.all(
      combinedRestaurantIds.map((id) => getSingleRestaurant(id)),
    );

    localStorage.setItem(`selectedRestaurants_${currentUserUid}`, JSON.stringify(combinedRestaurantIds));
    setRestaurants(restaurantObjects);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Restaurant Spinner</h1>
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedUser ? `Add ${selectedUser.name}'s restaurants` : 'Add another user\'s restaurants'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {users.map(({ uid, name }) => (
            <Dropdown.Item key={uid} onClick={() => handleUserSelect(uid)}>
              {name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <RestaurantSpinner restaurants={restaurants} onSpin={handleSpin} />

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
