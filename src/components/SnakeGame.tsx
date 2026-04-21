import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('synth-snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  
  // Game state refs for performance in the game loop
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const directionRef = useRef<Direction>('RIGHT');
  const lastDirectionRef = useRef<Direction>('RIGHT');
  const speedRef = useRef(INITIAL_SPEED);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't land on snake
      const onSnake = snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    foodRef.current = generateFood(snakeRef.current);
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameState('PLAYING');
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
    if (timerRef.current) clearInterval(timerRef.current);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('synth-snake-highscore', score.toString());
    }
  };

  const moveSnake = useCallback(() => {
    const head = { ...snakeRef.current[0] };
    lastDirectionRef.current = directionRef.current;

    switch (directionRef.current) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return gameOver();
    }

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      return gameOver();
    }

    const newSnake = [head, ...snakeRef.current];

    // Check food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => prev + 10);
      foodRef.current = generateFood(newSnake);
      speedRef.current = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * SPEED_INCREMENT);
      
      // Update interval if speed changed
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(moveSnake, speedRef.current);
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [generateFood, score, highScore]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)'; // cyan-400 with low opacity
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2'; // cyan-400 : cyan-600
      
      // Glow effect for head
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#22d3ee';
      } else {
        ctx.shadowBlur = 0;
      }

      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Draw food
    ctx.fillStyle = '#f43f5e'; // rose-500
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f43f5e';
    const foodPadding = 4;
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * cellSize + cellSize / 2,
      foodRef.current.y * cellSize + cellSize / 2,
      (cellSize / 2) - foodPadding,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastDirectionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (lastDirectionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (lastDirectionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (lastDirectionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(moveSnake, speedRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, moveSnake]);

  // Handle resizing/initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] text-cyan-400">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold mb-1">Score</span>
          <span 
            className="text-5xl font-digital font-bold glitch tracking-tighter" 
            data-text={score}
          >
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold mb-1">High Score</span>
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            <span 
              className="text-5xl font-digital font-bold glitch tracking-tighter" 
              data-text={highScore}
            >
              {highScore}
            </span>
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* Neon Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-slate-900 rounded-lg border border-slate-700 shadow-2xl"
        />

        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-lg backdrop-blur-sm"
            >
              {gameState === 'IDLE' ? (
                <>
                  <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter uppercase italic">Ready?</h2>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  >
                    START GAME
                  </button>
                  <p className="mt-4 text-slate-400 text-xs uppercase tracking-[0.2em]">Use Arrow Keys to Move</p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-rose-500 mb-2 tracking-tighter uppercase italic">Game Over</h2>
                  <p className="text-white text-xl mb-8 font-mono">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(192,38,211,0.4)]"
                  >
                    <RefreshCcw size={20} />
                    TRY AGAIN
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SnakeGame;
