import React from 'react';

const SubcategoryTabs = ({ subcategories, activeSubcategory, setActiveSubcategory }) => {
  return (
    <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
      {Object.entries(subcategories).map(([key, subcategory]) => (
        <button
          key={key}
          onClick={() => setActiveSubcategory(key)}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeSubcategory === key
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {subcategory.name}
        </button>
      ))}
    </div>
  );
};

export default SubcategoryTabs;