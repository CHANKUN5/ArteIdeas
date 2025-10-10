import React from 'react';

const FilterButtons = ({ activeFilter, onFilterChange, categories }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onFilterChange(category.key)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
            ${activeFilter === category.key
              ? `${category.color} ${category.textColor} ${category.borderColor} shadow-md transform scale-105`
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          <span className="flex items-center gap-2">
            {category.icon && <category.icon className="w-4 h-4" />}
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;