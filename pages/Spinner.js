import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef(null);

  const handleSpinResult = (restaurant) => {
    setWinningRestaurant(restaurant);
    setShowModal(true);
  };

  const handleModalClose = (confirm) => {
    setShowModal(false);

    if (confirm && winningRestaurant) {
      router.push(`/restaurants/${winningRestaurant.id}`);
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

  const handleUserSelect = (userId) => {
    const selected = users.find(({ uid }) => uid === userId);
    setSelectedUser(selected);
    if (dropdownRef.current) {
      dropdownRef.current.click(); // This should close the dropdown
    }
  };

  const addSelectedUserRestaurants = async () => {
    if (selectedUser) {
      const currentUserUid = user.uid;
      const currentUserSelectedRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${currentUserUid}`)) || [];
      const selectedUserRestaurants = JSON.parse(localStorage.getItem(`selectedRestaurants_${selectedUser.uid}`)) || [];

      const combinedRestaurantIds = [...new Set([...currentUserSelectedRestaurants, ...selectedUserRestaurants])];

      const restaurantObjects = await Promise.all(
        combinedRestaurantIds.map((id) => getSingleRestaurant(id)),
      );

      localStorage.setItem(`selectedRestaurants_${currentUserUid}`, JSON.stringify(combinedRestaurantIds));
      setRestaurants(restaurantObjects);
    }
  };
  return (
    <div className="spinner-page-container">
      <h1 className="mb-4">Restaurant Spinner</h1>
      <div className="spinner-content">
        <div className="buttons-container">
          <Button
            variant="primary"
            onClick={addSelectedUserRestaurants}
            disabled={!selectedUser}
            className="mb-3 d-block"
          >
            Add {selectedUser ? `${selectedUser.name}'s` : ''} restaurants
          </Button>
          <Dropdown className="mb-3 w-100">
            <Dropdown.Toggle ref={dropdownRef} variant="success" id="dropdown-basic">
              {selectedUser ? `${selectedUser.name}` : 'Select a user'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {users.map(({ uid, name }) => (
                <Dropdown.Item key={uid} onClick={() => handleUserSelect(uid)}>
                  {name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="spinner-wrapper">
          <RestaurantSpinner restaurants={restaurants} setRestaurants={setRestaurants} onSpin={handleSpinResult} />
        </div>
      </div>
      <Modal show={showModal} onHide={() => handleModalClose(false)} centered>
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
