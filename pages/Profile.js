import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <div className="text-center mb-4">
            <Image
              src={user.profile_picture || 'https://via.placeholder.com/150'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
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
      </Card>
    </div>
  );
}
