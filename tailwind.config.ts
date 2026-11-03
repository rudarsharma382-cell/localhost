import type { Config } from 'tailwindcss';
import { tokens } from './src/styles/tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/os/**/*.{js,ts,jsx,tsx,mdx}',
    './src/apps/**/*.{js,ts,jsx,tsx,mdx}',
    './src/scene/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          canvas: tokens.color.surface.canvas,
          base: tokens.color.surface.base,
          panel: tokens.color.surface.panel,
          raised: tokens.color.surface.raised,
          overlay: tokens.color.surface.overlay,
        },
        border: {
          subtle: tokens.color.border.subtle,
          default: tokens.color.border.default,
          strong: tokens.color.border.strong,
          focus: tokens.color.border.focus,
        },
        content: {
          primary: tokens.color.text.primary,
          secondary: tokens.color.text.secondary,
          tertiary: tokens.color.text.tertiary,
          inverse: tokens.color.text.inverse,
        },
        accent: {
          DEFAULT: tokens.color.accent.DEFAULT,
          hover: tokens.color.accent.hover,
          active: tokens.color.accent.active,
          subtle: tokens.color.accent.subtle,
        },
        semantic: {
          success: tokens.color.semantic.success.DEFAULT,
          'success-subtle': tokens.color.semantic.success.subtle,
          warning: tokens.color.semantic.warning.DEFAULT,
          'warning-subtle': tokens.color.semantic.warning.subtle,
          error: tokens.color.semantic.error.DEFAULT,
          'error-subtle': tokens.color.semantic.error.subtle,
          info: tokens.color.semantic.info.DEFAULT,
          'info-subtle': tokens.color.semantic.info.subtle,
        },
      },
      fontFamily: {
        display: [tokens.typography.fontFamily.display],
        sans: [tokens.typography.fontFamily.sans],
        mono: [tokens.typography.fontFamily.mono],
        anurati: ['Anurati', 'sans-serif'],
      },
      fontSize: {
        xs: [tokens.typography.scale.xs.size, tokens.typography.scale.xs.lineHeight],
        sm: [tokens.typography.scale.sm.size, tokens.typography.scale.sm.lineHeight],
        base: [tokens.typography.scale.base.size, tokens.typography.scale.base.lineHeight],
        md: [tokens.typography.scale.md.size, tokens.typography.scale.md.lineHeight],
        lg: [tokens.typography.scale.lg.size, tokens.typography.scale.lg.lineHeight],
        xl: [tokens.typography.scale.xl.size, tokens.typography.scale.xl.lineHeight],
        '2xl': [tokens.typography.scale['2xl'].size, tokens.typography.scale['2xl'].lineHeight],
        clock: [tokens.typography.scale.clock.size, tokens.typography.scale.clock.lineHeight],
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
      },
      boxShadow: {
        base: tokens.shadow.base,
        window: tokens.shadow.window,
        'window-active': tokens.shadow.windowActive,
        floating: tokens.shadow.floating,
      },
      transitionDuration: {
        instant: tokens.motion.duration.instant,
        quick: tokens.motion.duration.quick,
        base: tokens.motion.duration.base,
        slow: tokens.motion.duration.slow,
        scene: tokens.motion.duration.scene,
      },
      transitionTimingFunction: {
        enter: tokens.motion.easing.enter,
        move: tokens.motion.easing.move,
        exit: tokens.motion.easing.exit,
      },
    },
  },
  plugins: [],
};

export default config;

