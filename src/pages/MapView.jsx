import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { stationsApi } from "../services/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Container, Card, Button, Spinner, Alert, ListGroup } from "react-bootstrap";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom police station icon
const policeIcon = new L.Icon({
  iconUrl: "/src/assets/police-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to set map view based on user's location
const SetViewOnLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      map.setView([coords.latitude, coords.longitude], 13);
    }
  }, [coords, map]);
  return null;
};

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please allow location access.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch nearby police stations
  const { data: stations, isLoading, error: apiError } = useQuery({
    queryKey: ["nearbyStations", userLocation?.latitude, userLocation?.longitude],
    queryFn: () => stationsApi.getNearby(userLocation.latitude, userLocation.longitude),
    enabled: !!userLocation?.latitude && !!userLocation?.longitude,
  });

  // Function to calculate route to a police station
  const calculateRoute = useCallback(
    (station) => {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${station.location.coordinates[1]},${station.location.coordinates[0]}&travelmode=driving`,
        "_blank"
      );
    },
    [userLocation]
  );

  return (
    <Container className="mt-4 container">
      <h1 className="text-center text-primary fw-bold mb-4">Locate Services </h1>

      {error || apiError ? (
        <Alert variant="danger" className="text-center">
          {error || apiError?.message}
        </Alert>
      ) : null}

      {/* Map Section */}
      <Card className="shadow-lg border-0 mb-4">
        <Card.Body>
          {userLocation ? (
            <div style={{ height: "500px", width: "100%" }}>
              <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                <SetViewOnLocation coords={userLocation} />

                {/* User Marker */}
                <Marker position={[userLocation.latitude, userLocation.longitude]}>
                  <Popup>
                    <strong>You are here</strong>
                  </Popup>
                </Marker>

                {/* Police Stations Markers */}
                {!isLoading &&
                  stations?.data?.map((station) => (
                    <Marker key={station._id} position={[station.location.coordinates[1], station.location.coordinates[0]]} icon={policeIcon}>
                      <Popup>
                        <div>
                          <h5 className="fw-bold">{station.name}</h5>
                          <p>{station.address}</p>
                          <p>Phone: {station.phone}</p>
                          <Button variant="primary" size="sm" onClick={() => calculateRoute(station)}>
                            Get Directions
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          ) : (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Getting your location...</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Police Stations List */}
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="fw-bold text-secondary mb-3">Police Stations Directory</h3>

          {isLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" variant="secondary" />
              <p className="mt-2">Loading nearby stations...</p>
            </div>
          ) : stations?.data?.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No police stations found in your area.
            </Alert>
          ) : (
            <ListGroup>
              {stations?.data?.map((station) => (
                <ListGroup.Item key={station._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{station.name}</h5>
                    <p className="mb-0 text-muted">{station.address}</p>
                    <small>Phone: {station.phone}</small>
                  </div>
                  <Button variant="success" size="sm" onClick={() => calculateRoute(station)}>
                    Get Directions
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
      <br /><br /><br />
    </Container>
  );
};

export default MapView;
