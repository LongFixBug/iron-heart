
import React, { useMemo } from 'react';

interface ParticleProps {
  id: string;
  style: React.CSSProperties;
}

const Particle: React.FC<ParticleProps> = ({ id, style }) => {
  return <div id={id} style={style} aria-hidden="true" />;
};

interface ParticleSystemProps {
  count: number;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const PARTICLE_COLORS = ['#FF6B6B', '#FFD166', '#F78AE0', '#ff99cc', '#ff66b3', '#7FFFD4', '#87CEEB', '#f0f0f0', '#ffef61'];

const ParticleSystem: React.FC<ParticleSystemProps> = ({ count }) => {
  const particles = useMemo(() => {
    // Get window dimensions for full screen distribution
    // These are captured once at component memoization. For full resize responsiveness, a resize listener would be needed.
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    return Array.from({ length: count }).map((_, i) => {
      const size = getRandom(1.5, 5);
      // Distribute particles across the entire screen view
      // Offsets are from the center of the parent (mainViewStyle div)
      const initialX = getRandom(-screenW / 1.8, screenW / 1.8); // Use ~90% of screen width
      const initialY = getRandom(-screenH / 1.8, screenH / 1.8); // Use ~90% of screen height
      const initialZ = getRandom(-450, 450); // Increased Z range for more depth across screen

      const particleColor = PARTICLE_COLORS[Math.floor(getRandom(0, PARTICLE_COLORS.length))];
      const glowColor1 = `${particleColor}cc`;
      const glowColor2 = `${particleColor}77`;
      const glowColor3 = `#ffffff33`;

      const opacityMin = getRandom(0.4, 0.7);
      const opacityMax = getRandom(0.9, 1.0);
      
      const sparkleDuration = getRandom(0.8, 1.8);
      const sparkleDelay = getRandom(0, 2.0);
      
      const floatDuration = getRandom(10, 20); // Slightly longer float duration
      const floatDelay = getRandom(0, 10);

      // Increased float ranges for wider movement suitable for full-screen distribution
      const floatDx1 = getRandom(-180, 180); 
      const floatDy1 = getRandom(-180, 180); 
      const floatDz1 = getRandom(-150, 150); 
      const floatDx2 = getRandom(-180, 180);
      const floatDy2 = getRandom(-180, 180);
      const floatDz2 = getRandom(-150, 150);
      const floatDx3 = getRandom(-180, 180);
      const floatDy3 = getRandom(-180, 180);
      const floatDz3 = getRandom(-150, 150);

      const boxShadow = `
        0 0 ${size * 0.8}px ${particleColor},
        0 0 ${size * 2.5}px ${glowColor1},
        0 0 ${size * 5}px ${glowColor2},
        0 0 ${size * 9}px ${glowColor3}
      `;

      return {
        id: `particle-${i}`,
        style: {
          position: 'absolute',
          top: '50%', 
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: particleColor,
          borderRadius: '50%',
          boxShadow: boxShadow,
          transform: `translate3d(${initialX - size / 2}px, ${initialY - size / 2}px, ${initialZ}px)`,
          transformStyle: 'preserve-3d',
          animationName: 'enhancedSparkle, floatAround',
          animationDuration: `${sparkleDuration}s, ${floatDuration}s`,
          animationIterationCount: 'infinite, infinite',
          animationTimingFunction: 'ease-in-out, ease-in-out',
          animationDelay: `${sparkleDelay}s, ${floatDelay}s`,
          '--opacity-min': opacityMin,
          '--opacity-max': opacityMax,
          '--float-dx1': `${floatDx1}px`,
          '--float-dy1': `${floatDy1}px`,
          '--float-dz1': `${floatDz1}px`,
          '--float-dx2': `${floatDx2}px`,
          '--float-dy2': `${floatDy2}px`,
          '--float-dz2': `${floatDz2}px`,
          '--float-dx3': `${floatDx3}px`,
          '--float-dy3': `${floatDy3}px`,
          '--float-dz3': `${floatDz3}px`,
        } as React.CSSProperties, 
      };
    });
  }, [count]);

  return (
    <>
      {particles.map(p => (
        <Particle key={p.id} id={p.id} style={p.style} />
      ))}
    </>
  );
};

export default ParticleSystem;
