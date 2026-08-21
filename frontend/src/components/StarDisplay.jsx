import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarDisplay = ({ rating = 0, totalRatings = null, size = 18 }) => {
  const numRating = Number(rating) || 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => {
          if (numRating >= star) {
            // Full star
            return (
              <Star
                key={star}
                size={size}
                className="star-filled"
                style={{ fill: 'var(--gold)', color: 'var(--gold)', filter: 'drop-shadow(0 0 3px hsla(43,96%,56%,0.5))' }}
              />
            );
          } else if (numRating >= star - 0.75) {
            // Half star (e.g. 4.5, 3.5, 2.5, 4.3)
            return (
              <StarHalf
                key={star}
                size={size}
                className="star-filled"
                style={{ fill: 'var(--gold)', color: 'var(--gold)', filter: 'drop-shadow(0 0 3px hsla(43,96%,56%,0.5))' }}
              />
            );
          } else {
            // Empty star
            return (
              <Star
                key={star}
                size={size}
                className="star-empty"
                style={{ color: 'var(--text-disabled)' }}
              />
            );
          }
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
