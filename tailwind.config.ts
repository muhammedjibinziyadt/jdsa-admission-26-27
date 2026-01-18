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
			/* Premium White & Ivory Theme */
			navy: {
				DEFAULT: 'hsl(220 15% 30%)',
				light: 'hsl(220 12% 45%)',
				dark: 'hsl(220 15% 20%)',
				deep: 'hsl(220 15% 15%)'
			},
			teal: {
				DEFAULT: 'hsl(43 40% 60%)',
				light: 'hsl(43 35% 70%)',
				dark: 'hsl(43 45% 50%)',
				glow: 'hsl(43 40% 65%)'
			},
			gold: {
				DEFAULT: 'hsl(43 40% 60%)',
				light: 'hsl(45 45% 70%)',
				dark: 'hsl(40 45% 50%)',
				amber: 'hsl(38 50% 60%)'
			},
			ivory: {
				DEFAULT: 'hsl(40 25% 98%)',
				soft: 'hsl(40 20% 95%)'
			},
			slate: {
				light: 'hsl(220 15% 88%)',
				DEFAULT: 'hsl(220 10% 55%)',
				dark: 'hsl(220 15% 40%)'
			}
  		},
  		fontFamily: {
  			display: [
  				'Noto Sans',
  				'Noto Sans Malayalam',
  				'Source Sans 3',
  				'sans-serif'
  			],
  			sans: [
  				'Noto Sans',
  				'Noto Sans Malayalam',
  				'Source Sans 3',
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
  				'Noto Naskh Arabic',
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
			soft: '0 4px 20px -4px hsla(220, 15%, 50%, 0.08)',
			elevated: '0 12px 40px -8px hsla(220, 15%, 50%, 0.12)',
			teal: '0 8px 30px -6px hsla(43, 40%, 60%, 0.15)',
			gold: '0 8px 30px -6px hsla(43, 50%, 60%, 0.12)',
			glow: '0 0 30px -5px hsla(220, 15%, 50%, 0.1)',
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
