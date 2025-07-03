import React, { useState, useRef, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
  src: string;
  artwork: string;
}

// =================================================================================
// == ✨✨ QUAN TRỌNG: HÃY KIỂM TRA KỸ ĐƯỜNG DẪN FILE NHẠC TẠI ĐÂY ✨✨ ==
// =================================================================================
// 1. Đảm bảo các file nhạc của bạn nằm trong thư mục: /public/music/
// 2. Đảm bảo tên file trong code (ví dụ: 'nevada.mp3') TRÙNG KHỚP 100% với tên file thật.
// 3. Đường dẫn trong code BẮT BUỘC phải bắt đầu bằng dấu gạch chéo '/'.
// =================================================================================
const playlist: Track[] = [
  {
    title: 'Noi Nay Co Anh',
    artist: 'Sơn tùng MTP',
    src: '/music/NoiNayCoAnh-SonTungMTP-4772041.mp3',       
    artwork: '/images/NoiNayCoAnh-SonTungMTP-4772041.webp', 
  },
  {
    title: 'Mộc miên',
    artist: 'Chi Xê',
    src: '/music/MocMien-ChiXeTheFlob-36844127.mp3',
    artwork: '/images/chixe2.jpg',
  },
];
// =================================================================================

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          const handleFirstInteraction = () => {
            const playAfterInteractionPromise = audio.play();
            if(playAfterInteractionPromise !== undefined) {
                playAfterInteractionPromise
                    .then(() => setIsPlaying(true))
                    .catch(err => {
                        console.error("Lỗi khi phát nhạc sau tương tác:", err);
                        alert("Không thể phát nhạc. Vui lòng kiểm tra lại đường dẫn file nhạc.");
                    });
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
          };
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('keydown', handleFirstInteraction);
        });
    }
  }, []);

  // ... (Toàn bộ phần code còn lại của component giữ nguyên)
  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const handlePlayPause = () => { if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play(); setIsPlaying(!isPlaying); };
  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => { const newVolume = Number(e.target.value); setVolume(newVolume); if(audioRef.current) audioRef.current.volume = newVolume; };
  useEffect(() => { if (isPlaying && audioRef.current) { audioRef.current.play().catch(e => console.error(e)); } }, [currentTrackIndex]);
  const formatTime = (time: number) => { const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; };
  const currentTrack = playlist[currentTrackIndex];
  return ( <div style={styles.playerContainer}> <audio ref={audioRef} src={currentTrack.src} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleNext} /> <div style={styles.artworkVolumeContainer}> <img src={currentTrack.artwork} alt="Artwork" style={isPlaying ? styles.artworkImagePlaying : styles.artworkImage} /> <div style={styles.volumeContainer}> <span style={{fontSize: '14px', marginBottom: '-90px'}}>🔊</span> <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={styles.volumeSlider} /> </div> </div> <div style={styles.controlsContainer}> <div style={styles.trackInfo}> <div style={styles.trackTitle}>{currentTrack.title}</div> <div style={styles.trackArtist}>{currentTrack.artist}</div> </div> <div style={styles.mainControls}> <button onClick={handlePrev} style={{...styles.controlButton, ...styles.sideButton}}>«</button> <button onClick={handlePlayPause} style={{...styles.controlButton, ...styles.playButton}}> {isPlaying ? '❚❚' : '►'} </button> <button onClick={handleNext} style={{...styles.controlButton, ...styles.sideButton}}>»</button> </div> <div style={styles.progressContainer}> <span style={styles.timeText}>{formatTime(currentTime)}</span> <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} style={styles.progressBar} /> <span style={styles.timeText}>{formatTime(duration)}</span> </div> </div> </div> );
};

const styles: { [key: string]: React.CSSProperties } = { playerContainer: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '480px', display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', borderRadius: '15px', backgroundColor: 'rgba(25, 25, 25, 0.9)', backdropFilter: 'blur(10px)', color: '#fff', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 9999, }, artworkVolumeContainer: { display: 'flex', alignItems: 'center', gap: '15px' }, artworkImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.1)' }, artworkImagePlaying: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1DB954', animation: 'spin 8s linear infinite' }, volumeContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80px' }, volumeSlider: { appearance: 'none', width: '70px', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '5px', transform: 'rotate(-90deg)', cursor: 'pointer' }, controlsContainer: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: 'calc(100% - 160px)' }, trackInfo: { textAlign: 'center', marginBottom: '5px' }, trackTitle: { fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, trackArtist: { fontSize: '12px', color: '#aaa' }, mainControls: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }, controlButton: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }, playButton: { fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1DB954', borderRadius: '50%' }, sideButton: { color: '#ccc' }, progressContainer: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }, timeText: { fontSize: '11px', color: '#aaa' }, progressBar: { flexGrow: 1, appearance: 'none', width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '5px', outline: 'none', cursor: 'pointer' }, };
const styleSheet = document.createElement("style"); styleSheet.type = "text/css"; styleSheet.innerText = ` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: #fff; border-radius: 50%; cursor: pointer; border: 2px solid #333; } input[type="range"]::-moz-range-thumb { width: 14px; height: 14px; background: #fff; border-radius: 50%; cursor: pointer; border: 2px solid #333; } `; document.head.appendChild(styleSheet);
export default MusicPlayer;