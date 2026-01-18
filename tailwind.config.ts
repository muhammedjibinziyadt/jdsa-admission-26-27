import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
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
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			},
			/* Original Emerald Green & Warm Gold Theme */
			navy: {
				DEFAULT: 'hsl(160, 35%, 18%)',
				light: 'hsl(160, 40%, 25%)',
				dark: 'hsl(160, 35%, 12%)',
				deep: 'hsl(160, 35%, 10%)'
			},
			teal: {
				DEFAULT: 'hsl(170, 50%, 30%)',
				light: 'hsl(170, 45%, 40%)',
				dark: 'hsl(170, 55%, 25%)',
				glow: 'hsl(170, 60%, 35%)'
			},
			gold: {
				DEFAULT: 'hsl(45, 90%, 55%)',
				light: 'hsl(45, 100%, 70%)',
				dark: 'hsl(45, 85%, 45%)',
				amber: 'hsl(40, 85%, 50%)'
			},
			ivory: {
				DEFAULT: 'hsl(45, 80%, 95%)',
				soft: 'hsl(45, 60%, 92%)'
			},
			emerald: {
				DEFAULT: 'hsl(160, 35%, 18%)',
				light: 'hsl(160, 40%, 25%)',
				dark: 'hsl(160, 35%, 12%)'
			}
  		},
  		fontFamily: {
  			display: [
  				'Poppins',
  				'Noto Sans Malayalam',
  				'sans-serif'
  			],
  			sans: [
  				'Poppins',
  				'Noto Sans Malayalam',
  				'ui-sans-serif',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			],
  			serif: [
  				'Amiri',
  				'Noto Sans Malayalam',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'2xl': '1.5rem',
  			'3xl': '2rem'
  		},
		boxShadow: {
			soft: '0 4px 20px -4px hsla(160, 40%, 10%, 0.3)',
			elevated: '0 12px 40px -8px hsla(160, 40%, 10%, 0.4)',
			teal: '0 8px 30px -6px hsla(170, 60%, 35%, 0.3)',
			gold: '0 8px 30px -6px hsla(45, 80%, 50%, 0.25)',
			glow: '0 0 30px -5px hsla(45, 90%, 55%, 0.3)',
			'2xs': 'var(--shadow-2xs)',
			xs: 'var(--shadow-xs)',
			sm: 'var(--shadow-sm)',
			md: 'var(--shadow-md)',
			lg: 'var(--shadow-lg)',
			xl: 'var(--shadow-xl)',
			'2xl': 'var(--shadow-2xl)'
		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			fadeUp: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(30px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shimmer: 'shimmer 3s linear infinite',
  			'fade-up': 'fadeUp 0.8s ease-out forwards',
  			float: 'float 6s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
