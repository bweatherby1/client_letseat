import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user, logout } = useAuth();
  const displayName = user?.name || 'User';

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: '90vh',
        padding: '30px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Card className="w-100 mb-4">
        <Card.Body className="text-center">
          <Image
            src={user.profile_picture || 'https://via.placeholder.com/150'}
            roundedCircle
            width={150}
            height={150}
            className="mb-3"
          />
          <Card.Title>Hello, {displayName}!</Card.Title>
          <Card.Text>{user.bio}</Card.Text>
          <Card.Text>
            <strong>Address:</strong><br />
            {user.street_address}<br />
            {user.city}, {user.state} {user.zip_code}
          </Card.Text>
        </Card.Body>
      </Card>
      <Button variant="danger" type="button" size="lg" className="copy-btn" onClick={logout}>
        Sign Out
      </Button>
    </div>
  );
}

export default Home;
