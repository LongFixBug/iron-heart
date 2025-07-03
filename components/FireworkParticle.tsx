import React, { memo } from 'react';

interface FireworkParticleProps {
  id: string;
  style: React.CSSProperties;
  color: string;
  size: number;
}

const FireworkParticleComponent: React.FC<FireworkParticleProps> = ({ style, color, size }) => {
  const particleStyle: React.CSSProperties = {
    ...style,
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    boxShadow: `0 0 ${size * 1.5}px ${color}, 0 0 ${size * 3}px ${color}99`,
  };
  return <div className="firework-particle" style={particleStyle} aria-hidden="true" />;
};


const FireworkParticle = memo(FireworkParticleComponent);
export default FireworkParticle;
