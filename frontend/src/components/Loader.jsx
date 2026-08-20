import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container">
    <div style={{ position: 'relative' }}>
      <div className="spinner" />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--primary)',
        }} />
      </div>
    </div>
    <span style={{ fontWeight: 500, letterSpacing: '0.01em' }}>{text}</span>
  </div>
);

export default Loader;
