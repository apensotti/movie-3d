import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif']
  		},
  		fontSize: {
  			'2xs': '0.675rem',
  			'3xs': '0.6rem'
  		},
  		height: {
  			'81': '21rem',
  			'82': '21.5rem',
  			'83': '22rem',
  			'84': '22.5rem',
  			'85': '23rem',
  			'86': '23.5rem',
  			'97': '25rem',
  			'98': '26rem',
  			'100': '27rem',
  			'102': '28rem',
  			'104': '29rem',
  			'106': '30rem',
  			'108': '31rem',
  			'110': '32rem',
  			'200': '54rem'
  		},
  		width: {
  			'81': '21rem',
  			'82': '21.5rem',
  			'83': '22rem',
  			'84': '22.5rem',
  			'85': '23rem',
  			'86': '23.5rem',
  			'97': '25rem',
  			'98': '26rem',
  			'100': '27rem',
  			'102': '28rem',
  			'104': '29rem',
  			'106': '30rem',
  			'108': '31rem',
  			'110': '32rem'
  		},
  		colors: {
			'neutral-850': '#222222',
			'neutral-875': '#202020',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
