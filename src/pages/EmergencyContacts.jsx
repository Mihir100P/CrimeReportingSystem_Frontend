import React from 'react';

const EmergencyServices = () => {
  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light">
      <h1 className="text-primary mb-4">Emergency Contacts</h1>
      <ul className="list-group">
        <li className="list-group-item">Police: <strong>100</strong></li>
        <li className="list-group-item">Ambulance: <strong>108</strong></li>
        <li className="list-group-item">Fire Brigade: <strong>101</strong></li>
      </ul>
    </div>
  );
};

export default EmergencyServices;