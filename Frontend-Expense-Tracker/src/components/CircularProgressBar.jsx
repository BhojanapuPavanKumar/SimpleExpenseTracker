// src/components/CircularProgressBar.jsx
import React, { useEffect, useState } from 'react';

const CircularProgressBar = ({ percentage, color = '#4caf50', label = '' }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - percentage) / 100) * circumference;

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="w-[120px] h-[120px] relative flex flex-col items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle
          r={radius}
          cx="50"
          cy="50"
          fill="none"
          stroke="#e5e7eb" /* Tailwind's gray-200 */
          strokeWidth="10"
          strokeDasharray={circumference}
        />
        <circle
          r={radius}
          cx="50"
          cy="50"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={isAnimating ? progress : circumference}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease',
          }}
        />
      </svg>
      <div className="absolute text-lg font-bold text-gray-700">{percentage}%</div>
      {label && <div className="mt-2 text-sm text-gray-500">{label}</div>}
    </div>
  );
};

export default CircularProgressBar;
