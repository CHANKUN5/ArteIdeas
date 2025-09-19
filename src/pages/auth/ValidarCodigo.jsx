import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ValidarCodigo = () => {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codigo.length !== 6) return alert("El código debe tener 6 dígitos");

    alert("Código validado correctamente");
    navigate("/nueva-contrasena"); // 🔥 redirigir
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Validar Código</h2>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de 6 dígitos"
          maxLength={6}
          className="w-full p-2 border rounded-lg mb-4 text-center tracking-widest"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Validar
        </button>
      </form>
    </div>
  );
};

export default ValidarCodigo;
