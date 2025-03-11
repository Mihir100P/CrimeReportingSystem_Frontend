import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="shadow-lg sticky-top px-3"
      style={{ height: "5rem", backgroundColor: "#212529" }} 
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <Nav.Link as={Link} to="/" className="fw-semibold text-light px-3">
            <img
              width="50"
              height="50"
              className="d-inline-block align-top me-2 rounded-circle border border-light p-1"
              src="/src/assets/logo.png"
              alt="Logo"
            />
            <span className="fs-4 text-light fw-bold">JATAYU</span>
          </Nav.Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: "#212529" }}>
          <Nav className="ms-auto text-uppercase">
            <Nav.Link as={Link} to="/" className="fw-semibold text-light px-3">
              Home
            </Nav.Link>

            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="fw-semibold text-light px-3">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/report" className="fw-semibold text-light px-3">
                  Report Crime
                </Nav.Link>
                <Nav.Link as={Link} to="/map" className="fw-semibold text-light px-3">
                  Map
                </Nav.Link>
                <Nav.Link as={Link} to="/guide" className="fw-semibold text-light px-3">
                  Safety Guide
                </Nav.Link>
                <Nav.Link as={Link} to="/emergency" className="fw-semibold text-light px-3">
                  Emergency
                </Nav.Link>
                <Nav.Link as={Link} to="/alert" className="fw-semibold text-light px-3">
                  Alert
                </Nav.Link>

                {user.role === "admin" && (
                  <Nav.Link as={Link} to="/admin" className="fw-semibold text-warning px-3">
                    Admin
                  </Nav.Link>
                )}
                {(user.role === "police" || user.role === "admin") && (
                  <Nav.Link as={Link} to="/police" className="fw-semibold text-info px-3">
                    Police
                  </Nav.Link>
                )}

                <NavDropdown title={<span className="text-light">{`Hello, ${user.name}`}</span>} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={logout} className="text-danger fw-semibold">
                    Logout
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile" className="text-dark fw-semibold">
                    Profile
                  </NavDropdown.Item>

                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold text-light px-3">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="fw-semibold text-light px-3">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
