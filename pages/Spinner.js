import React, { useState, useEffect } from 'react';
import { Dropdown, Button, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { getAllUsers } from '../.husky/apiData/UserData';
import { getSingleRestaurant } from '../.husky/apiData/RestaurantData';
import RestaurantSpinner from '../components/RestaurantSpinner';

export default function Spinner() {
  const { user } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [winningRestaurant, setWinningRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSpinResult = (restaurant) => {
    setWinningRestaurant(restaurant);
    setShowModal(true);
  };

  const handleModalClose = (confirm) => {
    setShowModal(false);

    if (confirm && winningRestaurant) {
      router.push(`/Restaurants/${winningRestaurant.id}`);
    } else if (winningRestaurant) {
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
      <div className="d-flex flex-column align-items-center">
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
        <RestaurantSpinner restaurants={restaurants} setRestaurants={setRestaurants} onSpin={handleSpinResult} />
      </div>

      <Modal show={showModal} onHide={() => handleModalClose(false)} centered style={{ top: '-25%' }}>
        <Modal.Header closeButton>
          <Modal.Title>Spin Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {winningRestaurant && (
            <p>{`It looks like ${winningRestaurant.name} is the place to be, but is it the place for you?`}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleModalClose(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleModalClose(true)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
