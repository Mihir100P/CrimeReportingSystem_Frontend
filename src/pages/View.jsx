import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

const ViewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const { data } = await axios.get(`http://localhost:5000/api/reports/${id}`, config);
      
        const baseUrl = "http://localhost:5000";
        const updatedMediaUrls = data.mediaUrls.map((url) =>
          url.startsWith("http") ? url : `${baseUrl}${url}`
        );

        setReport({ ...data, mediaUrls: updatedMediaUrls });
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch report details. " + error.message);
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <h2 className="text-primary text-center">{report.title}</h2>
              <p className="text-muted text-center">
                {new Date(report.createdAt).toLocaleString()}
              </p>

              <Card className="mb-4 p-3">
                <h5>Incident Type: <span className="text-danger">{report.incidentType}</span></h5>
                <p>{report.description}</p>
              </Card>

              <Card className="mb-4 p-3">
                <h5>Status: 
                  <span className={`badge ${report.status === "Resolved" ? "bg-success" : "bg-warning"} ms-2`}>
                    {report.status}
                  </span>
                </h5>
              </Card>

              <Card className="mb-4 p-3">
                <h5>Location</h5>
                <p>{report.location.address}</p>
                <iframe
                  title="incident-location"
                  src={`https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}&z=15&output=embed`}
                  width="100%"
                  height="300px"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Card>

              {report.mediaUrls.length > 0 && (
                <Card className="mb-4 p-3">
                  <h5>Media Files</h5>
                  <div className="d-flex flex-wrap">
                    {report.mediaUrls.map((media, index) => (
                      <div key={index} className="me-3">
                        {media.endsWith(".mp4") ? (
                          <video width="250" controls onError={(e) => e.target.src = "/placeholder.mp4"}>
                            <source src={media} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={media}
                            alt="Crime Evidence"
                            className="img-thumbnail"
                            width="250"
                            onError={(e) => (e.target.src = "/placeholder.jpg")}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="text-center">
                <Button as={Link} to="/dashboard" variant="secondary">
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewReport;
