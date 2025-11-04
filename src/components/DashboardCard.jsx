import React from 'react';

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-600">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
