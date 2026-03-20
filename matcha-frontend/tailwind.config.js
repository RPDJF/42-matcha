/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'rose-pink-purple':
          'linear-gradient(to bottom right, theme(colors.rose[50]), theme(colors.pink[50]), theme(colors.purple[50]))',
      },
      colors: {
        // catppuccin colors (e.g. macchiato) from: https://catppuccin.com/palette/
        'latte-rosewater': '#dc8a78',
        'latte-flamingo': '#dd7878',
        'latte-pink': '#ea76cb',
        'latte-mauve': '#8839ef',
        'latte-red': '#d20f39',
        'latte-maroon': '#e64553',
        'latte-peach': '#fe640b',
        'latte-yellow': '#df8e1d',
        'latte-green': '#40a02b',
        'latte-teal': '#179299',
        'latte-sky': '#04a5e5',
        'latte-sapphire': '#209fb5',
        'latte-blue': '#1e66f5',
        'latte-lavender': '#7287fd',
        'latte-text': '#4c4f69',
        'latte-subtext-1': '#5c5f77',
        'latte-subtext-0': '#6c6f85',
        'latte-overlay-2': '#7c7f93',
        'latte-overlay-1': '#8c8fa1',
        'latte-overlay-0': '#9ca0b0',
        'latte-surface-2': '#acb0be',
        'latte-surface-1': '#bcc0cc',
        'latte-surface-0': '#ccd0da',
        'latte-base': '#eff1f5',
        'latte-mantle': '#e6e9ef',
        'latte-crust': '#dce0e8',
      },
    },
  },
};
