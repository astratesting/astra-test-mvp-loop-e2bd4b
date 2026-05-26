import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        mint: '#10b981',
        cream: '#fff7ed'
      },
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};

export default config;
