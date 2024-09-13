import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Button } from 'react-bootstrap';
import UserForm from '../../../components/Forms/UserForm';
import { getSingleUser, updateUser } from '../../../.husky/apiData/UserData';
import { useAuth } from '../../../utils/context/authContext';

export default function EditUser() {
  const router = useRouter();
  const { uid } = router.query;
  const [userData, setUserData] = useState(null);
  const { refreshUserData } = useAuth();

  useEffect(() => {
    let isMounted = true;
    if (uid) {
      const userId = uid.split('/').pop();
      if (userId) {
        getSingleUser(userId)
          .then((data) => {
            if (isMounted) {
              setUserData(data);
            }
          })
          .catch((error) => {
            if (isMounted) {
              console.error(error);
            }
          });
      } else {
        console.error('Invalid user ID');
      }
    }
    return () => {
      isMounted = false;
    };
  }, [uid]);

  const handleUpdate = async (formData) => {
    try {
      const userId = Array.isArray(uid) ? uid[0] : uid;
      await updateUser(userId, formData);
      await refreshUserData(userId);
      router.push('/Profile');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4">Edit Profile</h1>
          <UserForm onSubmit={handleUpdate} initialData={userData} />
        </Card.Body>
        <Card.Footer className="text-center">
          <Button variant="secondary" onClick={() => router.push('/Profile')}>
            Cancel
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
