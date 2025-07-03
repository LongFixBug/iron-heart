import React, { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import FireworkExplosion from './FireworkExplosion';


export interface FireworksEffectRef {
  launchFirework: (x: number, y: number) => void;
}

interface FireworkData {
  targetX: number;
  targetY: number;
  id: string;
  startX: number;
  startY: number;
}

const FireworksEffectComponent: React.ForwardRefRenderFunction<FireworksEffectRef, {}> = (_props, ref) => {
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);
  const fireworkIdCounter = useRef(0);
  

  const removeFirework = useCallback((idToRemove: string | number) => {
    setFireworks(prevFireworks => prevFireworks.filter(fw => fw.id !== idToRemove));
  }, []);

  const launchFireworkExternal = useCallback((targetClickX: number, targetClickY: number) => {
    const id = `fw-${fireworkIdCounter.current++}`;
        // Use provided x and y (y is typically screen bottom for fireworks)
    const launchX = targetClickX; // Rocket launches from below the click's X
    const launchY = window.innerHeight; // Rocket launches from the bottom of the screen

    const newFirework: FireworkData = { id, startX: launchX, startY: launchY, targetX: targetClickX, targetY: targetClickY };
    setFireworks(prevFireworks => [...prevFireworks, newFirework]);
  }, []); 

  useImperativeHandle(ref, () => ({
    launchFirework: launchFireworkExternal,
  }));

    // Automatic launching removed, now click-triggered via ref

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {fireworks.map(fw => (
        <FireworkExplosion
          key={fw.id}
          id={fw.id}
          startX={fw.startX}
          startY={fw.startY}
          targetX={fw.targetX}
          targetY={fw.targetY}
          onRemove={removeFirework}
        />
      ))}
    </div>
  );
};

const FireworksEffect = forwardRef(FireworksEffectComponent);
export default FireworksEffect;