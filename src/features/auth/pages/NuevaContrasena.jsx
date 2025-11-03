import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NuevaContrasena = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6 || password.length > 8) {
      return alert("La contraseña debe tener entre 6 y 8 dígitos");
    }
    alert("Contraseña actualizada con éxito");
    navigate("/login"); // redirige al login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Nueva Contraseña</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña (6 a 8 dígitos)"
          className="w-full p-2 border rounded-lg mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          Guardar Contraseña
        </button>
      </form>
    </div>
  );
};

export default NuevaContrasena;
