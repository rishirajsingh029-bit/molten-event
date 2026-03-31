import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Navbar
 * ------
 * Overhauled to match the minimalist Figma top-bar.
 * Features centered navigation with neon-cyan active states.
 */

const NAV_ITEMS = [
  { to: "/analysis", label: "Query Engine" },
  { to: "/benchmarks", label: "Benchmarks" },
  { to: "/streaming", label: "Live Stream" },
  { to: "/docs", label: "Docs" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Centered Navigation Items */}
        <div className="flex items-center gap-8 md:gap-14">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? "text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]"
                    : "text-white/60 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
