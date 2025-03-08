import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h2 className="mt-3">{authUser?.name}</h2>
        <p className="text-muted">{authUser?.email}</p>
        <h5 className="mt-3">
          Credit Points: <span className="badge bg-success">{authUser?.credits || 0}</span>
        </h5>
      </div>
      
      <div className="text-center mt-3">
        <Link to="/history" className="btn btn-primary fw-bold px-4 py-2 shadow-sm">
          📜 View Report History
        </Link>
      </div>
    </div>
  );
};

export default Profile;
