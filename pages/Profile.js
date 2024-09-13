import React, { useState, useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { deleteUser, getSingleUser } from '../.husky/apiData/UserData';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user && user.uid) {
      getSingleUser(user.uid)
        .then((data) => {
          setProfileData(data);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleUpdate = () => {
    router.push(`/Users/edit/${user.uid}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteUser(user.uid);
        logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting user:', error.message);
      }
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <div className="text-center mb-4">
            <Image
              src={profileData.profile_picture || 'https://placekitten.com/150/150'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placekitten.com/150/150';
              }}
              roundedCircle
              width={150}
              height={150}
              alt="Profile Picture"
            />
          </div>
          <h2 className="text-center mb-4">{profileData.name}</h2>
          <p><strong>Username:</strong> {profileData.user_name}</p>
          <p><strong>Bio:</strong> {profileData.bio}</p>
          <p><strong>Address:</strong> {profileData.street_address}, {profileData.city}, {profileData.state} {profileData.zip_code}</p>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button variant="primary" onClick={handleUpdate} className="me-2">
            Update Profile
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Account
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
