/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'hammersmith': ['var(--font-hammersmith)', 'serif'],
        'gill-sans': ['var(--font-gill-sans)', 'sans-serif'],
      },
      colors: {
        // EXACT mobile app colors
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          light: '#60A5FA',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F6F6F6',
          card: '#FFFFFF',
        },
        text: {
          primary: '#000000',
          secondary: '#1F2937',
          tertiary: '#374151',
          muted: '#6B7280',
        },
        border: {
          primary: '#E5E7EB',
          secondary: '#D1D5DB',
        },
        road: {
          'type-a': {
            border: '#006C49',
            background: '#006C49',
            text: '#F8E027',
          },
          'type-m': {
            border: '#007BC1',
            background: '#007BC1',
            text: '#FFFFFF',
          },
          'type-street': {
            border: '#6B7280',
            background: '#6B7280',
            text: '#FFFFFF',
          },
        },
        status: {
          success: '#26D543',
          warning: '#EA580C',
          error: '#DC2626',
          info: '#3B82F6',
        },
        live: {
          background: '#26D543',
          border: '#000000',
          white: '#FFFFFF',
          gray: '#F7F7F7',
        },
        inspector: {
          tfl: '#0066CC',
          police: '#DC2626',
          clear: '#16A34A',
        },
        event: {
          sports: '#22C55E',
          concerts: '#9333EA',
          festivals: '#EA580C',
          'performing-arts': '#DB2777',
          conferences: '#2563EB',
          expos: '#4B5563',
        },
        transport: {
          disruption: '#EA580C',
          closure: '#DC2626',
          suspension: '#991B1B',
          delay: '#D97706',
        },
      },
      width: {
        'mobile': '375px',
      },
      maxWidth: {
        'mobile': '375px',
      },
      minWidth: {
        'mobile': '375px',
      },
    },
  },
  plugins: [],
}
