const primaryColor = '37, 89%,';
const secondaryColor = '31, 51%,';
const tertiaryColor = '9, 69%,';
const errorColor = '352, 95%,';
const neutralColor = '37, 20%,';
const infoColor = '190, 76%,';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  darkMode: 'class',
  theme: {
    screens: {
      'mobile-sm': '380px',
      mobile: '480px',
      'mobile-lg': '640px',
      tablet: '768px',
      'laptop-sm': '1024px',
      laptop: '1440px'
    },
    container: {
      center: true,
      screens: {
        xl: '1280px',
        '2xl': '1440px'
      }
    },
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        lora: ['var(--font-lora)']
      },
      borderRadius: {
        lg: '32px',
        md: '16px',
        smd: '12px',
        sm: '8px',
        xs: '4px'
      },
      boxShadow: {
        xs: '0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
        sm: '0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
        md: '0px 1px 3px 0px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15)',
        lg: '0px 2px 3px 0px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15)',
        xl: '0px 4px 4px 0px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15)'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
        '6xl': '3.75rem',
        '7xl': '4.75rem',
        '8xl': '5.75rem',
        '9xl': '8rem',
        '10xl': '11.25rem'
      },
      lineHeight: {
        xs: '1rem',
        sm: '1.25rem',
        base: '1.5rem',
        lg: '1.75rem',
        xl: '2rem',
        '2xl': '2.25rem',
        '3xl': '2.5rem',
        '4xl': '3rem',
        '5xl': '3rem',
        '6xl': '4.25rem',
        '7xl': '5.25rem',
        '8xl': '6.25rem',
        '9xl': '8rem',
        '10xl': '11.25rem'
      },
      spacing: {
        '9xl': '320px',
        '8xl': '256px',
        '7xl': '192px',
        '6xl': '160px',
        '5xl': '128px',
        '4xl': '96px',
        '3xl': '64px',
        '2xl': '48px',
        button: '40px',
        xl: '32px',
        lg: '24px',
        md: '16px',
        smd: '12px',
        sm: '8px',
        xs: '4px',
        xxs: '2px'
      },
      transitionDuration: {
        'extra-fast': '100ms',
        fast: '200ms',
        medium: '400ms',
        slow: '600ms',
        'extra-slow': '800ms',
        slowest: '1000ms'
      },
      colors: {
        background: `hsl(${neutralColor} 98%)`,
        foreground: `hsl(${neutralColor} 5%)`,
        card: {
          DEFAULT: `hsl(${neutralColor} 98%)`,
          foreground: `hsl(${neutralColor} 5%)`
        },
        popover: {
          DEFAULT: `hsl(${neutralColor} 98%)`,
          foreground: `hsl(${neutralColor} 5%)`
        },
        primary: {
          1: `hsl(${primaryColor} 98%)`,
          50: `hsl(${primaryColor} 95%)`,
          100: `hsl(${primaryColor} 85%)`,
          200: `hsl(${primaryColor} 75%)`,
          300: `hsl(${primaryColor} 65%)`,
          400: `hsl(${primaryColor} 55%)`,
          500: `hsl(${primaryColor} 45%)`,
          600: `hsl(${primaryColor} 35%)`,
          700: `hsl(${primaryColor} 25%)`,
          800: `hsl(${primaryColor} 15%)`,
          900: `hsl(${primaryColor} 5%)`,
          DEFAULT: `hsl(${primaryColor} 55%)`,
          foreground: `hsl(${secondaryColor} 98%)`,
          fg: `hsl(${primaryColor} 98%)`,
          container: `hsl(${primaryColor} 85%)`,
          'container-fg': `hsl(${primaryColor} 5%)`
        },
        secondary: {
          1: `hsl(${secondaryColor} 98%)`,
          50: `hsl(${secondaryColor} 95%)`,
          100: `hsl(${secondaryColor} 85%)`,
          200: `hsl(${secondaryColor} 75%)`,
          300: `hsl(${secondaryColor} 65%)`,
          400: `hsl(${secondaryColor} 55%)`,
          500: `hsl(${secondaryColor} 45%)`,
          600: `hsl(${secondaryColor} 35%)`,
          700: `hsl(${secondaryColor} 25%)`,
          800: `hsl(${secondaryColor} 15%)`,
          900: `hsl(${secondaryColor} 5%)`,
          DEFAULT: `hsl(${secondaryColor} 55%)`,
          foreground: `hsl(${secondaryColor} 98%)`,
          fg: `hsl(${secondaryColor}  98%)`,
          container: `hsl(${secondaryColor} 85%)`,
          'container-fg': `hsl(${secondaryColor} 5%)`
        },
        tertiary: {
          1: `hsl(${tertiaryColor} 98%)`,
          50: `hsl(${tertiaryColor} 95%)`,
          100: `hsl(${tertiaryColor} 85%)`,
          200: `hsl(${tertiaryColor} 75%)`,
          300: `hsl(${tertiaryColor} 65%)`,
          400: `hsl(${tertiaryColor} 55%)`,
          500: `hsl(${tertiaryColor} 45%)`,
          600: `hsl(${tertiaryColor} 35%)`,
          700: `hsl(${tertiaryColor} 25%)`,
          800: `hsl(${tertiaryColor} 15%)`,
          900: `hsl(${tertiaryColor} 5%)`,
          DEFAULT: `hsl(${tertiaryColor} 55%)`,
          foreground: `hsl(${tertiaryColor} 98%)`,
          fg: `hsl(${tertiaryColor}  98%)`,
          container: `hsl(${tertiaryColor} 85%)`,
          'container-fg': `hsl(${tertiaryColor} 5%)`
        },
        muted: {
          DEFAULT: `hsl(${secondaryColor} 55%)`,
          foreground: `hsl(${errorColor} 98%)`
        },
        accent: {
          DEFAULT: `hsl(${secondaryColor} 55%)`,
          foreground: `hsl(${secondaryColor} 98%)`
        },
        destructive: {
          DEFAULT: `hsl(${errorColor} 55%)`,
          foreground: `hsl(${errorColor} 98%)`
        },
        border: `hsl(${primaryColor} 85%)`,
        input: `hsl(${primaryColor} 85%)`,
        ring: `hsl(${primaryColor} 55%)`,
        neutral: {
          1: `hsl(${neutralColor} 98%)`,
          50: `hsl(${neutralColor} 95%)`,
          100: `hsl(${neutralColor} 85%)`,
          200: `hsl(${neutralColor} 75%)`,
          300: `hsl(${neutralColor} 65%)`,
          400: `hsl(${neutralColor} 55%)`,
          500: `hsl(${neutralColor} 45%)`,
          600: `hsl(${neutralColor} 35%)`,
          700: `hsl(${neutralColor} 25%)`,
          800: `hsl(${neutralColor} 15%)`,
          900: `hsl(${neutralColor} 5%)`,
          DEFAULT: `hsl(${neutralColor} 55%)`,
          foreground: `hsl(${neutralColor}  98%)`,
          fg: `hsl(${neutralColor}  98%)`,
          container: `hsl(${neutralColor} 85%)`,
          'container-fg': `hsl(${neutralColor} 5%)`
        },
        error: {
          1: `hsl(${errorColor} 98%)`,
          50: `hsl(${errorColor} 95%)`,
          100: `hsl(${errorColor} 85%)`,
          200: `hsl(${errorColor} 75%)`,
          300: `hsl(${errorColor} 65%)`,
          400: `hsl(${errorColor} 55%)`,
          500: `hsl(${errorColor} 45%)`,
          600: `hsl(${errorColor} 35%)`,
          700: `hsl(${errorColor} 25%)`,
          800: `hsl(${errorColor} 15%)`,
          900: `hsl(${errorColor} 5%)`,
          DEFAULT: `hsl(${errorColor} 55%)`,
          foreground: `hsl(${errorColor} 98%)`,
          fg: `hsl(${errorColor} 98%)`,
          container: `hsl(${errorColor} 85%)`,
          'container-fg': `hsl(${errorColor} 5%)`
        },
        info: {
          1: `hsl(${infoColor} 98%)`,
          50: `hsl(${infoColor} 95%)`,
          100: `hsl(${infoColor} 85%)`,
          200: `hsl(${infoColor} 75%)`,
          300: `hsl(${infoColor} 65%)`,
          400: `hsl(${infoColor} 55%)`,
          500: `hsl(${infoColor} 45%)`,
          600: `hsl(${infoColor} 35%)`,
          700: `hsl(${infoColor} 25%)`,
          800: `hsl(${infoColor} 15%)`,
          900: `hsl(${infoColor} 5%)`,
          DEFAULT: `hsl(${infoColor} 55%)`,
          foreground: `hsl(${infoColor} 98%)`,
          fg: `hsl(${infoColor} 98%)`,
          container: `hsl(${infoColor} 85%)`,
          'container-fg': `hsl(${infoColor} 5%)`
        },
        surface: {
          DEFAULT: `hsl(${neutralColor} 98%)`,
          'container-lowest': `hsl(${neutralColor} 95%)`,
          'container-low': `hsl(${neutralColor} 85%)`,
          container: `hsl(${neutralColor} 75%)`,
          'container-high': `hsl(${neutralColor} 65%)`,
          'container-highest': `hsl(${neutralColor} 55%)`,
          fg: `hsl(${primaryColor} 5%)`
        },
        outline: {
          DEFAULT: `hsl(${neutralColor} 55%)`
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
};

export default config;
