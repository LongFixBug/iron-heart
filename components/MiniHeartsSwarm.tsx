
import React, { useMemo } from 'react';
import { HeartIconPath } from './Heart3D'; // Import the path

interface MiniHeartProps {
  id: string;
  style: React.CSSProperties; // For the wrapper div
  svgStyle: React.CSSProperties; // For the SVG element itself
  size: number;
  color: string;
}

const MiniHeart: React.FC<MiniHeartProps> = ({ id, style, svgStyle, size, color }) => {
  return (
    <div id={id} style={style} aria-hidden="true">
      <svg 
        viewBox="0 0 24 24" 
        fill={color} 
        style={svgStyle}
        width={size}
        height={size}
      >
        <path d={HeartIconPath} />
      </svg>
    </div>
  );
};


interface MiniHeartsSwarmProps {
  count: number;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
const MINI_HEART_COLORS = ['#EF4444', '#F472B6', '#EC4899'];


const MiniHeartsSwarm: React.FC<MiniHeartsSwarmProps> = ({ count }) => {
  const miniHearts = useMemo(() => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    return Array.from({ length: count }).map((_, i) => {
      const size = getRandom(20, 45); // Slightly increased max size for mini hearts
      // Distribute mini hearts across the entire screen view
      const x = getRandom(-screenW / 1.9, screenW / 1.9); // Use ~95% of screen for broader spread
      const y = getRandom(-screenH / 1.9, screenH / 1.9);
      const z = getRandom(-400, 400); // Increased Z range

      const color = MINI_HEART_COLORS[Math.floor(getRandom(0, MINI_HEART_COLORS.length))];
      
      const opacityMin = getRandom(0.4, 0.6);
      const opacityMax = getRandom(0.7, 0.9);
      
      const pulseDuration = getRandom(2, 4);
      const pulseDelay = getRandom(0, 3);
      
      const driftDuration = getRandom(10, 18); // Slightly longer drift
      const driftDelay = getRandom(0, 9);

      // Increased drift ranges for wider movement
      const driftDx1 = getRandom(-60, 60);
      const driftDy1 = getRandom(-60, 60);
      const driftDz1 = getRandom(-40, 40);
      const driftRot1 = getRandom(-15, 15); // Increased rotation
      const driftDx2 = getRandom(-60, 60);
      const driftDy2 = getRandom(-60, 60);
      const driftDz2 = getRandom(-40, 40);
      const driftRot2 = getRandom(-15, 15); // Increased rotation

      return {
        id: `mini-heart-${i}`,
        size,
        color,
        wrapperStyle: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate3d(${x - size/2}px, ${y - size/2}px, ${z}px)`,
          transformStyle: 'preserve-3d', 
        } as React.CSSProperties,
        svgStyle: {
          width: `${size}px`,
          height: `${size}px`,
          opacity: opacityMin,
          filter: `drop-shadow(0 0 ${size / 4}px ${color}aa)`, // Slightly larger shadow for mini hearts
          animationName: 'pulseSimple, driftMiniHeart',
          animationDuration: `${pulseDuration}s, ${driftDuration}s`,
          animationIterationCount: 'infinite, infinite',
          animationTimingFunction: 'alternate, ease-in-out',
          animationDelay: `${pulseDelay}s, ${driftDelay}s`,
          '--opacity-min': opacityMin,
          '--opacity-max': opacityMax,
          '--drift-dx1': `${driftDx1}px`,
          '--drift-dy1': `${driftDy1}px`,
          '--drift-dz1': `${driftDz1}px`,
          '--drift-rot1': `${driftRot1}deg`,
          '--drift-dx2': `${driftDx2}px`,
          '--drift-dy2': `${driftDy2}px`,
          '--drift-dz2': `${driftDz2}px`,
          '--drift-rot2': `${driftRot2}deg`,
        } as React.CSSProperties,
      };
    });
  }, [count]);

  return (
    <>
      {miniHearts.map(mh => (
        <MiniHeart 
          key={mh.id}
          id={mh.id} 
          style={mh.wrapperStyle} 
          svgStyle={mh.svgStyle}
          size={mh.size}
          color={mh.color}
        />
      ))}
    </>
  );
};

export default MiniHeartsSwarm;
