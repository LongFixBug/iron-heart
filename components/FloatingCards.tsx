import React, { useEffect } from 'react';
import Heart3D from './Heart3D';
import MiniHeartsSwarm from './MiniHeartsSwarm';

const cardImages = [
  '/images/card1.jpeg',
  '/images/card2.jpeg',
  '/images/card3.jpeg',
  '/images/card4.jpeg',
  '/images/card5.jpeg',
  '/images/card6.jpeg',
];

const ANIMATION_DURATION = 15;

const FloatingCards = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.centralElementContainer}>
        <Heart3D />
        <MiniHeartsSwarm count={20} />
      </div>

      {cardImages.map((imgSrc, index) => (
        <div 
          key={index} 
          style={{
            ...styles.card,
            animationDelay: `-${(ANIMATION_DURATION / cardImages.length) * index}s`
          }}
        >
          <img src={imgSrc} alt={`Card ${index + 1}`} style={styles.cardImage} />
        </div>
      ))}
    </div>
  );
};

// =======================================================================
// == ✨ CSS & ANIMATION ĐÃ ĐƯỢC CẬP NHẬT ✨ ==
// =======================================================================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '500px',
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralElementContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80px',
    height: '100px',
    position: 'absolute',
    borderRadius: '10px',
    background: '#fff',
    top: 'calc(50% - 50px)',
    left: 'calc(50% - 40px)',
    animation: `orbit ${ANIMATION_DURATION}s linear infinite`,
    
    // ✨ SỬA LỖI: Chuyển hiệu ứng phát sáng neon ra đây
    // Kết hợp cả bóng đổ thông thường và hiệu ứng neon
    boxShadow: `
      0 4px 8px rgba(0, 0, 0, 0.2), /* Bóng đổ thông thường */
      0 0 8px 2px rgba(0, 255, 255, 0.6), /* Lớp neon màu Cyan */
      0 0 15px 4px rgba(255, 0, 255, 0.5), /* Lớp neon màu Magenta */
      0 0 25px 6px rgba(0, 255, 0, 0.4) /* Lớp neon màu Green */
    `,
    
    // ✨ SỬA LỖI: Xóa 'overflow: hidden' để không cắt mất viền sáng
    // overflow: 'hidden', 
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    // Giữ bo góc để ảnh khớp với card
    borderRadius: '10px',
  },
};

const keyframes = `
  @keyframes orbit {
    from {
      transform: rotateY(0deg) translateX(240px) rotateY(0deg);
    }
    to {
      transform: rotateY(360deg) translateX(240px) rotateY(-360deg);
    }
  }
`;

export default FloatingCards;