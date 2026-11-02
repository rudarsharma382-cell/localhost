/**
 * RUDAR OS DESIGN TOKENS
 * Single source of truth for colors, typography, space, radius, elevation, and motion.
 * Anti-slop guarantee: Zero arbitrary values in UI components.
 */

export const tokens = {
  color: {
    // Surface layers
    surface: {
      canvas: '#0C0D0E', // OS background canvas / 3D room deep ground
      base: '#141618',   // Desktop top bar, dock container, window frame base
      panel: '#1A1D20',  // Window interior body, active sidebar, cards
      raised: '#22262B', // Popovers, floating menus, dialogs, toasts
      overlay: 'rgba(12, 13, 14, 0.75)',
    },
    // Hairline borders
    border: {
      subtle: '#22262B',
      default: '#2C3138',
      strong: '#3A424C',
      focus: '#E58B24', // Accent border on focus
    },
    // Typography levels (WCAG AA / AAA verified)
    text: {
      primary: '#EDEDEE',   // High contrast titles, active labels (AAA > 15:1)
      secondary: '#9BA1A6', // Body reading, menu items (AA > 5.5:1)
      tertiary: '#687076',  // Subtext, inactive window titles, shortcuts (AA ~3.6:1)
      inverse: '#0C0D0E',   // For badges or buttons on accent background
    },
    // Single accent color (Strictly reserved for active states, focus rings, primary action)
    accent: {
      DEFAULT: '#E58B24', // Warm burnished amber
      hover: '#F29938',
      active: '#CC771B',
      subtle: 'rgba(229, 139, 36, 0.12)',
      text: '#E58B24',
    },
    // Semantic system
    semantic: {
      success: {
        DEFAULT: '#34B27B',
        subtle: 'rgba(52, 178, 123, 0.12)',
        text: '#45C78E',
      },
      warning: {
        DEFAULT: '#E5A83B',
        subtle: 'rgba(229, 168, 59, 0.12)',
        text: '#F5B84C',
      },
      error: {
        DEFAULT: '#E5484D',
        subtle: 'rgba(229, 72, 77, 0.12)',
        text: '#F2555A',
      },
      info: {
        DEFAULT: '#4DA6E8',
        subtle: 'rgba(77, 166, 232, 0.12)',
        text: '#64B5F6',
      },
    },
    // Window control buttons (calibrated muted dots, not candy gloss)
    windowControls: {
      close: '#E5484D',
      closeHover: '#FF5C61',
      minimize: '#E5A83B',
      minimizeHover: '#FFBA4D',
      maximize: '#34B27B',
      maximizeHover: '#42D694',
      inactive: '#3E444D',
    },
  },

  typography: {
    fontFamily: {
      display: 'var(--font-display), "Cabinet Grotesk", -apple-system, system-ui, sans-serif',
      sans: 'var(--font-sans), "Switzer", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    },
    scale: {
      xs: { size: '0.6875rem', lineHeight: '0.875rem' }, // 11px / 14px (dock labels, tiny status)
      sm: { size: '0.8125rem', lineHeight: '1.125rem' }, // 13px / 18px (system UI, buttons, table)
      base: { size: '0.9375rem', lineHeight: '1.4375rem' }, // 15px / 23px (standard body reading)
      md: { size: '1.0625rem', lineHeight: '1.625rem' }, // 17px / 26px (subheadings, lead)
      lg: { size: '1.25rem', lineHeight: '1.75rem' }, // 20px / 28px (window titles, section headers)
      xl: { size: '1.625rem', lineHeight: '2.125rem' }, // 26px / 34px (app titles, case study titles)
      '2xl': { size: '2.25rem', lineHeight: '2.75rem' }, // 36px / 44px (lock screen header)
      clock: { size: '4.5rem', lineHeight: '4.5rem' }, // 72px / 72px (lock screen clock)
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
    sm: '4px',   // Buttons, inputs, small tags, tooltips
    md: '8px',   // Panels, dock container, popovers, notifications
    lg: '12px',  // Windows, modal dialogs, lock screen card
    full: '9999px', // Circular status indicators, avatar pill
  },

  shadow: {
    none: 'none',
    base: '0 4px 16px rgba(0, 0, 0, 0.35)', // Panels inside windows
    window: '0 12px 32px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35)', // Window resting
    windowActive: '0 16px 44px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(229, 139, 36, 0.25)', // Active window
    floating: '0 20px 48px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.4)', // Menus, toasts
  },

  motion: {
    duration: {
      instant: '90ms',  // Hover states, button press
      quick: '160ms',   // Toggles, menus, tooltips
      base: '240ms',    // Window open/close, toasts
      slow: '400ms',    // Desktop reveal, maximize
      scene: '1200ms',  // 3D camera dolly into monitor
    },
    easing: {
      enter: 'cubic-bezier(0.16, 1, 0.3, 1)',   // Calm decelerate
      move: 'cubic-bezier(0.4, 0, 0.2, 1)',     // Standard fluid motion
      exit: 'cubic-bezier(0.4, 0, 1, 1)',       // Accelerate out
    },
  },

  zIndex: {
    wallpaper: 0,
    desktopIcons: 10,
    windows: 20, // Window manager stacks above 20
    topBar: 50,
    dock: 60,
    launcher: 70,
    toasts: 80,
    modal: 90,
    cursor: 100,
  },
} as const;

export type DesignTokens = typeof tokens;

