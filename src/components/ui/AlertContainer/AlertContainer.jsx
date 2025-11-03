import React from 'react';
import Alert from '@components/ui/Alert/Alert.jsx';

const AlertContainer = ({ alerts, onRemoveAlert }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          autoClose={alert.autoClose}
          duration={alert.duration}
          onClose={() => onRemoveAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertContainer;