import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const Home = () => {
  return (
    <div className="container">
      <section className="bg-dark text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Report Crime. Stay Safe.</h1>
          <p className="lead">
            Be someone's JATAYU , and there will be JATAYU for you.  
          </p>
          <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <Button as={Link} to="/report" variant="warning" size="lg" className="me-md-3 mb-3 mb-md-0">
              Report an Incident
            </Button>
            <Button as={Link} to="/map" variant="light" size="lg" className="text-primary me-md-3 mb-3 mb-md-0">
              Locate Services
            </Button>
            <Button as={Link} to="/emergency" variant="info" size="lg" className="me-md-3 mb-3 mb-md-0">
              Emergency Contacts
            </Button>
            <Button as={Link} to="/guide" variant="success" size="lg" className="me-md-3 mb-3 mb-md-0">
              Safety Guide
            </Button>
            <Button as={Link} to="/alert" variant="danger" size="lg" className="me-md-3 mb-3 mb-md-0">
              Alerts
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center">
            <h2 className="fw-bold">Features</h2>
            <p className="text-muted">
              Our platform provides comprehensive tools to ensure your safety and quick response.
            </p>
          </div>

          <Row className="mt-4">
            {[ 
              { title: "Real-time Reporting", text: "Report incidents in real-time with photo and video evidence." },
              { title: "Location Tracking", text: "Find nearest police stations and get directions." },
              { title: "Safety Alerts", text: "Receive real-time alerts about incidents in your area." },
              { title: "Live Streaming", text: "Stream video to emergency services during critical situations." },
              { title: "Safety Guide", text: "Access comprehensive safety tips and guides." },
              { title: "Emergency Directory", text: "Quick access to emergency services contact information." },
            ].map((feature, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="h-100 shadow">
                  <Card.Body>
                    <h5 className="fw-bold">{feature.title}</h5>
                    <p className="text-muted">{feature.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      
      <section className="bg-dark text-white py-5">
        <Container className="text-center">
          <div className="mt-3">
            Jatayu is a platform that allows you to report incidents in real-time and receive immediate help.
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
