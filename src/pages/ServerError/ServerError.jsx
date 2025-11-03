import React from 'react';

const ServerError = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">Error del servidor (500)</h1>
      <p className="mt-2 text-gray-600">Algo salió mal en el servidor.</p>
    </div>
  );
};

export default ServerError;