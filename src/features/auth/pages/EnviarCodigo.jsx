import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnviarCodigo = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return alert("Ingresa un correo válido");
    
    alert(`Código enviado a ${email}`);
    navigate("/validar-codigo"); // 🔥 redirigir
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Recuperar Contraseña
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo"
          className="w-full p-2 border rounded-lg mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Enviar Código
        </button>
      </form>
    </div>
  );
};

export default EnviarCodigo;
