import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroLanding from "./components/HeroLanding";
import QueryBuilder from "./components/QueryBuilder";
import BenchmarkChart from "./components/BenchmarkChart";
import StreamingDashboard from "./components/StreamingDashboard";
import DocsPage from "./components/DocsPage";

/**
 * AppContent
 * ----------
 * Separate component to use hooks like useNavigate/useLocation.
 */
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Force redirect to landing page on refresh/initial load
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, []); // Run once on mount

  return (
    <Routes>
      <Route path="/" element={<HeroLanding />} />
      <Route path="/analysis" element={<QueryBuilder />} />
      <Route path="/benchmarks" element={<BenchmarkChart />} />
      <Route path="/streaming" element={<StreamingDashboard />} />
      <Route path="/docs" element={<DocsPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-white selection:bg-neon-cyan selection:text-black">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
          <AppContent />
        </main>

        {/* Clean Minimalist Footer */}
        <footer className="relative z-10 mt-24 py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-header text-[10px] tracking-[0.2em] uppercase text-white/40">
                Dino Data Platform
              </p>
              <p className="text-[10px] tracking-widest uppercase text-white/20 mt-1">
                FastAPI • DuckDB • React • Neo-Architecture
              </p>
            </div>
            
            <div className="flex gap-8">
               <span className="text-[8px] font-pixel text-neon-cyan/40">v2.0.4 - LIVE</span>
               <span className="text-[8px] font-pixel text-neon-pink/40">SECURED</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
