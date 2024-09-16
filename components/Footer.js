import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="custom-footer">
      <Container fluid>
        <Row className="justify-content-between">
          <Col xs={3} className="text-center">
            <Link href="/UnderConstruction" className="footer-link">FAQ</Link>
          </Col>
          <Col xs={3} className="text-center">
            <Link href="/UnderConstruction" className="footer-link">About Us</Link>
          </Col>
          <Col xs={3} className="text-center">
            <Link href="/UnderConstruction" className="footer-link">Contact</Link>
          </Col>
          <Col xs={3} className="text-center">
            <Link href="/UnderConstruction" className="footer-link">Coming Soon</Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
