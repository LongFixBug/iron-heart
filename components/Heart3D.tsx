import React from 'react';

interface Heart3DProps {
  // Rotation props are removed as the parent now handles it.
  // We can keep them if we want individual control, but for synced rotation, parent is better.
  // rotateX: number; 
  // rotateY: number;
}

export const HeartIconPath: string = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const Heart3D: React.FC<Heart3DProps> = (/*{ rotateX, rotateY }*/) => {
  const transformStyle: React.CSSProperties = {
    // transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, // Rotation now handled by parent
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      style={transformStyle}
      className="relative w-52 h-52 md:w-64 md:h-64" // Removed transition, parent handles smooth rotation
      role="img"
      aria-label="Main 3D Heart"
    >
      {/* Layer 1: Innermost Core - Brightest, sharpest */}
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="absolute inset-0 w-full h-full text-red-500 
                   filter drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] 
                   animate-pulse"
        style={{ animationDuration: '1.5s' }}
      >
        <path d={HeartIconPath} />
      </svg>

      {/* Layer 2: Primary Glow - Slightly softer, larger */}
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="absolute inset-0 w-full h-full text-pink-500 opacity-80 
                   filter blur-[2px] drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] 
                   animate-pulse"
        style={{ animationDuration: '1.5s', animationDelay: '-0.2s' }}
      >
        <path d={HeartIconPath} />
      </svg>

      {/* Layer 3: Ambient Haze - More diffuse, wider glow */}
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="absolute inset-0 w-full h-full text-pink-400 opacity-60 
                   filter blur-[4px] drop-shadow-[0_0_25px_rgba(244,114,182,0.7)] 
                   animate-pulse"
        style={{ animationDuration: '1.5s', animationDelay: '-0.4s' }}
      >
        <path d={HeartIconPath} />
      </svg>

      {/* Layer 4: Subtle outer aura - very soft */}
       <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="absolute inset-0 w-full h-full text-purple-400 opacity-40 
                   filter blur-[8px] drop-shadow-[0_0_35px_rgba(192,132,252,0.5)] 
                   animate-pulse"
        style={{ animationDuration: '1.5s', animationDelay: '-0.6s' }}
      >
        <path d={HeartIconPath} />
      </svg>
    </div>
  );
};

export default Heart3D;