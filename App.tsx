import React, { useState, useRef, useCallback } from 'react';
import Heart3D from './components/Heart3D';
import ParticleSystem from './components/ParticleSystem';
import FireworksEffect, { FireworksEffectRef } from './components/FireworksEffect';
import MusicPlayer from './components/MusicPlayer';
import MiniHeartsSwarm from './components/MiniHeartsSwarm';

// FireworksEffectRef is now imported from FireworksEffect.tsx


const App: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<FireworksEffectRef>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxRotateDeg = 35; 

      const rotateY = ((x - centerX) / centerX) * maxRotateDeg;
      const rotateX = -((y - centerY) / centerY) * maxRotateDeg;

      setRotation({ x: rotateX, y: rotateY });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Trigger firework from bottom, near clickX
      if (fireworksRef.current) {
        fireworksRef.current.launchFirework(clickX, clickY); // Use clickY as target Y
      }
    }
  }, [fireworksRef]); // Add fireworksRef to dependency array
  
  const perspectiveStyle: React.CSSProperties = {
    perspective: '1200px', 
  };
  
  const mainViewStyle: React.CSSProperties = {
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.1s ease-out', 
    width: '100%', 
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950 overflow-hidden cursor-grab select-none relative" 
      style={perspectiveStyle}
      role="application"
      aria-label="Interactive 3D Heart Animation"
    >
      {/* Screen-space effects - rendered before the main 3D container so they appear "behind" if z-indexes were default, but they are absolutely positioned anyway */}
      <FireworksEffect ref={fireworksRef} />
      <MusicPlayer />

      <div style={mainViewStyle}>
        <ParticleSystem count={75} /> 
        <Heart3D /> 
        <MiniHeartsSwarm count={20} />
      </div>
     
    </div>
  );
};

export default App;