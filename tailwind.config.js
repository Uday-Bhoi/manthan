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
                manthan: {
                    black: '#0a0a0a',
                    dark: '#1a0a0a',
                    maroon: '#8B0000',
                    'maroon-light': '#a52a2a',
                    'maroon-dark': '#5c0000',
                    crimson: '#DC143C',
                    gold: '#d4a837',
                    'gold-light': '#f0d060',
                    'gold-dark': '#b8860b',
                    red: '#cc0000',
                    'red-glow': '#ff2222',
                },
            },
            fontFamily: {
                heading: ['Cormorant Unicase', 'serif'],
                body: ['Cormorant Unicase', 'serif'],
            },
            backgroundImage: {
                'hero-pattern': "url('/bg-zodiac.jpg')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 55, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(212, 168, 55, 0.6)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
