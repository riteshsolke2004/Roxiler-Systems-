import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingInput = ({ value = 0, onChange, size = 28 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverValue || value);
          return (
            <Star
              key={star}
              size={size}
              className={`star-icon ${isFilled ? 'star-filled' : 'star-empty'}`}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              onClick={() => onChange(star)}
              style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
            />
          );
        })}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        {(hoverValue || value) > 0
          ? `${hoverValue || value} Star${(hoverValue || value) > 1 ? 's' : ''}`
          : 'Select your rating'}
      </span>
    </div>
  );
};

export default RatingInput;
