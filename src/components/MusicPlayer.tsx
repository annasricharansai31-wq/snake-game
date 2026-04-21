import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(err => console.error("Playback failed", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-[400px] bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Top Section: Visualization/Art */}
      <div className="relative h-48 bg-slate-950 flex items-center justify-center group">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img 
            src={currentTrack.thumbnail} 
            alt="Art" 
            className="w-full h-full object-cover blur-xl scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Animated Visualization Bars */}
        <div className="flex items-end gap-1 h-20 z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? [20, 60, 30, 80, 20] : 10,
                transition: {
                    repeat: Infinity,
                    duration: 0.8 + Math.random() * 0.5,
                    delay: i * 0.05
                }
              }}
              className="w-1.5 bg-gradient-to-t from-cyan-500 to-fuchsia-500 rounded-full"
            />
          ))}
        </div>

        {/* Current Track Info Floating */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
             <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 min-w-0">
             <h3 className="text-white font-bold truncate text-sm uppercase tracking-tight">{currentTrack.title}</h3>
             <p className="text-cyan-400 text-xs font-mono truncate">{currentTrack.artist}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={handlePrev}
          className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <SkipBack size={24} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-95"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Playlist Preview */}
      <div className="px-6 pb-6 border-t border-slate-800/50 mt-2 pt-4">
        <div className="flex items-center gap-2 mb-3">
            <Music size={14} className="text-fuchsia-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Up Next</span>
        </div>
        <div className="space-y-2">
            {TRACKS.map((track, idx) => (
                <div 
                    key={track.id}
                    onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono ${idx === currentTrackIndex ? 'text-cyan-400' : 'text-slate-600'}`}>{String(idx + 1).padStart(2, '0')}</span>
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${idx === currentTrackIndex ? 'text-white' : 'text-slate-400'}`}>{track.title}</span>
                        </div>
                    </div>
                    {idx === currentTrackIndex && isPlaying && (
                        <div className="flex gap-0.5 items-end h-2">
                            <motion.div animate={{ height: [2, 8, 2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-cyan-400" />
                            <motion.div animate={{ height: [4, 2, 4] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-cyan-400" />
                            <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-cyan-400" />
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
