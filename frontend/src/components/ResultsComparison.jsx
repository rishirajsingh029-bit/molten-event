import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import AlgorithmVisualizer from "./AlgorithmVisualizer";

/**
 * ResultsComparison
 * ------------------
 * Overhauled to match the Figma "Geometric Purple" Results cards.
 * Features neon labels and high-contrast data visualization.
 */

export default function ResultsComparison({ data }) {
  if (!data) return null;

  const { exact, approximate, comparison } = data;
  const isGroupBy = typeof exact.result === "object" && exact.result !== null;

  // Prepare chart data for GROUP BY results
  const chartData = isGroupBy
    ? Object.keys(exact.result).map((key) => ({
        name: key.length > 12 ? key.substring(0, 12) + "…" : key,
        fullName: key,
        Exact: exact.result[key],
        Approximate: approximate.result[key] || 0,
      }))
    : null;

  const formatMemory = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
    return bytes + " B";
  };

  const exactMemStr = formatMemory(comparison.exact_memory_bytes);
  const approxMemStr = formatMemory(comparison.approx_memory_bytes);
  const memReduction = comparison.exact_memory_bytes 
    ? (((comparison.exact_memory_bytes - comparison.approx_memory_bytes) / comparison.exact_memory_bytes) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-10 animate-in">
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Accuracy */}
        <div className="neo-card p-8 border-t-4 border-t-neon-cyan">
          <p className="neo-label mb-3">Accuracy</p>
          <p className="text-4xl font-geometric font-black text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]">
            {comparison.accuracy_pct}%
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">
            Error: {comparison.error_pct}%
          </p>
        </div>

        {/* Speedup */}
        <div className="neo-card p-8 border-t-4 border-t-neon-pink">
          <p className="neo-label mb-3">Speedup</p>
          <p className="text-4xl font-geometric font-black text-neon-pink drop-shadow-[0_0_8px_rgba(241,91,181,0.4)]">
            {comparison.speedup}×
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">
            Faster than DuckDB
          </p>
        </div>

        {/* Time Comparison */}
        <div className="neo-card p-8 border-t-4 border-t-white/20">
          <p className="neo-label mb-3">Memory Reduction</p>
          <p className="text-4xl font-geometric font-black text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
            {memReduction}%
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">
            RAM Footprint Saved
          </p>
        </div>

        {/* Techniques */}
        <div className="neo-card p-8 border-t-4 border-t-neon-magenta">
          <p className="neo-label mb-3">Technique</p>
          <p className="text-xl font-header font-black text-neon-magenta truncate">
            {approximate.technique}
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">
            Sample: {approximate.sample_size?.toLocaleString()} rows
          </p>
        </div>
      </div>

      {/* Main Comparison Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exact Section */}
        <div className="neo-card p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="neo-title">Exact Result</h3>
            <span className="badge-neon-green">DuckDB Engine</span>
          </div>
          <div className="py-10 border-y border-white/5">
            {isGroupBy ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {Object.entries(exact.result).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-3 px-5 rounded-2xl bg-black/30 border border-white/5">
                    <span className="neo-label text-white/40">{key}</span>
                    <span className="font-mono font-bold text-white text-lg">{val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-6xl font-geometric font-black text-white">
                  {typeof exact.result === "number" ? exact.result.toLocaleString() : exact.result}
                </p>
                <p className="neo-label mt-4">Calculated from 100% of data</p>
              </div>
            )}
          </div>
          <div className="flex justify-between neo-label">
            <span>Latency: {comparison.exact_time_ms}ms</span>
            <span>RAM: {exactMemStr}</span>
          </div>
        </div>

        {/* Approximate Section */}
        <div className="neo-card p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="neo-title text-neon-cyan">Approximate Result</h3>
            <span className="px-3 py-1 bg-neon-cyan text-black text-[10px] font-black rounded-full uppercase tracking-tighter">
              {approximate.technique}
            </span>
          </div>
          <div className="py-10 border-y border-white/5">
            {isGroupBy ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                {Object.entries(approximate.result).map(([key, val]) => {
                  const exactVal = exact.result[key] || 0;
                  const err = exactVal ? Math.abs(val - exactVal) / exactVal * 100 : 0;
                  return (
                    <div key={key} className="flex justify-between items-center py-3 px-5 rounded-2xl bg-black/30 border border-white/5">
                      <span className="neo-label text-neon-cyan/40">{key}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-neon-cyan text-lg">{val.toLocaleString()}</span>
                        <span className={`text-[10px] font-black ${err < 2 ? "text-green-400" : "text-neon-pink"}`}>
                          {err.toFixed(1)}% Error
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-6xl font-geometric font-black text-neon-cyan drop-shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                  {typeof approximate.result === "number" ? approximate.result.toLocaleString() : approximate.result}
                </p>
                <p className="neo-label mt-4 text-neon-cyan/60">Estimated via {approximate.technique}</p>
              </div>
            )}
          </div>
          <div className="flex justify-between neo-label">
            <span className="text-neon-cyan">Latency: {comparison.approx_time_ms}ms</span>
            <span className="text-neon-cyan">RAM: {approxMemStr}</span>
          </div>

          <AlgorithmVisualizer technique={approximate.technique} />
        </div>
      </div>

      {/* Visual Chart Area */}
      {isGroupBy && chartData && (
        <div className="neo-card p-10">
          <h3 className="neo-title mb-8">Side-by-Side Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: 'Orbitron' }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: 'Orbitron' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0221",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontFamily: 'Outfit'
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", marginTop: "20px", fontFamily: 'Silkscreen' }} />
              <Bar dataKey="Exact" fill="#ffffff" radius={[10, 10, 0, 0]} />
              <Bar dataKey="Approximate" fill="#00f5d4" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
