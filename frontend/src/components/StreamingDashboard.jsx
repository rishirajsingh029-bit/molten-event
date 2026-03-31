import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { createStreamSocket } from "../utils/api";

/**
 * StreamingDashboard
 * -------------------
 * Overhauled to match the Figma "Live Stream" Mockup.
 * Features neon-cyan/pink control buttons and huge purple metric blocks.
 */

export default function StreamingDashboard() {
  const [connected, setConnected] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) wsRef.current.close();
    const ws = createStreamSocket(
      (data) => {
        setSnapshot(data);
        setConnected(true);
        setHistory((prev) => {
          const next = [...prev, {
            time: new Date().toLocaleTimeString(),
            transactions: data.total_transactions,
            unique_users: data.unique_users,
            avg_amount: data.running_avg_amount,
            tps: data.transactions_per_second,
          }];
          return next.slice(-20);
        });
      },
      () => setConnected(false)
    );
    ws.onclose = () => setConnected(false);
    wsRef.current = ws;
  };

  const disconnect = () => {
    if (wsRef.current) wsRef.current.close();
    setConnected(false);
  };

  useEffect(() => {
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

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

  const categoryData = snapshot?.category_distribution
    ? Object.entries(snapshot.category_distribution)
        .map(([name, count]) => ({
          name: name.length > 10 ? name.substring(0, 10) + "…" : name,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-10 animate-in mt-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-black/20 p-6 rounded-[30px] border border-white/5">
        <div className="text-center lg:text-left">
          <h2 className="section-title-neo">Live Streaming Analytics</h2>
          <p className="text-white/60 tracking-wider text-sm mt-3 font-sans max-w-xl">
            Real time approximate aggregates on streaming data using HyperLogLog & Count-Min Sketch.
          </p>
        </div>
        
        <div className="flex items-center justify-center lg:justify-end gap-6">
          {connected && (
            <div className="flex items-center gap-3">
              <span className="badge-neon-green">LIVE</span>
            </div>
          )}
          {!connected ? (
            <button 
              onClick={connect} 
              className="px-10 py-4 bg-neon-cyan text-white font-black text-xs rounded-full uppercase tracking-widest shadow-[0_0_25px_rgba(0,245,212,0.4)] hover:scale-105 transition-all"
            >
              Start Stream
            </button>
          ) : (
            <button 
              onClick={disconnect} 
              className="px-10 py-4 bg-neon-pink text-white font-black text-xs rounded-full uppercase tracking-widest shadow-[0_0_25px_rgba(241,91,181,0.4)] hover:scale-105 transition-all"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {!snapshot && (
        <div className="neo-card p-24 text-center border-dashed border-white/10 opacity-60">
           <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center">
             <span className="text-4xl">📡</span>
           </div>
           <p className="neo-title text-white/40 mb-3">Disconnected</p>
           <p className="neo-label">Click "Start Stream" to begin receiving live transactional data</p>
        </div>
      )}

      {snapshot && (
        <>
          {/* Live Stats Blocks from Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl animate-in">
              <p className="neo-label mb-3">Total Transactions</p>
              <p className="text-4xl font-geometric font-black text-white mb-2">
                {snapshot.total_transactions?.toLocaleString()}
              </p>
              <p className="text-[9px] text-white/30 tracking-widest uppercase">Exact Count</p>
            </div>

            <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl animate-in delay-100">
              <p className="neo-label mb-3 text-neon-cyan">Unique Users</p>
              <p className="text-4xl font-geometric font-black text-neon-cyan mb-2">
                {snapshot.unique_users?.toLocaleString()}
              </p>
              <p className="text-[9px] text-neon-cyan/40 tracking-widest uppercase">≈HyperLogLog estimate</p>
            </div>

            <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl animate-in delay-200">
              <p className="neo-label mb-3 text-neon-pink">Avg Amount</p>
              <p className="text-4xl font-geometric font-black text-neon-pink mb-2">
                ${snapshot.running_avg_amount}
              </p>
              <p className="text-[9px] text-neon-pink/40 tracking-widest uppercase">Running Mean</p>
            </div>

            <div className="bg-[#5c2184]/40 rounded-[30px] p-8 text-center border border-white/5 shadow-xl animate-in delay-300">
              <p className="neo-label mb-3 text-neon-magenta">Throughput</p>
              <p className="text-4xl font-geometric font-black text-neon-magenta mb-2">
                {snapshot.transactions_per_second}
              </p>
              <p className="text-[9px] text-neon-magenta/40 tracking-widest uppercase">txn/second</p>
            </div>
          </div>

          {/* Real-time Visualization Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="neo-card p-10">
              <p className="neo-title mb-8">Transaction Volume</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Line
                    type="step"
                    dataKey="transactions"
                    stroke="#ffffff"
                    strokeWidth={3}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="neo-card p-10">
              <p className="neo-title mb-8 text-neon-cyan">Cardinality (HLL)</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Line
                    type="monotone"
                    dataKey="unique_users"
                    stroke="#00f5d4"
                    strokeWidth={3}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="neo-card p-10">
              <p className="neo-title mb-8 text-neon-pink">Value Drift</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} domain={['auto', 'auto']} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Line
                    type="monotone"
                    dataKey="avg_amount"
                    stroke="#f15bb5"
                    strokeWidth={3}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="neo-card p-10">
              <p className="neo-title mb-8 text-neon-magenta">Frequencies (CMS)</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, fontFamily: 'Orbitron' }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: 'Orbitron' }} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Bar dataKey="count" fill="#9b5de5" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
