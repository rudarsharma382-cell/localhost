# RUDAR OS: DESIGN PROPOSAL & IDENTITY SPECIFICATION
**Gate 1 Deliverable — Prepared for Rudar Sharma**
**Precedence:** `antigravity.md` > `prd.md` > `design.md`

---

## 1. The Feeling in One Paragraph

Rudar OS feels like a precision physical instrument forged from warm industrial slate and milled graphite, illuminated by the quiet amber luminescence of a calibrated laboratory terminal late at night. It is neither a glossy smartphone imitation nor a neon sci-fi dashboard: it is quiet, utilitarian, and tactile, where every surface possesses weight, every border is an exact micro-hairline, and the screen honors the engineering craft of the creator rather than begging for attention.

---

## 2. Palette & Contrast Verification

The palette is strictly limited to an industrial neutral base scale, **one** warm amber accent, and four restrained semantic colors. Zero arbitrary hex values exist outside these tokens.

### 2.1 Color Tokens

| Token | Hex / Value | Role | WCAG Contrast on `#141618` | WCAG Level |
| :--- | :--- | :--- | :--- | :--- |
| `surface.canvas` | `#0C0D0E` | OS background canvas & 3D room ground | N/A (base) | N/A |
| `surface.base` | `#141618` | Top bar, dock container, window frame base | N/A | N/A |
| `surface.panel` | `#1A1D20` | Window interior body, active sidebar, cards | 1.1:1 (tier) | Structural |
| `surface.raised` | `#22262B` | Menus, popovers, dialogs, floating toasts | 1.3:1 (tier) | Structural |
| `border.subtle` | `#22262B` | Hairline dividers between sub-panes | 1.2:1 | Hairline |
| `border.default` | `#2C3138` | Window edges, input borders | 1.6:1 | UI Boundary |
| `border.strong` | `#3A424C` | Active window borders, selected items | 2.1:1 | Active Edge |
| `text.primary` | `#EDEDEE` | Headings, active window titles, primary labels | **15.2:1** | **AAA** (> 7:1) |
| `text.secondary`| `#9BA1A6` | Body reading, descriptions, menu items | **5.8:1** | **AA** (> 4.5:1) |
| `text.tertiary` | `#687076` | Inactive window titles, shortcuts, metadata | **3.5:1** | AA (large/meta) |
| `text.inverse`  | `#0C0D0E` | Badges or active text over amber accent | **9.4:1** on `#E58B24` | **AAA** |
| `accent.DEFAULT`| `#E58B24` | Active selection, keyboard focus ring, primary action | **5.8:1** | **AA** |
| `semantic.success` | `#34B27B` | Verified status, live indicator, online status | **5.1:1** | **AA** |
| `semantic.warning` | `#E5A83B` | Cautionary state, pending item, minimize dot | **6.2:1** | **AA** |
| `semantic.error`   | `#E5484D` | Form error, blocked embed fallback, close dot | **4.6:1** | **AA** |
| `semantic.info`    | `#4DA6E8` | Telemetry hint, documentation link | **5.4:1** | **AA** |

### 2.2 Accent Usage Law
`#E58B24` (Burnished Amber) is reserved **exclusively** for:
1. Keyboard focus rings (`ring-1 ring-accent`)
2. Active dock indicator / open window dot
3. Active tab bottom hairline
4. Primary action button in forms (Notes submit, Browser open)
*Strict Ban:* Never used as background fills for large panels, gradient text, or decorative glowing blobs.

---

## 3. Typography: The Three Families

In strict adherence to `antigravity.md` Section 3, zero generic fonts (Inter, Roboto, Arial, Poppins, Space Grotesk) are permitted. Exactly three families are selected with clear functional responsibilities:

1. **Display: Cabinet Grotesk**
   - *Why:* Geometric, machined European grotesque with distinctive angular cuts on display capitals and numerals. Gives the lock screen clock, case study titles, and OS wordmark an architectural presence without feeling decorative.
2. **UI & Reading: Switzer**
   - *Why:* Rational, crisp, neo-grotesque Swiss sans-serif. Highly readable at 11-13px for system menus, dock tooltips, window titlebars, and beautifully balanced for 15-16px case study body text with comfortable line length (60-75ch).
3. **Monospace: JetBrains Mono**
   - *Why:* Engineered specifically for code readability, clear slashed zeros, distinct punctuation marks, and tabular numbers for telemetry, terminal, tech stack chips, and file trees.

### 3.1 Type Scale Tokens

| Token | Size / Line Height | Usage |
| :--- | :--- | :--- |
| `xs` | 11px / 14px (`0.6875rem` / `0.875rem`) | Dock hover labels, live status pills, shortcuts |
| `sm` | 13px / 18px (`0.8125rem` / `1.125rem`) | System menus, buttons, inputs, window titles |
| `base` | 15px / 23px (`0.9375rem` / `1.4375rem`) | Standard body reading, case study descriptions |
| `md` | 17px / 26px (`1.0625rem` / `1.625rem`) | Project summary leads, section subtitles |
| `lg` | 20px / 28px (`1.25rem` / `1.75rem`) | App main headings, drawer titles |
| `xl` | 26px / 34px (`1.625rem` / `2.125rem`) | Case study headers, About Me headline |
| `2xl` | 36px / 44px (`2.25rem` / `2.75rem`) | Lock screen greeting, dialog titles |
| `clock` | 72px / 72px (`4.5rem` / `4.5rem`) | Lock screen precision time display |

