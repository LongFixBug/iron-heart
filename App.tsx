import React, { useState, useRef, useCallback } from 'react';

import ParticleSystem from './components/ParticleSystem';
import FireworksEffect, { FireworksEffectRef } from './components/FireworksEffect';
import MusicPlayer from './components/MusicPlayer';

import FloatingCards from './components/FloatingCards'; // ✨ 1. Import component mới

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

      if (fireworksRef.current) {
        fireworksRef.current.launchFirework(clickX, clickY);
      }
    }
  }, [fireworksRef]);
  
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
      {/* Các hiệu ứng không gian màn hình (nằm ngoài khối xoay 3D) */}
      <FireworksEffect ref={fireworksRef} />
      <MusicPlayer />

      {/* Khối chứa các hiệu ứng xoay 3D */}
      <div style={mainViewStyle}>
        <ParticleSystem count={75} /> 
       
        
        {/* ✨ 2. Thêm component card bay vào đây để nó xoay cùng trái tim ✨ */}
        <FloatingCards />

      </div>
     
    </div>
  );
};

export default App;