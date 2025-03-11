import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = io("http://localhost:5000"); // Adjust based on your backend URL

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        };
        const { data } = await axios.get("http://localhost:5000/api/alerts", config);
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Listen for new alerts via WebSocket
    socket.on("new-alert", (newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]); 
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, loading }}>
      {children}
    </AlertContext.Provider>
  );
};
