import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button, Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { getAllUsers } from '../.husky/apiData/UserData';
import { getSingleRestaurant, getUserSelectedRestaurants } from '../.husky/apiData/RestaurantData';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchData = async () => {
      try {
        const allUsers = await getAllUsers();
        if (isMounted.current) {
          setUsers(allUsers.filter(({ uid }) => uid !== user.uid));

          const selectedRestaurantData = JSON.parse(localStorage.getItem(`selectedRestaurants_${user.uid}`)) || [];

          const restaurantObjects = await Promise.all(
            selectedRestaurantData.map((restaurant) => getSingleRestaurant(restaurant)),
          );
          if (isMounted.current) {
            setRestaurants(restaurantObjects.filter(Boolean));
          }
        }
      } catch (error) {
        // Error handling can be added if necessary
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  const handleUserSelect = (userId) => {
    const selected = users.find(({ uid }) => uid === userId);
    setSelectedUser(selected);
    if (dropdownRef.current) {
      dropdownRef.current.click();
    }
  };

  const addSelectedUserRestaurants = async () => {
    if (selectedUser) {
      try {
        const currentUserUid = user.uid;
        const selectedUserUid = selectedUser.uid;

        const currentUserSelectedRestaurants = await getUserSelectedRestaurants(currentUserUid);
        const selectedUserRestaurants = await getUserSelectedRestaurants(selectedUserUid);

        const combinedRestaurantIdentifiers = [...new Set([
          ...currentUserSelectedRestaurants.map((restaurant) => restaurant.restaurant),
          ...selectedUserRestaurants.map((restaurant) => restaurant.restaurant),
        ])];

        const restaurantObjects = await Promise.all(
          combinedRestaurantIdentifiers.map((restaurantId) => getSingleRestaurant(restaurantId)),
        );

        if (isMounted.current) {
          setRestaurants(restaurantObjects.filter(Boolean));
        }
      } catch (error) {
        // Error handling can be added if necessary
      }
    }
  };

  const handleSpinResult = (restaurant) => {
    setWinningRestaurant(restaurant);
    setShowModal(true);
  };

  const handleModalClose = (confirm) => {
    setShowModal(false);

    if (confirm && winningRestaurant) {
      router.push(`/Restaurants/${winningRestaurant.id}`);
    } else if (winningRestaurant) {
      setRestaurants((prev) => {
        const filteredRestaurants = prev.filter((rest) => rest.id !== winningRestaurant.id);
        return filteredRestaurants;
      });
      setWinningRestaurant(null);
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
      {/* Ensure the modal is only shown when winningRestaurant is not null */}
      {winningRestaurant && (
        <Modal show={showModal} onHide={() => handleModalClose(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Spin Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{`It looks like ${winningRestaurant.name} is the place to be, but is it the place for you?`}</p>
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
      )}
    </div>
  );
}
