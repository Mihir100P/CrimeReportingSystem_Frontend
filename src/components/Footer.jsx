import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row className="align-items-center text-center text-md-start">
          {/* Left Section */}
          <Col md={6} className="mb-3 mb-md-0">
            <p className="text-muted">Making communities safer</p>
          </Col>

          {/* Right Section - Links */}
          <Col md={6} className="d-flex justify-content-center justify-content-md-end">
            <Link to="/about" className="text-light me-3 text-decoration-none fw-semibold">
              About
            </Link>
            <Link to="/privacy" className="text-light me-3 text-decoration-none fw-semibold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-light me-3 text-decoration-none fw-semibold">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-light text-decoration-none fw-semibold">
              Contact
            </Link>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="mt-3">
          <Col className="text-center text-muted">
            <p>&copy; {new Date().getFullYear()} Crime Reporting System. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
