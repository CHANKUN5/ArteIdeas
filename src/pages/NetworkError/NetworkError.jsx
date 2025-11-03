import React from 'react';

const NetworkError = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">Error de red</h1>
      <p className="mt-2 text-gray-600">Verifica tu conexión a internet e inténtalo de nuevo.</p>
    </div>
  );
};

export default NetworkError;