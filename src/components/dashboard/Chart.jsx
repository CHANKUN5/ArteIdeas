import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// Función para formatear números en formato abreviado (k, M, B)
const formatNumber = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value.toString();
};

const Chart = ({ 
  type = 'line', 
  data, 
  height = 300, 
  color = '#1DD1E3',
  title,
  dataKey = 'value',
  nameKey = 'name',
  lines = [], // Para gráficos multiLine
  bars = []   // Para gráficos multiBar
}) => {
  const colors = ['#1DD1E3', '#FF9912', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={nameKey} 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${formatNumber(value)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`S/ ${value.toLocaleString('es-ES')}`, 'Ingresos']}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'multiLine':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={nameKey} 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`S/ ${value.toLocaleString('es-ES')}`, name]}
              />
              <Legend />
              {lines.map((line, index) => (
                <Line 
                  key={line.key}
                  type="monotone" 
                  dataKey={line.key} 
                  stroke={line.color} 
                  strokeWidth={3}
                  dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: line.color }}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data}
              margin={{ top: 30, right: 40, left: 40, bottom: 70 }}
              barCategoryGap="15%"
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={nameKey} 
                stroke="#6b7280" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `S/ ${(value/1000).toFixed(0)}k`;
                  }
                  return `S/ ${value}`;
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`S/ ${value.toLocaleString()}`, name]}
              />
              <Legend />
              {bars.length > 0 ? (
                bars.map((bar, index) => (
                  <Bar 
                    key={bar.key}
                    dataKey={bar.key} 
                    fill={bar.color}
                    radius={[4, 4, 0, 0]}
                    name={bar.name}
                  />
                ))
              ) : (
                <Bar 
                  dataKey={dataKey} 
                  fill={color}
                  radius={[2, 2, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      )}
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart;