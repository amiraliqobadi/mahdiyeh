/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        deep: '#060d1b',
        ink: '#0a1628',
        navy: '#102340',
        'navy-soft': '#1a3560',
        azure: '#2f6beb',
        'azure-deep': '#1d4fc2',
        spark: '#6ee7f9',
        paper: '#f4f7fb',
        mist: '#e6ecf5',
        dusk: '#526583',
        fog: '#9db0cc',
      },
      boxShadow: {
        lift: '0 24px 48px -20px rgb(6 13 27 / 0.28)',
      }
    },
  },
  plugins: [],
}