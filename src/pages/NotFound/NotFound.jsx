import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800">Página no encontrada</h1>
      <p className="mt-2 text-gray-600">La ruta solicitada no existe.</p>
    </div>
  );
};

export default NotFound;