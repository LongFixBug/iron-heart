import React, { useState, useRef, useEffect } from 'react';

// Định nghĩa cấu trúc cho một bài hát
interface Track {
  title: string;
  artist: string;
  src: string;
  artwork: string; // Đường dẫn đến ảnh bìa
}

// ==========================================================================
// == ✨ QUAN TRỌNG: HÃY THAY THẾ DANH SÁCH NHẠC CỦA BẠN VÀO ĐÂY ✨ ==
// ==========================================================================
// Gợi ý: Đặt file nhạc và ảnh trong thư mục /public của dự án
const playlist: Track[] = [
  {
    title: 'Noi Nay Co Anh',
    artist: 'Sơn tùng MTP',
    src: '/music/NoiNayCoAnh-SonTungMTP-4772041.mp3',       // Ví dụ: /public/music/nevada.mp3
    artwork: '/images/NoiNayCoAnh-SonTungMTP-4772041.webp', // Ví dụ: /public/images/nevada.jpg
  },
  {
    title: 'Mộc miên',
    artist: 'Chi Xê',
    src: '/music/MocMien-ChiXeTheFlob-36844127.mp3',
    artwork: '/images/chixe2.jpg',
  },
];
// ==========================================================================

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.2);

  const audioRef = useRef<HTMLAudioElement>(null);

  // === XỬ LÝ TỰ ĐỘNG PHÁT ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
// ✨✨ DÒNG MÃ THÊM VÀO ĐỂ SỬA LỖI ÂM LƯỢNG ✨✨
    audio.volume = volume; 
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log("Autoplay bị chặn, chờ người dùng tương tác.");
          const handleFirstInteraction = () => {
            audio.play().then(() => setIsPlaying(true));
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
          };
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('keydown', handleFirstInteraction);
        });
    }
  }, []);

  // Cập nhật thời gian thực và thanh tiến trình
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // === CÁC HÀM ĐIỀU KHIỂN ===
  const handlePlayPause = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };
  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if(audioRef.current) audioRef.current.volume = newVolume;
  };
  
  // Khi đổi bài, tự động phát nếu đang phát
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error(e));
    }
  }, [currentTrackIndex]);

  // === CÁC HÀM TIỆN ÍCH ===
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div style={styles.playerContainer}>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* === CỤM ẢNH VÀ ÂM LƯỢNG === */}
      <div style={styles.artworkVolumeContainer}>
        <img src={currentTrack.artwork} alt="Artwork" style={isPlaying ? styles.artworkImagePlaying : styles.artworkImage} />
        <div style={styles.volumeContainer}>
            <span style={{fontSize: '12px', marginBottom: '-80px'}}>🔊</span>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                style={styles.volumeSlider}
            />
        </div>
      </div>
      
      {/* === CỤM ĐIỀU KHIỂN CHÍNH === */}
      <div style={styles.controlsContainer}>
        <div style={styles.trackInfo}>
          <div style={styles.trackTitle}>{currentTrack.title}</div>
          <div style={styles.trackArtist}>{currentTrack.artist}</div>
        </div>
        <div style={styles.mainControls}>
          <button onClick={handlePrev} style={{...styles.controlButton, ...styles.sideButton}}>«</button>
          <button onClick={handlePlayPause} style={{...styles.controlButton, ...styles.playButton}}>
            {isPlaying ? '❚❚' : '►'}
          </button>
          <button onClick={handleNext} style={{...styles.controlButton, ...styles.sideButton}}>»</button>
        </div>
        <div style={styles.progressContainer}>
          <span style={styles.timeText}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            style={styles.progressBar}
          />
          <span style={styles.timeText}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};


// ==========================================================================
// == ✨ CSS STYLES CHO GIAO DIỆN NGHE NHẠC ✨ ==
// ==========================================================================
const styles: { [key: string]: React.CSSProperties } = {
  playerContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '480px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '15px',
    borderRadius: '15px',
    backgroundColor: 'rgba(25, 25, 25, 0.9)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 9999,
  },
  // Nhóm ảnh và âm lượng
  artworkVolumeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  // Ảnh nghệ sĩ hình tròn
  artworkImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%', // << THAY ĐỔI: Chuyển thành hình tròn
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  artworkImagePlaying: {
    width: '80px',
    height: '80px',
    borderRadius: '50%', // << THAY ĐỔI: Chuyển thành hình tròn
    objectFit: 'cover',
    border: '2px solid #1DB954',
    animation: 'spin 8s linear infinite',
  },
  // Thanh âm lượng dọc
  volumeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
  },
  volumeSlider: {
    appearance: 'none',
    width: '70px', // Chiều dài của thanh trượt
    height: '5px',  // Độ dày của thanh
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    transform: 'rotate(-90deg)', // << THAY ĐỔI: Xoay thanh trượt thành chiều dọc
    cursor: 'pointer',
  },
  // Các phần còn lại
  controlsContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5px',
    width: 'calc(100% - 160px)',
  },
  trackInfo: { textAlign: 'center', marginBottom: '5px' },
  trackTitle: { fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  trackArtist: { fontSize: '12px', color: '#aaa' },
  mainControls: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' },
  controlButton: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' },
  playButton: { fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1DB954', borderRadius: '50%' },
  sideButton: { color: '#ccc' },
  progressContainer: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
  timeText: { fontSize: '11px', color: '#aaa' },
  progressBar: { flexGrow: 1, appearance: 'none', width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '5px', outline: 'none', cursor: 'pointer' },
};

// Thêm keyframes cho animation quay đĩa và style cho thumb của thanh trượt
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #333;
}
input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #333;
}
`;
document.head.appendChild(styleSheet);


export default MusicPlayer;