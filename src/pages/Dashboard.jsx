import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Table, Spinner, Alert, Button, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const { data } = await axios.get("http://localhost:5000/api/reports/user", config);
        setReports(data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch reports. " + error.message);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container">
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col>
              <h1 className="text-primary">Dashboard</h1>
              <p className="text-muted">
                Welcome back, <strong>{user?.name}</strong>
              </p>
            </Col>
            <Col className="text-end">
              {/* "Report Now" button added for quick crime reporting */}
              <Button as={Link} to="/report" variant="danger" className="shadow me-2">
               🚨 Report Now
            </Button>
              <Button as={Link} to="/profile" variant="primary" className="shadow">
              Profile
              </Button>

            </Col>
          </Row>

          <div className="mt-4">
            <h2 className="text-secondary text-center">Recent Reports</h2>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : reports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">You haven't submitted any reports yet.</p>
                <Button as={Link} to="/report" variant="primary" className="mt-3">
                  Submit Your First Report
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover responsive className="text-center">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Title</th>
                      <th>Incident Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.title}</td>
                        <td>{report.incidentType}</td>
                        <td>
                          <span
                            className={`badge ${
                              report.status === "Resolved" ? "bg-success" : "bg-warning"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button as={Link} to={`/reports/${report._id}`} variant="outline-primary" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      <br /><br />
      <br /><br />
    </Container>
    </div>
  );
};

export default Dashboard;
