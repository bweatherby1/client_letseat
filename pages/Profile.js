import React, { useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { deleteUser } from '../.husky/apiData/UserData';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.warn('User data in ProfilePage:', user);
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

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
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <div className="text-center mb-4">
            <Image
              src={user.profile_picture || 'https://placekitten.com/150/150'}
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
          <h2 className="text-center mb-4">{user.name}</h2>
          <p><strong>Username:</strong> {user.user_name}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Address:</strong> {user.street_address}, {user.city}, {user.state} {user.zip_code}</p>
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
