import React from "react";

/**
 * DocsPage
 * ---------
 * Overhauled to match the Figma Documentation Mockup.
 * Features a structured layout with neo-card blocks and high-intensity tech badges.
 */

const TECHNIQUES = [
  {
    name: "HyperLogLog (HLL)",
    usedFor: "COUNT DISTINCT",
    description: "Probabilistic algorithm for estimating the number of distinct elements (cardinality) in a dataset using very little memory.",
    howItWorks: [
      "Hash each element to a binary string.",
      "Split hashes into buckets using first few bits.",
      "Track longest run of leading zeros per bucket.",
      "Use harmonic mean to estimate cardinality.",
    ],
    complexity: "O(1) insert, O(m) space (m=2^p)",
    errorRate: "~1.04 / √(2^p) (p=14, err ≈ 0.8%)",
    library: "datasketch (Python)",
    tradeoff: "Precision bits (4–16) map to accuracy slider (80–99%).",
  },
  {
    name: "Count-Min Sketch (CMS)",
    usedFor: "COUNT / Frequencies",
    description: "Space-efficient probabilistic structure for tracking frequency counts in a stream. Never underestimates.",
    howItWorks: [
      "Maintain 2D array (depth x width).",
      "Each row uses a different hash function.",
      "ADD: Hash item, increment respective cells.",
      "QUERY: Take MIN across all rows for item.",
    ],
    complexity: "O(d) operation, O(w×d) space",
    errorRate: "Overestimates by ≤ εN w.p. 1−δ",
    library: "Custom implementation (Python)",
    tradeoff: "Width derived from accuracy slider to minimize collisions.",
  },
  {
    name: "Reservoir Sampling",
    usedFor: "AVG, SUM, GROUP BY",
    description: "Maintains a fixed-size uniform random sample from a stream or large dataset in a single pass.",
    howItWorks: [
      "Fill reservoir with first k items.",
      "For item i > k: generate random j in [0, i).",
      "If j < k, replace reservoir[j] with new item.",
      "Reservoir always contains a uniform sample.",
    ],
    complexity: "O(1) per item, O(k) space",
    errorRate: "Unbiased estimate; variance ~ σ²/k",
    library: "Custom implementation (Python)",
    tradeoff: "k maps to slider (80% → 1% sample, 99% → 40%).",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-12 animate-in mt-6">
      <div className="text-center lg:text-left">
        <h1 className="section-title-neo">Documentation</h1>
        <p className="text-white/60 tracking-wider text-sm mt-3 font-sans">
          How the Approximate Query Engine works — techniques, trade-offs, and architecture.
        </p>
      </div>

      {/* Architecture Section */}
      <div className="neo-card p-10">
        <p className="neo-title mb-8">System Pipeline</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: 1, title: "Data Ingestion", desc: "Parquet/CSV → DuckDB" },
            { step: 2, title: "Exact Engine", desc: "DuckDB SQL Ground Truth" },
            { step: 3, title: "Approx Engine", desc: "HLL / CMS / Reservoir" },
            { step: 4, title: "Comparison", desc: "Error % & Speedup Math" },
            { step: 5, title: "Visualization", desc: "Recharts & Neo-UI" },
          ].map((item) => (
            <div key={item.step} className="bg-black/30 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-pixel text-neon-cyan mb-4">Step 0{item.step}</span>
              <div>
                <p className="font-header text-xs text-white mb-2 leading-tight">{item.title}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technique Breakdown */}
      <div className="space-y-8">
        {TECHNIQUES.map((tech) => (
          <div key={tech.name} className="neo-card p-10">
            <div className="flex items-center justify-between mb-8">
               <h2 className="neo-title text-neon-cyan">{tech.name}</h2>
               <span className="badge-neon-green">USED FOR: {tech.usedFor}</span>
            </div>
            
            <p className="text-sm text-white/60 mb-10 max-w-3xl leading-relaxed">
              {tech.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* How it works */}
              <div className="bg-[#5c2184]/40 rounded-[30px] p-8 border border-white/5">
                <p className="neo-label text-white/40 mb-5">HOW IT WORKS</p>
                <ul className="space-y-3 font-sans text-xs">
                  {tech.howItWorks.map((step, i) => (
                    <li key={i} className="flex gap-4 text-white/80">
                      <span className="text-neon-cyan font-bold leading-none">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="bg-black/40 rounded-[30px] p-8 border border-white/5 space-y-6">
                <p className="neo-label text-white/40">COMPLEXITY & STATS</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[8px] text-white/30 uppercase mb-1">Complexity</p>
                    <p className="font-mono text-[10px] text-neon-cyan">{tech.complexity}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/30 uppercase mb-1">Error Rate</p>
                    <p className="font-mono text-[10px] text-neon-pink">{tech.errorRate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[8px] text-white/30 uppercase mb-1">Trade-off</p>
                    <p className="text-[10px] text-white/60">{tech.tradeoff}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Footer Area */}
      <div className="neo-card p-10">
        <p className="neo-title mb-8 text-center">Engine Tech Stack</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "FastAPI", role: "Backend API", color: "border-emerald-500/30" },
            { name: "DuckDB", role: "Analytical SQL", color: "border-yellow-500/30" },
            { name: "Pandas", role: "Data Sampling", color: "border-blue-500/30" },
            { name: "datasketch", role: "HLL/MinHash", color: "border-purple-500/30" },
            { name: "React.js", role: "Frontend UI", color: "border-cyan-500/30" },
            { name: "Recharts", role: "Visualization", color: "border-pink-500/30" },
          ].map((item) => (
            <div key={item.name} className={`px-4 py-6 rounded-[25px] bg-black/40 border ${item.color} text-center transition-all hover:scale-105`}>
              <p className="font-geometric text-[10px] font-black text-white mb-1">{item.name}</p>
              <p className="text-[8px] text-white/30 uppercase tracking-widest">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
