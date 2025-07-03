import React, { useState, useRef, useEffect } from 'react';

interface Song {
  title: string;
  src: string;
}

const songs: Song[] = [
  { title: "Nơi Này Có Anh", src: "/music/NoiNayCoAnh-SonTungMTP-4772041.mp3" },
  { title: "Mộc miên", src: "/music/MocMien-ChiXeTheFlob-36844127.mp3" },
  // Add more songs here if you have them
  // IMPORTANT: Playing directly from Google Drive can be unreliable due to CORS, cookies, or link changes by Google.
  // For best results, download these files and place them in your project's 'public/music' folder,
  // then update the 'src' paths to local paths (e.g., '/music/your-song.mp3').
];

const MusicPlayer: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && currentSongIndex !== null) {
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        // Attempt to play and catch any errors (e.g., browser restrictions)
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          // Optionally, set isPlaying to false if autoplay fails
          // setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSongIndex]); // Only re-run when currentSongIndex changes initially

  useEffect(() => {
    // Separate effect to handle play/pause state changes after a song is loaded
    if (audioRef.current && currentSongIndex !== null) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]); // React to isPlaying changes for an already selected song


  const selectSong = (index: number) => {
    if (currentSongIndex === index) {
      // If the same song is clicked, toggle play/pause
      togglePlayPause();
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true); // Auto-play when a new song is selected
    }
  };

  const togglePlayPause = () => {
    if (currentSongIndex === null && songs.length > 0) {
      // If no song is selected, play the first one
      setCurrentSongIndex(0);
      setIsPlaying(true);
    } else if (audioRef.current) {
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false); 
    // Optional: Implement play next song
    // if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
    //   setCurrentSongIndex(currentSongIndex + 1);
    //   setIsPlaying(true);
    // } else {
    //   // Optionally loop to the first song or stop
    //   setCurrentSongIndex(0); // Loop to first
    //   setIsPlaying(true);
    // }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0,0,0,0.75)',
      padding: '15px',
      borderRadius: '10px',
      color: 'white',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif',
      minWidth: '250px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #555', paddingBottom: '8px' }}>Music Player</h4>
      <div style={{ marginBottom: '12px', maxHeight: '150px', overflowY: 'auto' }}>
        {songs.map((song, index) => (
          <button
            key={song.src}
            onClick={() => selectSong(index)}
            title={`Play ${song.title}`}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '6px',
              backgroundColor: currentSongIndex === index && isPlaying ? '#28a745' : (currentSongIndex === index ? '#ffc107' : '#444'),
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.9em',
              transition: 'background-color 0.2s ease'
            }}
          >
            {song.title}
          </button>
        ))}
      </div>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <button
        onClick={togglePlayPause}
        style={{
          padding: '10px 15px',
          backgroundColor: isPlaying ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          minWidth: '90px',
          fontSize: '1em',
          fontWeight: 'bold'
        }}
      >
        {currentSongIndex === null ? 'Play' : (isPlaying ? 'Pause' : 'Play')}
      </button>
      {currentSongIndex !== null && (
        <p style={{ marginTop: '10px', marginBottom: 0, fontSize: '0.85em', color: '#eee' }}>
          Now Playing: {songs[currentSongIndex].title}
        </p>
      )}
    </div>
  );
};

export default MusicPlayer;
