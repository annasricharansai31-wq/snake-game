/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center bg-slate-950/50 backdrop-blur-md border-b border-white/5">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <span className="text-slate-950 font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic text-glow-cyan">
            Synth<span className="text-fuchsia-500 text-glow-fuchsia">Snake</span>
          </h1>
        </motion.div>

        <div className="flex items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
           <a href="#" className="hover:text-cyan-400 transition-colors">Arcade</a>
           <a href="#" className="hover:text-cyan-400 transition-colors">Tunes</a>
           <a href="#" className="hover:text-cyan-400 transition-colors">Leaderboard</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Game Area (Center-ish) */}
        <section className="lg:col-span-8 flex justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-[500px]"
          >
             <SnakeGame />
          </motion.div>
        </section>

        {/* Info & Music Area (Right side) */}
        <aside className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-4">
               <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">Soundtrack</h2>
               <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500/50 to-transparent" />
            </div>
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
               <Info size={18} />
               <h3 className="font-bold uppercase tracking-tight">How to Play</h3>
            </div>
            <ul className="space-y-3 text-slate-400 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="text-cyan-500 font-mono">01.</span>
                <span>Use <b>Arrow Keys</b> to control the synth-snake.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-mono">02.</span>
                <span>Eat the <b>Power Cores</b> (red dots) to grow and gain points.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-mono">03.</span>
                <span>Avoid the walls and your own tail. The pulse increases as you grow!</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Footer */}
          <div className="flex items-center justify-between px-2 opacity-50">
             <div className="flex gap-4">
                <Github size={18} className="cursor-pointer hover:text-white" />
                <Twitter size={18} className="cursor-pointer hover:text-white" />
             </div>
             <p className="text-[10px] uppercase font-mono tracking-widest underline decoration-fuchsia-500 underline-offset-4">V1.0.4-BETA</p>
          </div>
        </aside>
      </main>

      {/* Background Scrolling Text (Brutalist style) */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none h-32 flex items-center">
        <div className="whitespace-nowrap text-[120px] font-black uppercase italic tracking-tighter animate-[marquee_40s_linear_infinite]">
          NEON PULSE • SYNTH WAVE • ARCADE CLASSICS • VAPOR BREEZE • CYBER CHASE • 
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
