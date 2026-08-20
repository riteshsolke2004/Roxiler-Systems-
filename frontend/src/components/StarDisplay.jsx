import React from 'react';
import { Star } from 'lucide-react';

const StarDisplay = ({ rating = 0, totalRatings = null, size = 18 }) => {
  const numRating = Number(rating) || 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(numRating);
          return (
            <Star
              key={star}
              size={size}
              className={isFilled ? 'star-filled' : 'star-empty'}
              style={isFilled ? { fill: 'var(--gold)', color: 'var(--gold)', filter: 'drop-shadow(0 0 3px hsla(43,96%,56%,0.5))' } : { color: 'var(--text-disabled)' }}
            />
          );
        })}
      </div>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: numRating > 0 ? 'var(--gold)' : 'var(--text-muted)',
      }}>
        {numRating.toFixed(1)}
      </span>
      {totalRatings !== null && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};

export default StarDisplay;
