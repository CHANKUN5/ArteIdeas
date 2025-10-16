import React from 'react';

const CategoryTabs = ({ categories, activeCategory, setActiveCategory, setActiveSubcategory }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
      {Object.entries(categories).map(([key, category]) => {
        const IconComponent = category.icon;
        return (
          <button
            key={key}
            onClick={() => {
              setActiveCategory(key);
              // Solo establecer subcategoría si la categoría tiene subcategorías
              if (category.subcategories && Object.keys(category.subcategories).length > 0) {
                setActiveSubcategory(Object.keys(category.subcategories)[0]);
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeCategory === key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span className="font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;