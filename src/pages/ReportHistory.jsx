import React from "react";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const ReportHistory = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.success ? location.state.message : ''
  );
  console.log(successMessage, setSuccessMessage);

  const { data: reports, isLoading, isError, error } = useQuery({
    queryKey: ['userReports'],
    queryFn: reportsApi.getUserReports,
  });

  const deleteMutation = useMutation({
    mutationFn: reportsApi.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries(['userReports']); // Refresh report list
    },
    onError: (error) => {
      alert("Error deleting report: " + error.message);
    },
  });
  
  const handleDelete = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteMutation.mutate(reportId);
    }
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'In Progress':
        return 'badge bg-primary';
      case 'Resolved':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="text-muted">Loading...</div></div>;
  }

  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Error loading reports: {error.message}</div>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Report History</h1>
      {/* {successMessage && <div className="alert alert-success">{successMessage}</div>} */}
      
      {reports?.data?.length === 0 ? (
        <div className="alert alert-info text-center">
          <p>You haven't submitted any reports yet.</p>
          <Link to="/report" className="btn btn-primary">Submit a Report</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports?.data?.map((report) => (
                <tr key={report._id}>
                  <td>{report.title} <br /><small className="text-muted">{report.location.address.substring(0, 30)}...</small></td>
                  <td>{report.incidentType.charAt(0).toUpperCase() + report.incidentType.slice(1)}</td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td><span className={getStatusColor(report.status)}>{report.status}</span></td>
                  <td>
                  <Link to={`/reports/${report._id}`} className="btn btn-sm btn-info me-2">View Details</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(report._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
