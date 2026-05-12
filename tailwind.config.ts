import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sloth: {
          fur: '#8B7355',
          light: '#A0896B',
          face: '#D2B48C',
        },
      },
      fontFamily: {
        display: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        toon: '3px 3px 0 0 rgba(58,47,42,0.9)',
      },
    },
  },
  plugins: [],
};

export default config;
