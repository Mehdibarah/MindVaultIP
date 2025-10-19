import React from 'react';

const BrainCircuitIcon = ({ className = "w-6 h-6", ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="leftBrainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00BFFF" />
          <stop offset="50%" stopColor="#1E90FF" />
          <stop offset="100%" stopColor="#4169E1" />
        </linearGradient>
        <linearGradient id="rightBrainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A2BE2" />
          <stop offset="50%" stopColor="#9932CC" />
          <stop offset="100%" stopColor="#8B008B" />
        </linearGradient>
      </defs>
      
      {/* Brain outline with realistic gyri and sulci */}
      <path
        d="M12 2C9.5 2 7.5 3.5 7 5.5C6.8 6.2 6.5 7 6.5 7.8C6.5 8.5 6.8 9.2 7.2 9.8C7.5 10.5 7.8 11.2 8 12C7.8 12.8 7.5 13.5 7.2 14.2C6.8 14.8 6.5 15.5 6.5 16.2C6.5 17 6.8 17.8 7 18.5C7.5 20.5 9.5 22 12 22C14.5 22 16.5 20.5 17 18.5C17.2 17.8 17.5 17 17.5 16.2C17.5 15.5 17.2 14.8 16.8 14.2C16.5 13.5 16.2 12.8 16 12C16.2 11.2 16.5 10.5 16.8 9.8C17.2 9.2 17.5 8.5 17.5 7.8C17.5 7 17.2 6.2 17 5.5C16.5 3.5 14.5 2 12 2Z"
        fill="url(#leftBrainGradient)"
        stroke="url(#leftBrainGradient)"
        strokeWidth="0.2"
      />
      
      {/* Right hemisphere with purple gradient */}
      <path
        d="M12 2C14.5 2 16.5 3.5 17 5.5C17.2 6.2 17.5 7 17.5 7.8C17.5 8.5 17.2 9.2 16.8 9.8C16.5 10.5 16.2 11.2 16 12C16.2 12.8 16.5 13.5 16.8 14.2C17.2 14.8 17.5 15.5 17.5 16.2C17.5 17 17.2 17.8 17 18.5C16.5 20.5 14.5 22 12 22C9.5 22 7.5 20.5 7 18.5C6.8 17.8 6.5 17 6.5 16.2C6.5 15.5 6.8 14.8 7.2 14.2C7.5 13.5 7.8 12.8 8 12C7.8 11.2 7.5 10.5 7.2 9.8C6.8 9.2 6.5 8.5 6.5 7.8C6.5 7 6.8 6.2 7 5.5C7.5 3.5 9.5 2 12 2Z"
        fill="url(#rightBrainGradient)"
        stroke="url(#rightBrainGradient)"
        strokeWidth="0.2"
      />
      
      {/* Central dividing line */}
      <path
        d="M12 2L12 22"
        stroke="white"
        strokeWidth="0.3"
        opacity="0.8"
      />
      
      {/* Left hemisphere circuit patterns */}
      <path
        d="M8.5 4.5C9.2 5.2 9.8 5.8 10.5 6.5"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M7.8 7.2C8.5 7.9 9.2 8.6 9.9 9.3"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M8.2 10.5C8.9 11.2 9.6 11.9 10.3 12.6"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M7.5 13.8C8.2 14.5 8.9 15.2 9.6 15.9"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M8.8 17.2C9.5 17.9 10.2 18.6 10.9 19.3"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      
      {/* Right hemisphere circuit patterns */}
      <path
        d="M15.5 4.5C14.8 5.2 14.2 5.8 13.5 6.5"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M16.2 7.2C15.5 7.9 14.8 8.6 14.1 9.3"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M15.8 10.5C15.1 11.2 14.4 11.9 13.7 12.6"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M16.5 13.8C15.8 14.5 15.1 15.2 14.4 15.9"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M15.2 17.2C14.5 17.9 13.8 18.6 13.1 19.3"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      
      {/* Circuit connection nodes - left hemisphere */}
      <circle cx="9.5" cy="5.5" r="0.6" fill="white" opacity="0.95" />
      <circle cx="8.8" cy="8.2" r="0.6" fill="white" opacity="0.95" />
      <circle cx="9.2" cy="11.5" r="0.6" fill="white" opacity="0.95" />
      <circle cx="8.5" cy="14.8" r="0.6" fill="white" opacity="0.95" />
      <circle cx="9.8" cy="18.2" r="0.6" fill="white" opacity="0.95" />
      
      {/* Circuit connection nodes - right hemisphere */}
      <circle cx="14.5" cy="5.5" r="0.6" fill="white" opacity="0.95" />
      <circle cx="15.2" cy="8.2" r="0.6" fill="white" opacity="0.95" />
      <circle cx="14.8" cy="11.5" r="0.6" fill="white" opacity="0.95" />
      <circle cx="15.5" cy="14.8" r="0.6" fill="white" opacity="0.95" />
      <circle cx="14.2" cy="18.2" r="0.6" fill="white" opacity="0.95" />
      
      {/* Additional circuit details for more complexity */}
      <path
        d="M10.5 3.5C11.2 4.2 11.8 4.8 12.5 5.5"
        stroke="white"
        strokeWidth="0.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M13.5 3.5C12.8 4.2 12.2 4.8 11.5 5.5"
        stroke="white"
        strokeWidth="0.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M10.5 18.5C11.2 17.8 11.8 17.2 12.5 16.5"
        stroke="white"
        strokeWidth="0.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M13.5 18.5C12.8 17.8 12.2 17.2 11.5 16.5"
        stroke="white"
        strokeWidth="0.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
};

export default BrainCircuitIcon;
