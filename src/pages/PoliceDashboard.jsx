import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AlertContext } from "../context/AlertContext";

const PoliceDashboard = () => {
  const { user } = useContext(AuthContext);
  const { alerts, loading: alertsLoading } = useContext(AlertContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        };

        const { data } = await axios.get("http://localhost:5000/api/reports/police", config);
        setReports(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch reports. " + error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-primary">Police Dashboard</h1>
          <p className="card-text text-muted">Welcome, Officer {user?.name}</p>

          {/* Dashboard Cards */}
          <div className="row mt-4">
            <DashboardCard title="New Reports" count={reports.length} link="/police/reports" icon="bi-file-text" />
            <DashboardCard title="Emergency Alerts" count={alerts.length} link="/police/alerts" icon="bi-exclamation-triangle" />
            <DashboardCard title="Manage Cases" count="Track & Assign" link="/police/manage-cases" icon="bi-folder-check" />
          </div>

          {/* Emergency Alerts */}
          <h2 className="mt-4 text-danger"><i className="bi bi-bell-fill"></i> Emergency Alerts</h2>
          {alertsLoading ? (
            <p className="text-muted">Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <p className="text-muted">No emergency alerts at the moment.</p>
          ) : (
            <ul className="list-group mt-2">
              {alerts.map((alert) => (
                <li key={alert._id} className="list-group-item list-group-item-danger">
                  <strong>{alert.title}</strong>: {alert.message}
                </li>
              ))}
            </ul>
          )}

          {/* Recent Crime Reports */}
          <h2 className="mt-4"><i className="bi bi-journal-text"></i> Recent Crime Reports</h2>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-2">
                <thead className="table-dark">
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
                        <Link to={`/police/reports/${report._id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-eye"></i> View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Bootstrap Dashboard Card Component
const DashboardCard = ({ title, count, link, icon }) => (
  <div className="col-md-4">
    <div className="card text-white bg-success mb-3 shadow">
      <div className="card-body text-center">
        <h5 className="card-title"><i className={`bi ${icon} me-2`}></i> {title}</h5>
        <p className="card-text fs-4 fw-bold">{count}</p>
        <Link to={link} className="btn btn-light">
          Manage <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  </div>
);

export default PoliceDashboard;
