// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Adicione esta linha para garantir que o src seja escaneado
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'sans' para usar nossa nova fonte Poppins
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Cores personalizadas para o tema neon (opcional, mas bom para consistência)
        neonPurple: '#8A2BE2',
        neonBlue: '#00BFFF',
        darkBackground: '#0a0a0a',
        darkCard: 'rgba(25, 25, 112, 0.3)', // Um azul escuro translúcido para cards
      }
    },
  },
  plugins: [],
};