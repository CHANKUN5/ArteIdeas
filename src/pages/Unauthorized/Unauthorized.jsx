import React from 'react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">No autorizado (401)</h1>
      <p className="mt-2 text-gray-600">No tienes permisos para ver esta página.</p>
    </div>
  );
};

export default Unauthorized;