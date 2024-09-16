import React from 'react';
import Link from 'next/link';
import {
  Navbar,
  Container,
  Nav,
  Button,
} from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const { logout } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" className="transparent-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
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
            <Link passHref href="/Profile">
              <Nav.Link className="nav-link-custom">Profile</Nav.Link>
            </Link>
            <Button variant="outline-light" onClick={logout} className="sign-out-button">
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
