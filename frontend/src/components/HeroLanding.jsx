import React from "react";
import { useNavigate } from "react-router-dom";
import GradientShader from "./GradientShader";

/**
 * HeroLanding
 * -----------
 * The entry point for Dino Data. 
 * Featuring a high-intensity WebGL gradient shader (Figma-inspired).
 */
export default function HeroLanding() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center min-h-[92vh] py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden bg-black">
      
      {/* 🚀 WebGL Shader Background (Manual integration from Figma) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <GradientShader 
          speed={0.8} 
          lineCount={14} 
          amplitude={0.25} 
          yOffset={0.05} 
        />
        {/* Vignette effect to draw focus to center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        
        {/* Title Group */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 
            className="text-6xl md:text-8xl font-normal tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            DINO DATA
          </h1>
          <p className="max-w-2xl mx-auto text-[10px] md:text-sm tracking-[0.3em] text-purple-200/80 uppercase font-sans font-medium">
            Next Generation Approximate Query Processing
          </p>
        </div>

        {/* Action Button */}
        <div className="animate-in fade-in duration-1000 delay-300">
          <button
            onClick={() => navigate("/analysis")}
            className="group relative px-12 py-4 text-xs md:text-sm tracking-[0.4em] font-black text-white uppercase bg-white/5 hover:bg-white/10 rounded-full border border-white/20 transition-all duration-500 hover:scale-110 hover:border-primary-400 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] backdrop-blur-sm"
          >
            <span className="relative z-10">Let's Start</span>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          </button>
        </div>

        {/* Subtitle / Description */}
        <div className="max-w-xl animate-in fade-in duration-1000 delay-500">
          <p className="text-[9px] md:text-xs text-white/40 uppercase font-sans leading-relaxed tracking-widest">
            Save your time, use Dino Data. Experience sub-millisecond analytical insights on datasets of any scale.
          </p>
        </div>

      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
}
