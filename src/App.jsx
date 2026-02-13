import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Music, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

// Component for the trailing hearts effect
const HeartTrail = () => {
  const [trails, setTrails] = useState([]);

  const addTrail = (e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    if (!x || !y) return;

    const newTrail = { id: Math.random(), x, y };
    setTrails((prev) => [...prev.slice(-15), newTrail]);

    setTimeout(() => {
      setTrails((prev) => prev.filter((t) => t.id !== newTrail.id));
    }, 600);
  };

  useEffect(() => {
    window.addEventListener('mousemove', addTrail);
    window.addEventListener('touchmove', addTrail, { passive: true });
    return () => {
      window.removeEventListener('mousemove', addTrail);
      window.removeEventListener('touchmove', addTrail);
    };
  }, []);

  return (
    <div className="trail-container">
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 1, scale: 0.5, x: trail.x - 10, y: trail.y - 10 }}
            animate={{ opacity: 0, scale: 1.2, y: trail.y - 60 }}
            exit={{ opacity: 0 }}
            className="trail-heart"
          >
            <Heart size={16} fill="#ff4d6d" color="#ff4d6d" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [page, setPage] = useState('start'); 
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleYes = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
    });
    setPage('success');
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const moveNoButton = () => {
    const padding = 50;
    const maxWidth = (window.innerWidth / 2) - padding;
    const maxHeight = (window.innerHeight / 2) - padding;
    const randomX = Math.random() * (maxWidth * 2) - maxWidth;
    const randomY = Math.random() * (maxHeight * 2) - maxHeight;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  return (
    <div className="app-container">
      <HeartTrail />
      <audio ref={audioRef} src="/audio.mp3" loop />

      <AnimatePresence mode="wait">
        <motion.div 
          key={page}
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -10, 0] // Floating effect handled safely here
          }} 
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            default: { duration: 0.4 }
          }}
          className="glass-card"
        >
          {/* BALLOONS REMOVED FROM HERE */}

          {page === 'start' && (
            <div className="card-content clickable" onClick={() => setPage('menu')}>
              <Mail size={80} color="#ff4d6d" className="heart-beat" />
              <h1>You have a message</h1>
              <p>Tap to open</p>
            </div>
          )}

          {page === 'menu' && (
            <div className="card-content">
              <h2>For you...</h2>
              <div className="icon-grid">
                <div className={`icon-item ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
                  <Music className={isPlaying ? 'spin' : ''} />
                </div>
                <div className="icon-item" onClick={() => setPage('question')}>
                  <Heart className="heart-beat" fill="#ff4d6d" />
                </div>
              </div>
              <p>{isPlaying ? "Listening to our vibe..." : "Tap the icons"}</p>
            </div>
          )}

          {page === 'question' && (
            <div className="card-content">
              <button className="back-btn" onClick={() => setPage('menu')}><ArrowLeft size={20} /></button>
              <h1>Will you be my Valentine?</h1>
              <div className="actions">
                <button className="yes-btn" onClick={handleYes}>YES! ❤️</button>
                <motion.button 
                  className="no-btn"
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  No
                </motion.button>
              </div>
            </div>
          )}

          {page === 'success' && (
            <div className="card-content">
              <Heart size={100} fill="#ff4d6d" color="#ff4d6d" className="heart-beat" />
              <h1>Yay! ❤️</h1>
              <p>I'm the luckiest guy. See you soon!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;