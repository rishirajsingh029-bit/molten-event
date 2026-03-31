/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Flattened for maximum compatibility with existing code and @apply
        'dino-purple-dark': '#0d0221',
        'dino-purple-mid': '#2d005a',
        'dino-purple-light': '#3c006d',
        'neon-cyan': '#00f5d4',
        'neon-pink': '#f15bb5',
        'neon-magenta': '#9b5de5',
        primary: {
          500: '#8338ec',
          600: '#3a86ff',
        },
        surface: {
          900: '#0a001a',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        header: ['Silkscreen', 'cursive'],
        geometric: ['Orbitron', 'sans-serif'],
        pixel: ['Press Start 2P', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
