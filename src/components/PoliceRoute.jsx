import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PoliceRoute = () => {
  const { user } = useContext(AuthContext);

  // Check if the user is authenticated and has the role of "police"
  if (!user || user.role !== 'police') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PoliceRoute;
