import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import ShootingStar from './ShootingStar';


const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

interface ShootingStarData {
  id: string;
  duration: number; // Duration in seconds
  style: React.CSSProperties & {
    '--star-start-x': string;
    '--star-start-y': string;
    '--star-end-x': string;
    '--star-end-y': string;
    '--star-angle': string;
    '--star-size': string;
    '--star-duration': string;
  };
}

const ShootingStarEffectComponent: React.FC = () => {
  const [stars, setStars] = useState<ShootingStarData[]>([]);
  const starIdCounter = useRef(0);

  const removeStar = useCallback((idToRemove: string) => {
    setStars(prevStars => prevStars.filter(star => star.id !== idToRemove));
  }, []);

  const launchStar = useCallback(() => {
    const id = `ss-${starIdCounter.current++}`;
    let startX: number, startY: number, angle: number;
    const starSize = Math.random() * 3 + 2; // Star size between 2px and 5px
    const duration = Math.random() * 2 + 3; // Duration between 3s and 5s

    // 0 for top-left, 1 for top-right
    const corner = Math.floor(Math.random() * 2);

    if (corner === 0) { // Top-left corner
      startX = 0 - starSize * 10; // Start further off-screen to the left
      startY = 0 - starSize * 10; // Start further off-screen at the top
      // Angle between 30 and 60 degrees (down and right)
      angle = Math.random() * 30 + 30;
    } else { // Top-right corner
      startX = window.innerWidth + starSize * 10; // Start further off-screen to the right
      startY = 0 - starSize * 10; // Start further off-screen at the top
      // Angle between 120 and 150 degrees (down and left)
      angle = Math.random() * 30 + 120;
    }

    const newStar: ShootingStarData = {
      id,
      duration, // Store the numeric duration
      style: {
        '--star-start-x': `${startX}px`,
        '--star-start-y': `${startY}px`,
        // Calculate end position far off screen based on angle to ensure it crosses the viewport
        '--star-end-x': `${startX + Math.cos(angle * Math.PI / 180) * (window.innerWidth * 1.8)}px`,
        '--star-end-y': `${startY + Math.sin(angle * Math.PI / 180) * (window.innerHeight * 1.8)}px`,
        '--star-angle': `${angle}deg`,
        '--star-size': `${starSize}px`,
        '--star-duration': `${duration}s`,
        // The actual div size, can be small as the trail is a pseudo-element or handled by CSS
        width: `${starSize}px`,
        height: `${starSize}px`,
        // Ensure position absolute is set for the star itself if not handled by a className
        position: 'absolute', 
        // Opacity and transform are handled by the CSS animation defined in index.html or ShootingStar.module.css
      } as React.CSSProperties & {
        '--star-start-x': string;
        '--star-start-y': string;
        '--star-end-x': string;
        '--star-end-y': string;
        '--star-angle': string;
        '--star-size': string;
        '--star-duration': string;
      },
    };

    setStars(prevStars => [...prevStars, newStar]);

    // Remove star after animation (duration + a little buffer for fade-out or cleanup)
    setTimeout(() => {
      removeStar(id);
    }, (duration + 0.5) * 1000);
  }, [removeStar]);

  const launchIntervalMin = 1500; // ms
  const launchIntervalMax = 3500; // ms

  useEffect(() => {
    let timeoutId: number;
    const scheduleLaunch = () => {
      launchStar();
      const nextLaunchDelay = getRandom(launchIntervalMin, launchIntervalMax);
      timeoutId = window.setTimeout(scheduleLaunch, nextLaunchDelay);
    };

    // Start the first launch after a short random delay
    const initialDelay = getRandom(500, 2000);
    timeoutId = window.setTimeout(scheduleLaunch, initialDelay);

    return () => window.clearTimeout(timeoutId); // Cleanup on unmount
  }, [launchStar]); // Relaunch if launchStar changes (it shouldn't due to useCallback)

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {stars.map(star => (
        <ShootingStar
          key={star.id}
          id={star.id}
          style={star.style}
          animationDuration={star.duration} // Pass the numeric duration
          onRemove={removeStar}
        />
      ))}
    </div>
  );
};


const ShootingStarEffect = memo(ShootingStarEffectComponent);
export default ShootingStarEffect;
