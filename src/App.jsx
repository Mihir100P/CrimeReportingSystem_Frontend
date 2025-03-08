import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportForm from "./pages/ReportForm";
import ReportHistory from "./pages/ReportHistory";
import MapView from "./pages/MapView";
import Profile from "./pages/Profile";
import SafetyGuide from "./pages/SafetyGuide";
import EmergencyContacts from "./pages/EmergencyContacts";
import LiveStream from "./pages/LiveStream";
import NotFound from "./pages/NotFound";
import View from "./pages/View";
import AdminDashboard from "./pages/AdminDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PoliceRoute from "./components/PoliceRoute";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emergency" element={<EmergencyContacts />} />
          <Route path="/guide" element={<SafetyGuide />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<ReportHistory />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/live" element={<LiveStream />} />
            <Route path="/reports/:id" element={<View />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Police Routes */}
          <Route element={<PoliceRoute />}>
            <Route path="/police" element={<PoliceDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

