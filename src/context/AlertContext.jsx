import React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, loading }}>
      {children}
    </AlertContext.Provider>
  );
};
