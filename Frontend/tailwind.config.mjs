/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary-darkest': '#06141B',
				'primary-dark': '#11212D',
				'primary-medium': '#253745',
				'primary-accent': '#4A5C6A',
				'primary-light': '#9BA8AB',
				'primary-lightest': '#CCD0CF',
			},
		},
	},
	plugins: [],
}
