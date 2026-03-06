/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            colors: {
                blood: '#e8698a',
                gold: '#a78bfa',
                darkgold: '#6d28d9',
                night: '#05060f',
                ember: '#0c1122',
                blush: '#fecdd3',
                mist: '#c4b5fd',
            },
            fontFamily: {
                dancing: ['"Great Vibes"', 'cursive'],
                playfair: ['"Playfair Display"', 'serif'],
                cinzel: ['"Cormorant Garamond"', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            animation: {
                flicker: 'flicker 3s ease-in-out infinite',
                heartbeat: 'heartbeat 1.5s ease-in-out infinite',
                float: 'float 5s ease-in-out infinite',
                shimmer: 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                flicker: {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '25%': { opacity: '0.92', filter: 'brightness(0.95)' },
                    '50%': { opacity: '0.78', filter: 'brightness(0.88)' },
                    '75%': { opacity: '0.88', filter: 'brightness(0.92)' },
                },
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '14%': { transform: 'scale(1.35)' },
                    '28%': { transform: 'scale(1)' },
                    '42%': { transform: 'scale(1.3)' },
                    '70%': { transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-18px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
            },
        },
    },
    plugins: [],
};