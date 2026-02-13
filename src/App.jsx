import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Music, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

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
      audioRef.current.play().catch(e => console.log("Audio play blocked until interaction"));
    }
    setIsPlaying(!isPlaying);
  };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 4);
    const y = Math.random() * (window.innerHeight - 200) - (window.innerHeight / 4);
    setNoButtonPos({ x, y });
  };

  return (
    <div className="app-container">
      <audio ref={audioRef} src="/audio.mp3" loop />

      <AnimatePresence mode="wait">
        
        {/* PAGE 1: START */}
        {page === 'start' && (
          <motion.div 
            key="start"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="glass-card clickable"
            onClick={() => setPage('menu')}
          >
            <Mail size={80} color="#ff4d6d" />
            <h1>You have a message</h1>
            <p>Click to open</p>
          </motion.div>
        )}

        {/* PAGE 2: MENU */}
        {page === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card"
          >
            <h2>For you...</h2>
            <div className="icon-grid">
              <div 
                className={`icon-item ${isPlaying ? 'playing' : ''}`} 
                onClick={toggleMusic}
              >
                <Music className={isPlaying ? 'spin' : ''} />
              </div>
              
              <div className="icon-item" onClick={() => setPage('question')}>
                <Heart className="heart-beat" fill="#ff4d6d" />
              </div>
            </div>
            <p>{isPlaying ? "Listening to our vibe..." : "Tap the icons"}</p>
          </motion.div>
        )}

        {/* PAGE 3: QUESTION */}
        {page === 'question' && (
          <motion.div 
            key="question"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card"
          >
            {/* Back Button */}
            <button className="back-btn" onClick={() => setPage('menu')}>
              <ArrowLeft size={20} />
            </button>

            <h1>Will you be my Valentine?</h1>
            <div className="actions">
              <button className="yes-btn" onClick={handleYes}>YES! ❤️</button>
              
              <motion.button 
                className="no-btn"
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                onMouseEnter={moveNoButton}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PAGE 4: SUCCESS */}
        {page === 'success' && (
          <motion.div 
            key="success"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
          >
            <Heart size={100} fill="#ff4d6d" color="#ff4d6d" className="heart-beat" />
            <h1>See you on the 14th!</h1>
            <p>I'm the luckiest guy. ❤️</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;