---

## 4. Space, Radius, and Elevation

### 4.1 Spacing Scale
Built on a strict 4px base grid:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px

### 4.2 Radius Scale (Three Steps Only)
- `radius-sm` (4px): Small interactive controls, buttons, text inputs, code chips, tooltips.
- `radius-md` (8px): Panels, dock container, popovers, notifications, app icon squircle.
- `radius-lg` (12px): Desktop windows, lock screen card, modal dialogs.
*(Zero arbitrary 24px or 32px pill cards).*

### 4.3 Elevation & Depth (Three Levels Only)
- **Elevation 1 (Base / Window):** Hairline 1px border `#2C3138`, shadow `0 12px 32px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.35)`.
- **Elevation 2 (Raised / Panel):** Hairline 1px border `#22262B`, shadow `0 4px 16px rgba(0, 0, 0, 0.35)`.
- **Elevation 3 (Floating / Menu & Modal):** Hairline 1px border `#3A424C`, shadow `0 20px 48px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.4)`.

---

## 5. Motion Tokens & Easing

Motion serves orientation, never ornamentation.

| Token | Duration | Purpose |
| :--- | :--- | :--- |
| `duration-instant` | 90ms | Hover highlights, button press feedback |
| `duration-quick` | 160ms | System dropdowns, context menus, tooltips, toggles |
| `duration-base` | 240ms | Window open/close, dock maximize/minimize, toast notifications |
| `duration-slow` | 400ms | Desktop reveal after login, full-screen site mode transitions |
| `duration-scene` | 1200ms | 3D camera dolly into monitor |

### Easing Curves
- `ease-enter`: `cubic-bezier(0.16, 1, 0.3, 1)` (calm deceleration, settled landing without bounce)
- `ease-move`: `cubic-bezier(0.4, 0, 0.2, 1)` (smooth mechanical coordinate translation)
- `ease-exit`: `cubic-bezier(0.4, 0, 1, 1)` (accelerated dismiss)
- `prefers-reduced-motion`: Replaces physical translation with an instantaneous 90ms opacity crossfade.

---

## 6. Icon System & App Icon Construction Rule

### 6.1 UI Action Icons
- 16x16 / 20x20 bounding box
- 1.5px consistent stroke weight
- Round caps and joins
- Monochromatic `#9BA1A6` (transitions to `#EDEDEE` on hover, `#E58B24` on active)

### 6.2 App Icon Construction Rule
App icons are a custom unified set, **not** loose third-party icons dropped into the dock.
- **Form factor:** 40x40px squircle container (`rounded-md`, 8px radius)
- **Background:** Base slate `#1C1F23` with 1px hairline border `#2F343B`
- **Glyph:** Bespoke geometric vector in `#EDEDEE` (stroke 1.5px) featuring an integrated warm amber accent element (`#E58B24`).

#### The 9 App Icons
1. **Development Studio**: Split-pane layout glyph with an amber editor cursor.
2. **Browser**: Minimalist globe/portal viewport glyph with an amber URL pin.
3. **About Me**: Biometric identity silhouette glyph with an amber verification dot.
4. **Rudar AI**: Geometric 4-point spark diamond matrix with an amber center pip.
5. **Socials**: Dual interconnected network nodes with an amber signal link.
6. **Notes**: Technical clipboard/tablet glyph with an amber stylus tip.
7. **Resume**: Folded document sheet glyph with an amber credential seal.
8. **Terminal**: Monospace prompt glyph `>_` with a blinking amber block cursor.
9. **Settings**: Precision milled rotary dial with an amber index notch.

---

## 7. Window Chrome Specification

### 7.1 Active Window
- **Frame Border:** 1px solid `#3A424C`
- **Shadow:** `0 16px 44px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(229, 139, 36, 0.25)`
- **Title Bar:** 38px height, `#141618` fill, 1px bottom border `#22262B`
- **Title Text:** Switzer 13px medium, color `#EDEDEE`
- **Window Controls:** Left-aligned 12px tactile dots:
  - Close: `#E5484D` (Hover: reveals miniature `×` icon)
  - Minimize: `#E5A83B` (Hover: reveals miniature `−` icon)
  - Maximize: `#34B27B` (Hover: reveals miniature `+` icon)

### 7.2 Inactive Window
- **Frame Border:** 1px solid `#22262B`
- **Shadow:** `0 8px 24px rgba(0, 0, 0, 0.4)`
- **Title Bar:** `#111315` fill
- **Title Text:** Switzer 13px regular, dimmed to `#687076`
- **Window Controls:** Desaturated uniform `#3E444D`

---

## 8. Component Shortlist from 21st.dev per Need (design.md Section 5.4)

