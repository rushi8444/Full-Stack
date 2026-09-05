import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 20,
  interactive = false,
  onChange,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(displayRating);

        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive || disabled}
            onClick={() => interactive && onChange && onChange(starValue)}
            onMouseEnter={() => interactive && !disabled && setHoverRating(starValue)}
            onMouseLeave={() => interactive && !disabled && setHoverRating(0)}
            className={`transition-transform duration-100 ${
              interactive && !disabled
                ? 'cursor-pointer hover:scale-125 focus:outline-none'
                : 'cursor-default'
            }`}
            title={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : `${rating} / ${maxStars}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isFilled
                  ? 'fill-amber-400 text-amber-500'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
