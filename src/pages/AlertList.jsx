import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AlertContext } from "../context/AlertContext"; 

const socket = io("http://localhost:5000"); 

const AlertsList = () => {
  const { alerts, loading } = useContext(AlertContext);
  const [realTimeAlerts, setRealTimeAlerts] = useState([]);

  useEffect(() => {
    socket.on("newAlert", (data) => {
      setRealTimeAlerts((prevAlerts) => [data, ...prevAlerts]);
    });

    return () => {
      socket.off("newAlert");
    };
  }, []);

  if (loading) return <p>Loading alerts...</p>;

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Safety Alerts</h2>
      <ul>
        {/* Show real-time alerts first */}
        {realTimeAlerts.map((alert, index) => (
          <li key={index} className="bg-red-100 text-red-700 p-2 mb-2 rounded">
            🔴 {alert.message}
          </li>
        ))}
        {/* Show existing alerts from the database */}
        {alerts.map((alert, index) => (
          <li key={index} className="bg-gray-100 text-gray-700 p-2 mb-2 rounded">
            ⚠️ {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsList;
