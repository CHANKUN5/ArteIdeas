import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-8',
    md: 'h-6 w-11',
    lg: 'h-8 w-14'
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-6 w-6'
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-7' : 'translate-x-1'
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex ${sizeClasses[size]} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-200' 
          : checked 
            ? 'bg-primary' 
            : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block ${thumbSizeClasses[size]} transform rounded-full bg-white transition-transform ${translateClasses[size]}`}
      />
    </button>
  );
};

export default ToggleSwitch;