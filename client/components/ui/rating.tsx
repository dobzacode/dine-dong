import { Star, StarHalf, Star as StarOutline } from 'lucide-react';
import React from 'react';

interface RatingProps {
  value: number;
  totalStars?: number;
}

const Rating: React.FC<RatingProps> = ({ value, totalStars = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= fullStars) {
      stars.push(<Star size={20} strokeWidth={1} className="fill-primary" key={i} />);
    } else if (halfStar && i === fullStars + 1) {
      stars.push(
        <div className="relative [&>svg]:stroke-primary-300">
          <StarHalf size={20} strokeWidth={1} className="fill-primary" key={i} />
          <StarOutline
            size={20}
            className="absolute left-0 top-0 -z-10 fill-primary-900/20 !stroke-primary-900/20"
            strokeWidth={1}
            key={i}
          />
        </div>
      );
    } else {
      stars.push(
        <StarOutline
          size={20}
          className="fill-primary-900/20 !stroke-primary-900/20"
          strokeWidth={1}
          key={i}
        />
      );
    }
  }

  return <div className="relative z-20 flex [&>svg]:stroke-primary-300">{stars}</div>;
};

export default Rating;
