import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getAllUsers } from '../.husky/apiData/UserData';
import { getSingleRestaurant } from '../.husky/apiData/RestaurantData';
import RestaurantSpinner from '../components/RestaurantSpinner';

export default function Spinner() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [winningRestaurant, setWinningRestaurant] = useState(null);

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

      const selectedRestaurantData = JSON.parse(localStorage.getItem(`selectedRestaurants_${user.uid}`)) || [];
      const restaurantObjects = await Promise.all(
        selectedRestaurantData.map((id) => getSingleRestaurant(id)),
      );
      setRestaurants(restaurantObjects);
    };

    fetchData();
  }, [user]);

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
      <RestaurantSpinner restaurants={restaurants} onSpin={() => console.log('Spinning!')} />

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
