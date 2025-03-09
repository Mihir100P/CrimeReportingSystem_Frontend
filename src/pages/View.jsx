import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const View = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]); // State for media preview

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        };

        const { data } = await axios.get(`http://localhost:5000/api/reports/${id}`, config);
        
        console.log("Fetched Report:", data); // Debugging log

        const baseUrl = "http://localhost:5000";
        const updatedMediaUrls = data.mediaUrls.map((url) =>
          url.startsWith("http") ? url : `${baseUrl}${url}`
        );

        setReport({ ...data, mediaUrls: updatedMediaUrls });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch report details:", error);
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

              {/* Map Section */}
              <Card className="mb-4 p-3">
                <h5>Location</h5>
                <p>{report.location.address}</p>
                <MapContainer center={[report.location.coordinates[1], report.location.coordinates[0]]} zoom={15} style={{ height: "300px", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[report.location.coordinates[1], report.location.coordinates[0]]}
                    eventHandlers={{
                      click: () => {
                        console.log("Media URLs on Marker Click:", report.mediaUrls); // Debugging
                        setSelectedMedia(report.mediaUrls);
                      },
                    }}
                  >
                    <Popup>Click to view media</Popup>
                  </Marker>
                </MapContainer>
              </Card>

              {/* Media Preview Section */}
              {selectedMedia.length > 0 && (
                <Card className="mb-4 p-3">
                  <h5>Media Files</h5>
                  <div className="d-flex flex-wrap">
                    {selectedMedia.map((media, index) => (
                      <div key={index} className="me-3">
                        {media.endsWith(".mp4") ? (
                          <video width="250" controls>
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

export default View;
