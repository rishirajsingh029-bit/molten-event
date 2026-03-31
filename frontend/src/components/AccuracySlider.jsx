import React from "react";

/**
 * AccuracySlider
 * ---------------
 * Overhauled to match the Figma "Accuracy Target" sidebar.
 * Features a minimalist slider and big purple results blocks.
 */

export default function AccuracySlider({ value, onChange }) {
  const pct = Math.round(value * 100);

  // Status mapping
  const getStatus = () => {
    if (pct >= 95) return { label: "High Accuracy", bg: "bg-green-500" };
    if (pct >= 90) return { label: "Balanced", bg: "bg-blue-500" };
    if (pct >= 85) return { label: "Fast Mode", bg: "bg-yellow-500" };
    return { label: "Ultra Fast", bg: "bg-red-500" };
  };

  const status = getStatus();

  // Estimated speed improvement
  const speedEstimate = ((0.99 - value) / 0.19 * 15 + 2).toFixed(1);

  return (
    <div className="neo-card p-10 space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="neo-title text-base">
          Accuracy Target
        </h3>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-black ${status.bg} shadow-lg shadow-white/5`}>
          {status.label}
        </span>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <input
          type="range"
          min="80"
          max="99"
          value={pct}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                     bg-black/50 accent-white
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
        <div className="flex justify-between neo-label text-[8px]">
          <span>80%(Fastest)</span>
          <span>99%(Most Accurate)</span>
        </div>
      </div>

      {/* Big metric blocks from mockup */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl">
          <p className="text-3xl font-geometric font-bold text-white mb-2">{pct}%</p>
          <p className="neo-label text-[8px]">Accuracy</p>
        </div>
        <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl">
          <p className="text-3xl font-geometric font-bold text-white mb-2">~{speedEstimate}x</p>
          <p className="neo-label text-[8px]">Est. Speedup</p>
        </div>
      </div>
    </div>
  );
}
