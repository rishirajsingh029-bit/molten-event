import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { runBenchmark, getDataInfo } from "../utils/api";

/**
 * BenchmarkChart
 * ---------------
 * Overhauled to match the Figma Benchmarks Mockup.
 * Features a high-intensity cyan "Run" button and deep purple neo-cards.
 */

export default function BenchmarkChart() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  const [numericCols, setNumericCols] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const info = await getDataInfo();
      if (info && info.columns) {
        const numCols = info.columns
          .filter(c => /INT|DOUBLE|FLOAT|DECIMAL|NUMERIC/.test(c.type.toUpperCase()))
          .map(c => c.name);
        setNumericCols(numCols);
        if (numCols.length > 0) setSelectedColumn(numCols[0]);
      }
    } catch (err) {
      console.error("Benchmark: Schema fetch failed", err);
    }
  };

  const handleRun = async () => {
    if (!selectedColumn) {
      setError("Please select a column to benchmark.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await runBenchmark({
        accuracy_levels: [0.80, 0.85, 0.90, 0.95, 0.99],
        query_types: ["count_distinct", "sum", "avg"],
        column: selectedColumn,
        iterations: 2,
      });
      setData(result.benchmarks);
    } catch (err) {
      setError(err.message || "Benchmark failed");
    } finally {
      setLoading(false);
    }
  };

  const getSpeedupData = () => {
    if (!data) return [];
    return data.map((item) => ({
      name: `${item.query_type} @ ${Math.round(item.accuracy_target * 100)}%`,
      speedup: item.avg_speedup,
      error_pct: item.avg_error_pct,
    }));
  };

  const getTradeoffData = () => {
    if (!data) return [];
    return data.map((item) => ({
      speedup: item.avg_speedup,
      error: item.avg_error_pct,
      label: `${item.query_type} @ ${Math.round(item.accuracy_target * 100)}%`,
    }));
  };

  const CHART_TOOLTIP = {
    contentStyle: {
      backgroundColor: "#0d0221",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      fontSize: "12px",
      fontFamily: 'Outfit'
    },
    labelStyle: { color: "#e2e8f0" },
  };

  return (
    <div className="space-y-10 animate-in mt-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-black/20 p-6 rounded-[30px] border border-white/5">
        <div className="text-center lg:text-left">
          <h2 className="section-title-neo">Benchmarks</h2>
          <p className="text-white/60 tracking-wider text-sm mt-3 font-sans max-w-xl">
             Speed vs accuracy trade-off analysis across different targets.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 w-full lg:w-auto">
          <div className="text-center lg:text-right">
            <p className="neo-label mb-2 text-white/30">Target Column</p>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan/50"
            >
              {numericCols.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRun}
            disabled={loading || !selectedColumn}
            className="px-10 py-4 bg-neon-cyan text-white font-black text-xs rounded-full uppercase tracking-widest shadow-[0_0_25px_rgba(0,245,212,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            {loading ? <span className="animate-pulse">Analyzing...</span> : "Run Benchmarks"}
          </button>
        </div>
      </div>

      {error && (
        <div className="neo-card p-6 border-neon-pink/20 bg-neon-pink/5">
          <p className="text-neon-pink font-bold text-sm tracking-widest uppercase">❌ {error}</p>
        </div>
      )}

      {!data && !loading && (
        <div className="neo-card p-24 text-center border-dashed border-white/10 opacity-60">
           <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center">
             <span className="text-4xl text-white/20">📈</span>
           </div>
           <p className="neo-title text-white/40 mb-3">No data generated yet</p>
           <p className="neo-label">Click "Run Benchmarks" to generate speed vs accuracy data </p>
           <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-2">Tests COUNT DISTINCT, SUM, AVG across 5 accuracy levels (80-99%)</p>
        </div>
      )}

      {data && (
        <div className="space-y-10">
          {/* Summary Table */}
          <div className="neo-card p-10 overflow-x-auto">
            <h3 className="neo-title mb-6">Aggregate Statistics</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left pb-4 neo-label">Query</th>
                  <th className="text-left pb-4 neo-label">Accuracy</th>
                  <th className="text-right pb-4 neo-label">Exact</th>
                  <th className="text-right pb-4 neo-label">Approx</th>
                  <th className="text-right pb-4 neo-label">Speedup</th>
                  <th className="text-right pb-4 neo-label text-neon-pink">Error %</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-4 text-white/70">{row.query_type}</td>
                    <td className="py-4 text-white/70">{Math.round(row.accuracy_target * 100)}%</td>
                    <td className="py-4 text-right text-white/50">{row.avg_exact_time_ms}ms</td>
                    <td className="py-4 text-right text-neon-cyan">{row.avg_approx_time_ms}ms</td>
                    <td className="py-4 text-right font-black text-white">{row.avg_speedup}x</td>
                    <td className="py-4 text-right text-neon-pink">{row.avg_error_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="neo-card p-10">
              <p className="neo-title mb-8 text-neon-pink">Speedup Multiplier</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getSpeedupData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="speedup" fill="#f15bb5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="neo-card p-10">
              <p className="neo-title mb-8 text-neon-cyan">Accuracy Trade-off</p>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="speedup" name="Speedup" unit="x" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis dataKey="error" name="Error" unit="%" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Scatter data={getTradeoffData()} fill="#00f5d4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
