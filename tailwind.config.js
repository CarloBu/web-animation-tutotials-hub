/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}'],
	darkMode: 'class',
	theme: {
		extend: {
			screens: {
				xsm: '450px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px',
				'3xl': '1920px',
			},
			colors: {
				main: '#A6FAFF',
				mainHover: '#79F7FF',
				mainActive: '#00E1EF',
				mainAccent: '#4d80e6', // not needed for shadcn components
				overlay: 'rgba(0,0,0,0.8)',
				navColor: '#fed36b',
				darkNavColor: '#e9b845',
				// background color overlay for alert dialogs, modals, etc.

				// light mode
				bg: '#dfe5f2',
				lightBg: '#fff',
				text: '#000',
				border: '#000',

				// dark mode
				darkBg: '#272933',
				darkText: '#eeefe9',
				darkBorder: '#000',
				darkLightBg: 'bg-gray-800',
			},
			borderRadius: {
				base: '0.75rem',
			},
			boxShadow: {
				buttonLight: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
				buttonDark: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
				cardLight: '6px 6px 0px 0px rgba(0, 0, 0, 1)',
			},
			translate: {
				boxShadowX: '-6px',
				boxShadowY: '6px',
				reverseBoxShadowX: '6px',
				reverseBoxShadowY: '-6px',
			},
			fontFamily: {
				sans: ['"Public Sans"', 'sans-serif'],
			},
			fontWeight: {
				base: '400',
				medium: '700',
				heading: '900',
			},
		},
	},
	plugins: [],
};
