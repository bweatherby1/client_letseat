import React, { useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import Loading from '../components/Loading';

export default function ProfilePage() {
  const { user, userLoading, refreshUserData } = useAuth();

  useEffect(() => {
    if (user && user.uid) {
      refreshUserData(user.uid);
    }
  }, [refreshUserData, user]);

  if (userLoading) return <Loading />;

  if (!user) {
    return (
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Authentication Required</Card.Title>
          <Card.Text>Please log in to view your profile.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <div className="text-center mb-4">
            <Image
              src={user.profile_picture || 'https://via.placeholder.com/150'}
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
      </Card>
    </div>
  );
}
