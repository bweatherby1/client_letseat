import React from 'react';
import { Container, Alert } from 'react-bootstrap';

function UnderConstruction() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <Alert variant="warning" className="text-center">
        <Alert.Heading>UNDER CONSTRUCTION!</Alert.Heading>
        <p>This feature is currently being developed. Please check back later.</p>
      </Alert>
    </Container>
  );
}

export default UnderConstruction;
