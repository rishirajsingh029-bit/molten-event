import React, { useEffect, useState } from 'react';

/**
 * AlgorithmVisualizer
 * ------------------
 * Overhauled to match the Neo-Purple aesthetic.
 * Simulates real-time probabilistic data structure operations.
 */

export default function AlgorithmVisualizer({ technique }) {
  const [activeNodes, setActiveNodes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (technique.includes("HyperLogLog")) {
        setActiveNodes(Array.from({ length: 16 }).map(() => Math.random() > 0.7));
      } else if (technique.includes("Reservoir")) {
        setActiveNodes(Array.from({ length: 48 }).map(() => Math.random() > 0.9));
      } else if (technique.includes("CMS") || technique.includes("proportion")) {
        setActiveNodes(Array.from({ length: 24 }).map(() => Math.random() > 0.85));
      }
    }, 150);

    return () => clearInterval(interval);
  }, [technique]);

  const renderVisual = () => {
    if (technique.includes("HyperLogLog")) {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-[8px] text-neon-cyan font-mono mb-1 uppercase tracking-tighter">h(x) = 010110...</div>
          <div className="flex flex-wrap gap-1">
            {activeNodes.map((isActive, i) => (
              <div 
                key={i} 
                className={`w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-mono transition-all duration-150 border ${
                  isActive 
                    ? 'bg-neon-cyan text-black border-white shadow-[0_0_15px_rgba(0,245,212,0.6)] scale-110' 
                    : 'bg-black/40 text-white/20 border-white/5'
                }`}
              >
                {isActive ? '0' : '1'}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (technique.includes("Reservoir")) {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-[8px] text-neon-pink font-mono mb-1 uppercase tracking-tighter">P(replace) = k/i</div>
          <div className="grid grid-cols-12 gap-1.5">
            {activeNodes.map((isActive, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                  isActive 
                    ? 'bg-neon-pink scale-125 shadow-[0_0_10px_rgba(241,91,181,0.6)]' 
                    : 'bg-white/5 border border-white/5'
                }`}
              />
            ))}
          </div>
        </div>
      );
    }

    // Default: CMS
    return (
      <div className="flex flex-col gap-2">
        <div className="text-[8px] text-neon-magenta font-mono mb-1 uppercase tracking-tighter">min(h₁(x), h₂(x), h₃(x))</div>
        <div className="grid grid-rows-3 gap-1.5">
          {[0, 1, 2].map(row => (
            <div key={row} className="flex gap-1.5">
              {activeNodes.slice(row * 8, row * 8 + 8).map((isActive, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-md transition-all duration-150 border ${
                    isActive 
                      ? 'bg-neon-magenta border-white shadow-[0_0_10px_rgba(155,93,229,0.5)]' 
                      : 'bg-black/40 border-white/5'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-black/40 rounded-[30px] border border-white/5 mt-6 flex items-center justify-between shadow-inner">
      <div className="flex-1">
        <h4 className="neo-label text-[8px] mb-4 text-white/40">Computation Matrix</h4>
        <div className="pr-4">
          {renderVisual()}
        </div>
      </div>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/60 border border-white/10 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] animate-[pulse_2s_infinite]" />
        <span className="text-xl relative z-10 opacity-60">⚙️</span>
      </div>
    </div>
  );
}
