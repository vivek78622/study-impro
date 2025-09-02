/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Landing page design tokens
        'canvas': '#FBF9F7',
        'primary-teal': '#22C1A3',
        'accent-apricot': '#FFB86B',
        'soft-blue': '#A7D8F5',
        
        // Main color palette - exact values from user specification
        'soft-beige': '#F5F0E1',
        'light-wood': '#D2B48C',
        'green-plants': '#C1E1C1',
        'pastel-orange': '#FFCC99',
        'sky-blue': '#ADD8E6',
        'lavender': '#E6E6FA',
        
        // Semantic colors
        background: '#F5F0E1',
        foreground: '#2a2a2a',
        border: '#D2B48C',
        input: '#F5F0E1',
        ring: '#ADD8E6',
        card: '#FFFFFF',
        'card-foreground': '#2a2a2a',
        
        primary: {
          DEFAULT: '#C1E1C1',
          foreground: '#2a2a2a',
        },
        secondary: {
          DEFAULT: '#F5F0E1',
          foreground: '#2a2a2a',
        },
        muted: {
          DEFAULT: '#D2B48C',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#ADD8E6',
          foreground: '#2a2a2a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        popover: {
          DEFAULT: '#ffffff',
          foreground: '#2a2a2a',
        },
        // Additional semantic colors for dashboard
        'primary-glow': '#B5D6B5',
        'secondary-accent': '#B7D8E8',
        'amber-accent': '#E6B800',
        
        // Login page colors
        'login-bg': '#FDF8F3',
        'login-primary': '#F4B566',
        'login-yellow': '#F4D03F',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'slide-in-from-bottom-4': 'slide-in-from-bottom 0.4s cubic-bezier(0.2, 0.9, 0.25, 1)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-from-bottom': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 6px 24px rgba(18, 24, 33, 0.06)',
        'landing': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
}
