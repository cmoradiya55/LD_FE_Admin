import type { Config } from 'tailwindcss';

const hslVar = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`;
const rgbVar = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const primaryShades = {
  50: rgbVar('--palette-primary-50'),
  100: rgbVar('--palette-primary-100'),
  200: rgbVar('--palette-primary-200'),
  300: rgbVar('--palette-primary-300'),
  400: rgbVar('--palette-primary-400'),
  500: rgbVar('--palette-primary-500'),
  600: rgbVar('--palette-primary-600'),
  700: rgbVar('--palette-primary-700'),
  800: rgbVar('--palette-primary-800'),
  900: rgbVar('--palette-primary-900'),
};

const palette = {
  white: rgbVar('--palette-white'),
  black: rgbVar('--palette-black'),
  gray: {
    50: rgbVar('--palette-gray-50'),
    100: rgbVar('--palette-gray-100'),
    200: rgbVar('--palette-gray-200'),
    300: rgbVar('--palette-gray-300'),
    400: rgbVar('--palette-gray-400'),
    500: rgbVar('--palette-gray-500'),
    600: rgbVar('--palette-gray-600'),
    700: rgbVar('--palette-gray-700'),
    800: rgbVar('--palette-gray-800'),
    900: rgbVar('--palette-gray-900'),
  },
  slate: {
    800: rgbVar('--palette-slate-800'),
  },
  blue: {
    50: rgbVar('--palette-blue-50'),
    100: rgbVar('--palette-blue-100'),
    200: rgbVar('--palette-blue-200'),
    300: rgbVar('--palette-blue-300'),
    400: rgbVar('--palette-blue-400'),
    500: rgbVar('--palette-blue-500'),
    600: rgbVar('--palette-blue-600'),
    700: rgbVar('--palette-blue-700'),
    800: rgbVar('--palette-blue-800'),
    900: rgbVar('--palette-blue-900'),
  },
  green: {
    50: rgbVar('--palette-green-50'),
    100: rgbVar('--palette-green-100'),
    200: rgbVar('--palette-green-200'),
    500: rgbVar('--palette-green-500'),
    600: rgbVar('--palette-green-600'),
    700: rgbVar('--palette-green-700'),
    800: rgbVar('--palette-green-800'),
  },
  red: {
    50: rgbVar('--palette-red-50'),
    100: rgbVar('--palette-red-100'),
    300: rgbVar('--palette-red-300'),
    400: rgbVar('--palette-red-400'),
    500: rgbVar('--palette-red-500'),
    600: rgbVar('--palette-red-600'),
    700: rgbVar('--palette-red-700'),
  },
  yellow: {
    100: rgbVar('--palette-yellow-100'),
    600: rgbVar('--palette-yellow-600'),
    800: rgbVar('--palette-yellow-800'),
  },
  orange: {
    50: rgbVar('--palette-orange-50'),
    100: rgbVar('--palette-orange-100'),
    500: rgbVar('--palette-orange-500'),
    600: rgbVar('--palette-orange-600'),
  },
  purple: {
    100: rgbVar('--palette-purple-100'),
    500: rgbVar('--palette-purple-500'),
    600: rgbVar('--palette-purple-600'),
    700: rgbVar('--palette-purple-700'),
    800: rgbVar('--palette-purple-800'),
  },
};

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: hslVar('--background'),
        foreground: hslVar('--foreground'),
        card: {
          DEFAULT: hslVar('--card'),
          foreground: hslVar('--card-foreground'),
        },
        popover: {
          DEFAULT: hslVar('--popover'),
          foreground: hslVar('--popover-foreground'),
        },
        primary: {
          DEFAULT: hslVar('--primary'),
          foreground: hslVar('--primary-foreground'),
          ...primaryShades,
        },
        secondary: {
          DEFAULT: hslVar('--secondary'),
          foreground: hslVar('--secondary-foreground'),
        },
        muted: {
          DEFAULT: hslVar('--muted'),
          foreground: hslVar('--muted-foreground'),
        },
        accent: {
          DEFAULT: hslVar('--accent'),
          foreground: hslVar('--accent-foreground'),
        },
        destructive: {
          DEFAULT: hslVar('--destructive'),
          foreground: hslVar('--destructive-foreground'),
        },
        border: hslVar('--border'),
        input: hslVar('--input'),
        ring: hslVar('--ring'),
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        ...palette,
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
