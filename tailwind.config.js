/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        // Brand palette — electric indigo→violet (modern, distinctive)
        brand: {
          50:  '#eef0ff',
          100: '#e0e2ff',
          200: '#c7c8ff',
          300: '#a5a3ff',
          400: '#8b83ff',
          500: '#6d5cf5',
          600: '#5a45e0',
          700: '#4a37c4',
          800: '#3d2f9e',
          900: '#332b7d',
          950: '#1f1a4d',
        },
        // Dark surface palette (var-driven; light theme redefines the ramp)
        surface: {
          950: 'rgb(var(--s-950) / <alpha-value>)',
          900: 'rgb(var(--s-900) / <alpha-value>)',
          850: 'rgb(var(--s-850) / <alpha-value>)',
          800: 'rgb(var(--s-800) / <alpha-value>)',
          750: 'rgb(var(--s-750) / <alpha-value>)',
          700: 'rgb(var(--s-700) / <alpha-value>)',
          600: 'rgb(var(--s-600) / <alpha-value>)',
          500: 'rgb(var(--s-500) / <alpha-value>)',
        },
        // Accent — used semantically (see per-track colors below)
        accent: {
          cyan:   '#22d3ee',
          green:  '#34d399',
          amber:  '#fbbf24',
          red:    '#fb7185',
          purple: '#a78bfa',
          violet: '#8b5cf6',
        },
        // Per-track signature colors — one hue per learning track for visual order
        track: {
          helpdesk:  '#22d3ee', // cyan
          sysadmin:  '#8b5cf6', // violet
          comptia:   '#34d399', // emerald
          scripting: '#fbbf24', // amber
        },
      },
      boxShadow: {
        'card':    '0 2px 20px rgba(0,0,0,0.35)',
        'card-lg': '0 12px 48px rgba(0,0,0,0.5)',
        'glow':    '0 0 32px rgba(109,92,245,0.4)',
        'glow-sm': '0 0 14px rgba(109,92,245,0.28)',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'aurora': '200% 200%',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'aurora':     'aurora 18s ease infinite',
        'shimmer-x':  'shimmerX 2.5s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmerX: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
