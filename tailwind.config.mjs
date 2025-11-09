/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
	darkMode: ["class"], // class 기반 다크 모드
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontSize: {
				body: ['16px', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
				h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
				h2: ['2rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.015em' }],
				h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }],
				h4: ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
				caption: ['0.875rem', { lineHeight: '1.5' }],
				small: ['0.8125rem', { lineHeight: '1.5' }],
			},
			maxWidth: {
				content: '42rem',  // 672px - 본문 최대 너비
				wide: '64rem',     // 1024px - 넓은 레이아웃
				full: '80rem',     // 1280px - 전체 최대 너비
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						maxWidth: "none",
						color: theme("colors.gray.900"),
						a: {
							color: theme("colors.blue.600"),
							"&:hover": {
								color: theme("colors.blue.800"),
							},
						},
						h1: {
							color: theme("colors.gray.900"),
						},
						h2: {
							color: theme("colors.gray.900"),
						},
						h3: {
							color: theme("colors.gray.900"),
						},
						h4: {
							color: theme("colors.gray.900"),
						},
						code: {
							color: theme("colors.pink.600"),
						},
						"code::before": {
							content: '"',
						},
						"code::after": {
							content: '"',
						},
					},
				},
				invert: {
					css: {
						color: theme("colors.gray.100"),
						a: {
							color: theme("colors.blue.400"),
							"&:hover": {
								color: theme("colors.blue.300"),
							},
						},
						h1: {
							color: theme("colors.gray.100"),
						},
						h2: {
							color: theme("colors.gray.100"),
						},
						h3: {
							color: theme("colors.gray.100"),
						},
						h4: {
							color: theme("colors.gray.100"),
						},
						code: {
							color: theme("colors.pink.400"),
						},
					},
				},
			}),
		},
	},
	plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
