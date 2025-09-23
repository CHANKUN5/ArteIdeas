import React from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import Button from '../common/Button';

const ClausesTable = ({ clauses, onUpdateClauses, editable = true }) => {
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');

  const handleAddClause = () => {
    const newClauses = [...clauses, ''];
    onUpdateClauses(newClauses);
  };

  const handleDeleteClause = (index) => {
    const newClauses = clauses.filter((_, i) => i !== index);
    onUpdateClauses(newClauses);
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditValue(clauses[index]);
  };

  const handleSaveEdit = () => {
    const newClauses = [...clauses];
    newClauses[editingIndex] = editValue;
    onUpdateClauses(newClauses);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Cláusulas del Contrato</h4>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleAddClause}
            >
              Agregar Cláusula
            </Button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {clauses.map((clause, index) => (
          <div key={index} className="p-4">
            {editingIndex === index ? (
              <div className="space-y-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  rows="3"
                  placeholder="Escriba la cláusula aquí..."
                />
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveEdit}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {clause || <span className="text-gray-400 italic">Cláusula vacía</span>}
                  </p>
                </div>
                {editable && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit3 className="w-4 h-4" />}
                      onClick={() => handleStartEdit(index)}
                      className="text-blue-600 hover:bg-blue-50"
                    />
                    {clauses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => handleDeleteClause(index)}
                        className="text-red-600 hover:bg-red-50"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {clauses.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No hay cláusulas definidas</p>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleAddClause}
              className="mt-2"
            >
              Agregar Primera Cláusula
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClausesTable;
