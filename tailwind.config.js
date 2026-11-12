/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          dark: '#062F3C',      // Primary Dark
          navy: '#003B4A',      // Deep Navy
          blue: '#0077A8',      // Studio Blue
          accent: '#00A3D9',    // Accent Blue
          light: '#F7F8F8',     // Off White
          gray: '#E9EEF0',      // Light Gray
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 35px -5px rgba(0, 163, 217, 0.35)',
        'premium': '0 20px 40px -15px rgba(6, 47, 60, 0.15)',
        'card': '0 10px 30px -10px rgba(0, 59, 74, 0.1)',
        'inner-glow': 'inset 0 0 20px rgba(0, 163, 217, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        }
      }
    },
  },
  plugins: [],
}
