import { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'; // icon library

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      background: 'rgba(255, 46, 46, 0.73)',
      padding: '0.5rem',
      borderRadius: '50%',
      cursor: 'pointer'
    }}>
      <audio ref={audioRef} src="/The Rising Dawn Bellows Like Thunder [TubeRipper.com].mp3" loop />
      <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white' }}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      
    </div>
  );
}
