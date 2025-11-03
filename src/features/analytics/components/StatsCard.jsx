import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  secondaryValue,
  change, 
  changeType = 'positive', 
  icon: Icon, 
  description,
  currency = false,
  showPercentage = false,
  multiValue = false,
  onClick,
  onSectionChange
}) => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onSectionChange) {
      // Cambiar sección según el título de la tarjeta
      switch (title) {
        case 'Ingresos Totales':
        case 'Costos Totales':
        case 'Utilidad Neta':
          onSectionChange('reportes');
          break;
        case 'Clientes':
          onSectionChange('clientes');
          break;
        case 'Pedidos':
          onSectionChange('pedidos');
          break;
        default:
          break;
      }
    }
  };
  const formatValue = (val) => {
    if (currency) {
      return `S/ ${val?.toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return val?.toLocaleString();
  };

  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  const changeBg = changeType === 'positive' ? 'bg-green-50' : 'bg-red-50';
  const TrendIcon = changeType === 'positive' ? TrendingUp : TrendingDown;
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 hover:scale-105 h-full min-h-[140px] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
          </div>
          {change && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${changeBg}`}>
              <TrendIcon className={`w-3 h-3 ${changeColor}`} />
              <span className={`text-xs font-medium ${changeColor}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>

        <div className="mb-2">
          {multiValue ? (
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900">
                {value}
              </h3>
              {secondaryValue && (
                <p className="text-lg font-semibold text-gray-600">
                  {secondaryValue}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {formatValue(value)}
              </h3>
              {showPercentage && secondaryValue && (
                <span className="text-lg font-semibold text-green-600">
                  {secondaryValue}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-500 mt-auto">{description}</p>
      )}
    </div>
  );
};

export default StatsCard;