Every candidate has been audited against the slop filters in `antigravity.md` Section 3 and `design.md` Section 5.5:

| PRD Need | 21st.dev Category | Candidate Chosen | Reason & Fit | Required Re-skinning / Stripping |
| :--- | :--- | :--- | :--- | :--- |
| **Dock** | Docks | Dock by ibelick | Magnetic physics with clean hover interpolation | Remove zinc colors; strip heavy backdrop blur; snap icons to 40px squircle container; connect to Zustand window manager. |
| **Dev Studio File Tree** | File Trees | Shadcn File Tree / 21st Tree | Accessible ARIA tree structure with keyboard navigation | Replace generic file icons with minimalist SVGs; use Switzer for folders and JetBrains Mono for files; accent active item. |
| **Sidebars** | Sidebars | Minimal Collapsible Sidebar | Clean partition between navigator and case study | Apply `#1A1D20` surface panel; hairline dividers; zero rounded cards. |
| **Browser Tabs** | Tabs | Accessible Tab Bar | ARIA tablist with arrow-key switching | Remove pill shapes; render flat with 1px `#2C3138` borders and amber bottom indicator line on active tab. |
| **Browser Search** | Search Bars | Minimalist Search Input | Clean input with clear icon and shortcut badge | Style with `#141618` background, JetBrains Mono font for URLs, amber focus ring. |
| **Rudar AI Chat** | AI Chats | Clean AI Prompt Box & Chat | Auto-resizing textarea with clean message list | Strip chat bubble fluff; use clean line-delineated message layout; format suggested starters as token chips. |
| **Notifications** | Toasts | Toast Stack Primitive | Auto-dismiss, stack limit (max 3), ARIA live region | Re-skin to `#22262B` surface-raised; 1px border; 240ms slide-in motion. |
| **System & Context Menus** | Menus | Radix Dropdown Menu | Complete focus trapping and keyboard navigation | Re-skin with `radius-md`, `#22262B` background, 13px Switzer text, instant hover feedback. |
| **Tooltips** | Tooltips | Radix Tooltip Primitive | Deliberate hover delay, accessible screen-reader name | Re-skin with `radius-sm`, `#22262B` surface-raised, 11px Switzer text. |
| **Dialogs / Modals** | Modals | Radix Dialog Primitive | Focus lock, ESC close, accessible labeling | Re-skin with `radius-lg`, `#141618` surface-base, clean dark overlay `#0C0D0E/75`. |
| **Scroll Areas** | Scroll Areas | Radix ScrollArea | Custom unobtrusive scrollbar for cross-browser consistency | Thin 4px thumb in `#3A424C`, zero track background. |
| **Notes Form Inputs** | Inputs | Accessible Input / Textarea | Built-in label and validation state handling | Style with `#1A1D20` fill, `#2C3138` border, amber focus ring, character counter. |
| **Settings Controls** | Toggles | Radix Switch Primitive | Native keyboard toggle with ARIA switch role | Re-skin thumb and track to token dimensions and amber active fill. |
| **Loading States** | Spinners | Precision SVG Ring Loader | Clean single-circle SVG stroke animation | Use amber stroke on dark track; zero glowing particle effects. |
| **Empty States** | Empty States | Editorial Empty State | Clean heading + message + action layout | Restrained typographic layout; no cartoon illustrations. |
| **Case-Study Timeline** | Timelines | Minimal Axis Timeline | Vertical node progression for project milestones | Hairline axis in `#2C3138`, 6px amber node dots. |
| **Custom Cursor** | Cursors | *Default to Native Cursor* | System cursor is most dependable | Native cursor retained as default per Section 3.6 to guarantee zero lag and universal input reliability. |

---

## 9. Deliberate Non-Choices (What We Refuse to Do)

1. **No Bento Grids:** Bento grids have become generic AI portfolio boilerplate. Development Studio uses an authentic IDE layout (file tree + case study reading pane), and Browser uses an editorial start page gallery.
2. **No Purple/Blue Gradients or Aurora Effects:** The environment relies on motivated lighting from the monitor and rich dark slate/graphite neutrals. Zero decorative gradient blobs.
3. **No Glassmorphism Soup:** Backdrop blur is used solely for the top bar over the wallpaper. Windows and panels are solid, opaque, performant surfaces.
4. **No Cloned Apple / Windows UI Assets:** No candy buttons, no San Francisco typeface, no cloned dock aesthetics. Desktop conventions (title bars, dock, menus) are adopted for ergonomic usability, but the visual language is purely custom Rudar OS.
5. **No Fake Search Engine:** The Browser app does not spoof Google or fabricate web results. It searches Rudar's real projects first and hands off general queries to real search providers.
6. **No AI Marketing Hype:** Zero empty buzzwords ("passionate developer", "crafting digital experiences"). The copy speaks with quiet technical honesty.

---

## 10. Live Verification Route
A dev-only styleguide route is implemented at:
`/dev/styleguide`
Demonstrating every token, state (default, hover, focus, active, disabled, loading, empty, error), and the component shortlist live in the DOM.
