import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const AlertMessage = ({ type = 'error', message }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
      {isError
        ? <AlertCircle size={16} style={{ flexShrink: 0 }} />
        : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
      }
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
};

export default AlertMessage;
