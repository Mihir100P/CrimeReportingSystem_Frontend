import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Table, Spinner, Alert, Button, Row, Col } from "react-bootstrap";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        };

        const [reportsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/reports", config),
          axios.get("http://localhost:5000/api/users", config),
        ]);

        setReports(reportsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch dashboard data. " + error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h1 className="mb-3 text-primary text-center">Admin Dashboard</h1>
        <p className="text-muted text-center">Welcome, {user?.name}</p>

        {/* Dashboard Cards */}
        <Row className="mb-4">
          <DashboardCard title="Total Reports" count={reports.length} link="/admin/reports" variant="danger" />
          <DashboardCard title="Total Users" count={users.length} link="/admin/users" variant="success" />
          <DashboardCard title="Manage Alerts" count="View & Send" link="/admin/alerts" variant="warning" />
        </Row>

        {/* Recent Reports Table */}
        <h2 className="text-secondary text-center mb-3">Recent Reports</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="text-center">
              <thead className="bg-dark text-white">
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report) => (
                  <tr key={report._id}>
                    <td>{report.title}</td>
                    <td>{report.status}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="info" size="sm" as={Link} to={`/admin/reports/${report._id}`}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </Container>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, count, link, variant }) => (
  <Col md={4} className="mb-3">
    <Card className={`text-white bg-${variant} shadow-lg`}>
      <Card.Body className="text-center">
        <Card.Title>{title}</Card.Title>
        <h2 className="fw-bold">{count}</h2>
        <Button as={Link} to={link} variant="light">
          Manage
        </Button>
      </Card.Body>
    </Card>
  </Col>
);

export default AdminDashboard;
