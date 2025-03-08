import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const SafetyGuide = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Safety Guide</h2>
        </div>
        <div className="card-body">
          <p className="lead">Here are some safety tips and emergency procedures you should follow in case of a crime.</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Stay aware of your surroundings at all times.</li>
            <li className="list-group-item">Avoid walking alone at night in isolated areas.</li>
            <li className="list-group-item">If you feel unsafe, contact emergency services immediately.</li>
            <li className="list-group-item">Keep your phone charged and emergency contacts saved.</li>
            <li className="list-group-item">Report any suspicious activities to the authorities.</li>
          </ul>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-primary">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuide;
