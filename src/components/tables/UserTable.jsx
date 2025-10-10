import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium">No hay usuarios registrados</p>
        <p className="text-sm">Agrega el primer usuario para comenzar</p>
      </div>
    );
  }

  const getRoleColor = (role) => {
    const colors = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Ventas': 'bg-green-100 text-green-800',
      'Produccion': 'bg-blue-100 text-blue-800',
      'Operario': 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 font-medium text-gray-700">USUARIO</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">EMAIL</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">ROL</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">ESTADO</th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2 font-medium text-gray-900">{user.name}</td>
              <td className="py-3 px-2 text-gray-600">{user.email}</td>
              <td className="py-3 px-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Editar usuario"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;