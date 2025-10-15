import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterSelect = ({ activeFilter, onFilterChange, categories }) => {
  const selectedCategory = categories.find(cat => cat.key === activeFilter) || categories[0];

  return (
    <div className="relative">
      <select
        value={activeFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="
          appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10
          text-sm font-medium text-gray-700 cursor-pointer
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200 min-w-[200px]
        "
      >
        {categories.map((category) => (
          <option key={category.key} value={category.key}>
            {category.label}
          </option>
        ))}
      </select>
      
      {/* Icono personalizado */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      
      {/* Indicador visual del filtro activo */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
    </div>
  );
};

export default FilterSelect;
