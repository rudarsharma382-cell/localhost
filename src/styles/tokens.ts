/**
 * RUDAR OS DESIGN TOKENS
 * Direction: Precision Studio Slate & Mineral Linen
 * Calm, quiet, tactile. No orange-on-black. No uppercase mono labels.
 */

export const tokens = {
  color: {
    surface: {
      canvas: '#111315', // Studio ground / wallpaper base
      base: '#181A1D',   // Window frames, top bar, dock
      panel: '#1F2226',  // Window interior
      raised: '#272B30', // Menus, dialogs, popovers
      overlay: 'rgba(17, 19, 21, 0.75)',
    },
    border: {
      subtle: '#25292E',
      default: '#2E3339',
      strong: '#3B424A',
      focus: '#C49B72', // Subtle mineral ochre for focus only
    },
    text: {
      primary: '#F0EFEA',   // Warm mineral white
      secondary: '#9CA2A8', // Quiet readable body text
      tertiary: '#666C72',  // Subtle metadata and timestamps
      inverse: '#111315',
    },
    accent: {
      DEFAULT: '#C49B72', // Restrained mineral ochre / warm copper linen
      hover: '#D4AB82',
      active: '#B48B62',
      subtle: 'rgba(196, 155, 114, 0.1)',
      text: '#C49B72',
    },
    semantic: {
      success: {
        DEFAULT: '#3EA876',
        subtle: 'rgba(62, 168, 118, 0.1)',
        text: '#4EB886',
      },
      warning: {
        DEFAULT: '#D4A048',
        subtle: 'rgba(212, 160, 72, 0.1)',
        text: '#E4B058',
      },
      error: {
        DEFAULT: '#D45D5D',
        subtle: 'rgba(212, 93, 93, 0.1)',
        text: '#E46D6D',
      },
      info: {
        DEFAULT: '#6A9BC4',
        subtle: 'rgba(106, 155, 196, 0.1)',
        text: '#7AABDC',
      },
    },
    windowControls: {
      hover: '#2E3339',
      active: '#3B424A',
      closeHover: '#D45D5D',
    },
  },

  typography: {
    fontFamily: {
      display: 'var(--font-display), "Cabinet Grotesk", -apple-system, sans-serif',
      sans: 'var(--font-sans), "Switzer", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'var(--font-mono), "JetBrains Mono", ui-monospace, monospace',
    },
    scale: {
      xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px
      sm: { size: '0.8125rem', lineHeight: '1.25rem' }, // 13px
      base: { size: '0.9375rem', lineHeight: '1.5rem' }, // 15px
      md: { size: '1.0625rem', lineHeight: '1.625rem' }, // 17px
      lg: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px
      xl: { size: '1.5rem', lineHeight: '2rem' },       // 24px
      '2xl': { size: '2rem', lineHeight: '2.5rem' },     // 32px
      clock: { size: '4rem', lineHeight: '4rem' },       // 64px
    },
  },

  space: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  radius: {
    none: '0px',
    sm: '3px',
    md: '6px',
    lg: '8px',
  },

  shadow: {
    none: 'none',
    base: '0 4px 16px rgba(0, 0, 0, 0.4)',
    window: '0 16px 40px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4)',
    windowActive: '0 20px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(196, 155, 114, 0.3)',
    floating: '0 24px 56px rgba(0, 0, 0, 0.8)',
  },

  motion: {
    duration: {
      instant: '90ms',
      quick: '160ms',
      base: '240ms',
      slow: '400ms',
      scene: '1200ms',
    },
    easing: {
      enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
      move: 'cubic-bezier(0.4, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },

  zIndex: {
    wallpaper: 0,
    desktopIcons: 10,
    windows: 20,
    topBar: 50,
    dock: 60,
    launcher: 70,
    toasts: 80,
    modal: 90,
  },
} as const;

export type DesignTokens = typeof tokens;
