import React, { useState, useEffect, useMemo, memo } from 'react';
import FireworkParticle from './FireworkParticle';

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const FIREWORK_COLORS = ['#FF5252', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FFFFFF', '#FF8A65', '#FFEB3B'];

interface FireworkExplosionProps {
  id: string | number;
  startX: number; // Launch origin X (e.g., click X)
  startY: number; // Launch origin Y (e.g., bottom of screen)
  targetX: number; // Target explosion X (click X)
  targetY: number; // Target explosion Y (click Y)
  onRemove: (id: string | number) => void;
}

interface ParticleData {
  id: string;
  style: React.CSSProperties;
  color: string;
  size: number;
}

const FireworkExplosionComponent: React.FC<FireworkExplosionProps> = ({ id, startX, startY, targetX, targetY, onRemove }) => {
  const [phase, setPhase] = useState<'launching' | 'exploding' | 'done'>('launching');
  // const [rocketPosition, setRocketPosition] = useState({ x: startX, y: startY }); // Removed unused state
  
    const distanceY = startY - targetY;
  const distanceX = Math.abs(startX - targetX); // Though rocket mainly goes up
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  const rocketFlightDuration = Math.max(0.5, Math.min(2.5, distance / 500)); // Adjust speed factor 500 as needed
  const explosionDisplayDuration = getRandom(2, 3.5); // seconds
  const numParticles = Math.floor(getRandom(70, 120)); // Increased for bigger explosion
  const explosionColor = FIREWORK_COLORS[Math.floor(getRandom(0, FIREWORK_COLORS.length))];
  const rocketSize = getRandom(4, 8); //px

  useEffect(() => {
    if (phase === 'launching') {
      const timer = setTimeout(() => {
        setPhase('exploding');
        // Rocket has "reached peak" and will disappear due to its animation ending in opacity 0
      }, rocketFlightDuration * 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'exploding') {
      const timer = setTimeout(() => {
        setPhase('done');
        onRemove(id);
      }, explosionDisplayDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, rocketFlightDuration, explosionDisplayDuration, id, onRemove]);

  const rocketStyle: React.CSSProperties & { 
    '--rocket-start-x': string;
    '--rocket-start-y': string;
    '--rocket-target-x': string;
    '--rocket-target-y': string;
  } = {
    position: 'absolute',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${rocketSize}px`,
    height: `${rocketSize}px`,
    backgroundColor: explosionColor,
    animation: `fireworkRocketFly ${rocketFlightDuration}s cubic-bezier(0.5, 0, 1, 0.5) forwards`,
    '--rocket-start-x': `${startX}px`,
    '--rocket-start-y': `${startY}px`,
    '--rocket-target-x': `${targetX}px`,
    '--rocket-target-y': `${targetY}px`,
    // Rocket animation ends with opacity 0
  } as React.CSSProperties & { 
    '--rocket-start-x': string;
    '--rocket-start-y': string;
    '--rocket-target-x': string;
    '--rocket-target-y': string;
  };

  const particles = useMemo<ParticleData[]>(() => {
    if (phase !== 'exploding') return [];
    
    const explosionCenterX = targetX + rocketSize / 2;
    const explosionCenterY = targetY + rocketSize / 2;


    return Array.from({ length: numParticles }).map((_, i) => {
      const angle = getRandom(0, 2 * Math.PI);
      const speed = getRandom(50, 180); // Max distance particle travels from center
      const gravityEffect = getRandom(0.5, 1.5); // Simple factor for downward drift

      const endX = Math.cos(angle) * speed;
      const endY = Math.sin(angle) * speed * 0.7 + speed * 0.5 * gravityEffect; // Make it a bit more elliptical and fall

      const particleSize = getRandom(4, 8); // Increased for bigger explosion
      const particleColor = Math.random() < 0.7 ? explosionColor : FIREWORK_COLORS[Math.floor(getRandom(0, FIREWORK_COLORS.length))]; // Mix in some other colors

      const animationDelay = getRandom(0, 0.3); // Stagger particle animations slightly
      const particleDuration = explosionDisplayDuration - animationDelay - 0.2;


      return {
        id: `p-${id}-${i}`,
        size: particleSize,
        color: particleColor,
        style: {
          position: 'absolute',
          left: `${explosionCenterX - particleSize / 2}px`,
          top: `${explosionCenterY - particleSize / 2}px`,
          animationName: 'fireworkParticleBurst',
          animationDuration: `${Math.max(0.5, particleDuration)}s`,
          animationTimingFunction: 'cubic-bezier(0.1, 0.8, 0.2, 1)', // Fast out, slow down
          animationFillMode: 'forwards',
          animationDelay: `${animationDelay}s`,
          opacity: 0, // Start transparent, animation will fade in then out
          '--explode-x': `${endX}px`,
          '--explode-y': `${endY}px`,
        } as React.CSSProperties,
      };
    });
  }, [phase, id, numParticles, explosionColor, targetX, targetY, rocketSize, explosionDisplayDuration]);

  if (phase === 'done') return null;

  return (
    <>
      {phase === 'launching' && <div className="firework-rocket" style={rocketStyle} />}
      {phase === 'exploding' && particles.map(p => (
        <FireworkParticle key={p.id} id={p.id} style={p.style} color={p.color} size={p.size} />
      ))}
    </>
  );
};


const FireworkExplosion = memo(FireworkExplosionComponent);
export default FireworkExplosion;
