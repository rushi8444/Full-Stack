import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-0.5">
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
            className={`p-0.5 transition-colors focus:outline-none ${
              interactive && !disabled
                ? 'cursor-pointer hover:text-amber-500'
                : 'cursor-default'
            }`}
            title={interactive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : `${rating} / ${maxStars}`}
            aria-label={`Rating ${starValue} of ${maxStars}`}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isFilled
                  ? 'fill-amber-400 text-amber-500'
                  : 'fill-zinc-100 text-zinc-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
