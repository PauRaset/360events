import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fons
        base: '#05070F',
        'base-2': '#080B16',
        panel: '#0C1122',
        // Blaus
        electric: '#1E7BFF',
        'electric-bright': '#3D93FF',
        'electric-deep': '#0A2A66',
        // Neutres
        silver: '#C8D2E0',
        platinum: '#E9EEF7',
        'text-gray': '#8590A6',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-caveat)', 'cursive'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(30, 123, 255, 0.45)',
        'glow-lg': '0 0 60px rgba(30, 123, 255, 0.35)',
        'glow-soft': '0 0 40px rgba(61, 147, 255, 0.18)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(30,123,255,0.18), transparent 60%)',
        'grid-faint':
          'linear-gradient(rgba(200,210,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,210,224,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        equalize: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        equalize: 'equalize 1.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
