import React from 'react';
import Link from 'next/link';
import {
  Navbar,
  Container,
  Nav,
  Button, Image,
} from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" className="transparent-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link passHref href="/Profile">
              <Nav.Link className="nav-link-custom p-0">
                <Image
                  src={user.profile_picture || 'https://placekitten.com/120/120'}
                  width={120}
                  height={120}
                  alt="Profile"
                  className="profile-picture"
                />
              </Nav.Link>
            </Link>
          </Nav>
          <Nav className="center-links">
            <Link passHref href="/Restaurants/MyPlaces">
              <Nav.Link className="nav-link-custom">My Places</Nav.Link>
            </Link>
            <Link passHref href="/Restaurants/SelectedRestaurants">
              <Nav.Link className="nav-link-custom">Selected Restaurants</Nav.Link>
            </Link>
            <Link passHref href="/Restaurants/All">
              <Nav.Link className="nav-link-custom">All Restaurants</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={logout} className="sign-out-button">
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
