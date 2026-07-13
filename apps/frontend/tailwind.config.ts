import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#213D8F',
          hover: '#193072',
          light: '#EAEFFE',
        },
        accent: {
          yellow: '#FCD116',
          'yellow-hover': '#E2BA10',
          blue: '#E0F2FE',
        },
        bg: {
          white: '#ffffff',
          light: '#F8FAFC',
          grey: '#F1F5F9',
        },
        border: '#E2E8F0',
        text: {
          main: '#0F172A',
          muted: '#475569',
          light: '#94A3B8',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
