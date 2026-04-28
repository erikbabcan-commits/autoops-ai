import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        cyber: {
          bg: '#070712',
          panel: '#0c0f1f',
          glass: 'rgba(255,255,255,.065)',
          cyan: '#00f5ff',
          purple: '#a855f7',
          pink: '#ff3df2',
          green: '#34d399',
          amber: '#f59e0b'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        glow: '0 0 36px rgba(0,245,255,.22)',
        purple: '0 0 42px rgba(168,85,247,.25)',
        neumorph: '18px 18px 42px rgba(0,0,0,.45), -10px -10px 30px rgba(255,255,255,.045)'
      },
      backgroundImage: {
        'cyber-radial': 'radial-gradient(circle at 20% 10%, rgba(0,245,255,.18), transparent 32%), radial-gradient(circle at 85% 15%, rgba(168,85,247,.2), transparent 35%), radial-gradient(circle at 50% 100%, rgba(0,245,255,.08), transparent 40%)'
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,245,255,.18)' },
          '50%': { boxShadow: '0 0 46px rgba(0,245,255,.38)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        orbit: 'orbit 12s linear infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite'
      }
    }
  },
  plugins: [animate]
} satisfies Config;
