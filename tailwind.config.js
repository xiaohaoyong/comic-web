/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        surface: {
          50: '#1a1a2e',
          100: '#16162a',
          200: '#121226',
          300: '#0f0f1a',
          400: '#0a0a12',
        },
        accent: {
          primary: '#7c3aed',
          secondary: '#ec4899',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
        neon: {
          purple: '#a855f7',
          pink: '#f472b6',
          blue: '#3b82f6',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-neon': 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f472b6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
        'gradient-border': 'linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5))',
        'gradient-progress': 'linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)',
        'gradient-vip': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)' },
        },
      },
      boxShadow: {
        'card': '0 20px 40px -15px rgba(168, 85, 247, 0.3), 0 0 30px -10px rgba(236, 72, 153, 0.2)',
        'vip': '0 0 15px rgba(245, 158, 11, 0.4)',
      },
    }
  },
  plugins: []
}
