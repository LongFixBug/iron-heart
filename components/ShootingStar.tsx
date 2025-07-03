import React, { useEffect, memo } from 'react';

interface ShootingStarProps {
  id: string;
  style: React.CSSProperties;
  animationDuration: number; // in seconds
  onRemove: (id: string) => void;
}

const ShootingStarComponent: React.FC<ShootingStarProps> = ({ id, style, animationDuration, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, animationDuration * 1000);
    return () => clearTimeout(timer);
  }, [id, animationDuration, onRemove]);

  return <div className="shooting-star" style={style} aria-hidden="true" />;
};


const ShootingStar = memo(ShootingStarComponent);
export default ShootingStar;
