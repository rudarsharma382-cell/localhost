# DESIGN.md

Design direction for **Rudar OS**, plus the rules for sourcing UI components from 21st.dev.

Read order for the agent: `antigravity.md` (bans and working rules), then `PRD.md` (what to build and how it behaves), then this file (how it should look and feel).

**Precedence:** the bans in `antigravity.md` always win. This file decides every visual question the PRD leaves open. Nothing here is permission to skip the Gate 1 identity approval defined in the PRD.

---

## 1. Design thesis

Rudar OS should feel like **a well-made tool, not a showcase.**

It is a custom operating system with its own personality. The visitor should think "someone cared about every detail here", not "wow, so many effects". Calm confidence, precision, and a sense of touch. The work inside the windows is the star. The chrome stays quiet.

Three words to design against: **quiet, precise, tactile.**

Anti-words (if a screen feels like these, redo it): _flashy, busy, glossy, generic, trendy, templated._

### The two moods

| Space                       | Mood                                                        | Density             |
| --------------------------- | ----------------------------------------------------------- | ------------------- |
| The 3D room and lock screen | Atmospheric, warm, still. A moment of calm before the work. | Sparse              |
| The desktop and apps        | Utilitarian, clear, efficient. A place to get around.       | Compact and orderly |

They must still feel like the same world: shared palette, shared material language, wallpaper continuity from the monitor into the desktop.

---

## 2. Principles

1. **Content leads, chrome follows.** Window frames, bars and docks are low-contrast supporting structure. Project content gets the contrast and the space.
2. **One idea per surface.** Each window answers one question. No window tries to be a dashboard.
3. **Hierarchy through type and space, not boxes.** Prefer spacing, weight and size to borders and containers. If everything sits in a card, nothing stands out.
4. **Physical consistency.** Same title bar height, same control placement, same focus treatment, same shadow behavior, everywhere. A visitor learns the system once.
5. **Depth is earned.** Three elevation levels at most (base, raised, floating). Each has a defined purpose. No shadow soup.
6. **Motion explains.** Movement shows where something came from or went. It is short, consistent, and never decorative.
7. **Restraint beats range.** A smaller set of well-built parts, used consistently, beats a large set of impressive ones.

---

## 3. Visual language

These are constraints the Gate 1 proposal must fit inside. The agent chooses the exact values and proposes them for approval.

### 3.1 Color

- A neutral base scale, **one** accent, and clear semantic colors (success, warning, error, info).
- The accent is reserved for focus, selection, active state and the single most important action in a view. It is never used as decoration.
- Ship **one theme, done excellently.** A second theme is a [COULD].
- Define everything as tokens (surface levels, text levels, border levels, accent, semantic). No raw hex in components.
- Text contrast meets WCAG AA on every surface, including over the wallpaper.
- Wallpaper must not reduce legibility of desktop icon labels or the top bar.

### 3.2 Typography

- Maximum **three families:** one display, one text, one mono. Chosen deliberately and justified at Gate 1.
- Defined roles:
  - **Display:** lock screen clock and name, case-study titles, the OS wordmark.
  - **UI:** labels, menus, buttons, window titles. Small, clear, highly legible.
  - **Reading:** case-study and About text. Comfortable line length (about 60 to 75 characters), generous line height.
  - **Mono:** terminal, code, metadata, tech-stack labels.
- A fixed type scale as tokens. No one-off font sizes.
- Fonts are self-hosted or loaded properly with fallbacks. No layout shift.
- The banned-font list in `antigravity.md` applies.

### 3.3 Space, shape and surface

- One spacing scale (4 px base grid). One radius scale with at most three steps, applied by role (controls, panels, windows). Not the same radius on everything.
- Surfaces: **wallpaper, window, panel (inside a window), floating (menus, popovers, toasts).** Each has a defined fill, border and shadow.
- Borders are hairline and low contrast. Shadows are soft and few.
- Blur and translucency only where they have a functional reason (for example, the top bar over the wallpaper), and only if performance holds.

### 3.4 Iconography

- **One consistent icon system** for UI actions: same grid, same stroke weight, same corner treatment. If an icon library is used for small UI icons, it is restyled consistently and never used for app icons.
- **App icons are a custom set** with a shared construction rule (shape language, proportions, stroke, color use). Designed once, applied to all nine apps. They must read clearly at dock size.
- Icons always have a text label somewhere (hover label, tooltip or visible text) and an accessible name.
- No emoji as icons.

### 3.5 Motion

Starting values for the Gate 1 proposal (the agent may adjust with a reason):

| Token   | Duration       | Use                                   |
| ------- | -------------- | ------------------------------------- |
| instant | 90 ms          | hover, press feedback                 |
| quick   | 160 ms         | menus, tooltips, toggles              |
| base    | 240 ms         | window open/close, notifications      |
| slow    | 400 ms         | desktop reveal, full-screen site mode |
| scene   | 900 to 1400 ms | camera push into the monitor          |

- Two easing curves only: one for entering (decelerate), one for moving (standard).
- Window open: small scale-up plus fade. Minimize: shrinks toward its dock icon. No overshoot or bounce, except possibly a very small dock hover response if it earns its place.
- Respect reduced motion everywhere (replace movement with a short fade).
- No looping ambient animation on the desktop.

### 3.6 Cursor

Default to the system cursor. A custom cursor is allowed only if it is subtle, accurate (same hotspot), has clear hover and press states, and falls back to native on touch, reduced motion, and over inputs. No trailing or following effects.

---

## 4. Surface-by-surface design intent

Behavior lives in the PRD. This section describes how each surface should _feel_.

### The room (3D)

A real, quiet space. Motivated light from the monitor, a soft contact shadow under objects, restrained materials. No clutter. If a prop is not tied to light or a real fact about me, it is not there. The wallpaper on the monitor matches the desktop wallpaper so the push-in lands invisibly.

### Lock screen

My avatar and name as the machine owner, a clear large clock in the display face, and two inputs: _Who's visiting?_ and the simulated password field with the honest helper text. Generous space, one clear primary action, a visible Skip intro. It should feel like a real OS lock screen made by someone with taste.

### Desktop and top bar

Wallpaper dominates. The top bar is thin and quiet and holds only real information. Desktop icons are few, aligned to a grid, with legible labels.

### Dock

One coherent row of custom icons. Clear open and minimized indicators, hover labels, and a restrained hover response. It should feel solid and dependable, not playful.

### Window chrome

A single consistent frame. Clear **active vs inactive** window styling (so focus is always obvious). Title bar controls are real buttons with obvious hit areas. Drag handle is the title bar. Resize handles are generous but invisible until needed.

### Development Studio

An IDE-like navigator: file tree on the left, a clean case study on the right. Reading-first typography, mono for stack and metadata, media displayed with care and plenty of room. No cards, no grids.

### Browser

A believable browser chrome: tabs, address bar, simple controls. The start page is a considered list or gallery of my live projects with previews, not a uniform wall of identical cards. The "Open in new tab" control is always visible. Full-screen site mode shows only a slim top strip.

### About Me

Editorial and personal. A strong type moment, my avatar, short paragraphs in my own voice. It should read like a page from a person, not a profile template.

### Rudar AI

A clean chat: clear distinction between visitor and assistant messages without bubbles-for-the-sake-of-bubbles, readable line length, suggested questions as simple chips, a calm typing indicator. Links inside answers look like links.

### Socials

A short, typographic list. Each entry has a custom icon, a label, one line of description, and a clear external-link marker. No logo walls.

### Notes

A quiet form: three fields, a disclosure line, a clear success state. It should feel like leaving a message on a desk, not filling in a contact form.

### Resume

A clean PDF viewer with a prominent Download action and my public profile links.

### Terminal

Mono type, strong contrast, a slow steady cursor, clear command output. Themed to the identity, not a green-on-black cliché.

### Settings, notifications, launcher

Functional and compact. Toasts are small, stack neatly and disappear on their own. The launcher is a focused, keyboard-first panel with clear selection state.

---

## 5. Sourcing components from 21st.dev

**Source:** https://21st.dev/community/components

### 5.1 What it is

21st.dev is a community library of React components (Tailwind-based) made by designers and developers. The page describes thousands of components, templates, themes and apps, and says each component runs live, has an author, and can be copied as a prompt for a coding agent. It also lists a CLI and MCP at https://21st.dev/mcp. Read that page for current setup instructions rather than guessing commands.

### 5.2 The rule

> **21st.dev is a parts bin, not a design direction.**

Use it to save time on the hard, fiddly parts (accessible menus, docks, trees, toasts, tabs, inputs). Do **not** let it decide how Rudar OS looks. Every component, no matter how nice it looks on its page, is re-skinned into this project's tokens before it ships.

The library's own front page shows many of the exact things `antigravity.md` bans: aurora backgrounds, bento grids, sparkle effects, spotlight cards, liquid-glass and liquid-metal buttons, animated gradient and shader backgrounds, pricing and testimonial blocks, feature sections. Treat the front page as a list of what to avoid, not what to copy.

### 5.3 Process (follow for every component)

1. **Need first.** Name the UI part you need and which PRD app or OS surface it serves. If you cannot, do not add it.
2. **Check primitives.** If a well-supported accessible primitive already covers it (for example Radix-based), prefer building on that.
3. **Search the right category** (table below). Shortlist at most **three** candidates by opening their live pages.
4. **Run the filters** (5.5). Reject anything that fails.
5. **Install** using the method the component page and https://21st.dev/mcp describe.
6. **Re-skin to tokens.** Replace every hard-coded color, font, radius, shadow and duration with project tokens. Remove default shadcn/zinc styling and any default font.
7. **Strip extras.** Delete decorative effects, unused variants, demo content and unnecessary dependencies.
8. **Verify.** Keyboard operable, visible focus, reduced motion respected, screen-reader names present, no layout shift, bundle impact checked, works in lite mode.
9. **Log it** in `COMPONENTS.md` (5.7).

### 5.4 Where to look, by need

| Need in Rudar OS                      | 21st.dev category              | Link                                                |
| ------------------------------------- | ------------------------------ | --------------------------------------------------- |
| Dock                                  | Docks                          | https://21st.dev/community/components/s/dock        |
| Dev Studio file tree                  | File Trees                     | https://21st.dev/community/components/s/file-tree   |
| Sidebars (navigator panes)            | Sidebars                       | https://21st.dev/community/components/s/sidebar     |
| Browser tabs                          | Tabs                           | https://21st.dev/community/components/s/tabs        |
| Browser address and launcher search   | Search Bars                    | https://21st.dev/community/components/s/search      |
| Rudar AI input and chat               | AI Chats                       | https://21st.dev/community/components/s/ai-chat     |
| Notifications                         | Toasts, Notifications          | https://21st.dev/community/components/s/toast       |
| System menu, context menus            | Menus, Dropdowns               | https://21st.dev/community/components/s/menu        |
| Tooltips and popovers                 | Tooltips, Popovers             | https://21st.dev/community/components/s/tooltip     |
| Dialogs                               | Dialogs / Modals               | https://21st.dev/community/components/s/modal       |
| Scrolling regions                     | Scroll Areas                   | https://21st.dev/community/components/s/scroll-area |
| Notes form fields                     | Inputs, Text Areas, Selects    | https://21st.dev/community/components/s/input       |
| Settings controls                     | Toggles, Sliders, Radio Groups | https://21st.dev/community/components/s/toggle      |
| Loading states                        | Spinner Loaders, Progress      | https://21st.dev/community/components/s/spinner     |
| Empty states                          | Empty States                   | https://21st.dev/community/components/s/empty-state |
| Case-study timeline (if useful)       | Timelines                      | https://21st.dev/community/components/s/timeline    |
| Custom cursor (only if it passes 3.6) | Cursors                        | https://21st.dev/community/components/s/cursor      |
| Lock screen inspiration only          | Sign Ins                       | https://21st.dev/community/components/s/sign-in     |

Examples visible on the library's front page that are worth _evaluating_ (not pre-approved): the **Dock** by ibelick, **Expandable Tabs**, **Sidebar**, **AI prompt Box**. Open each, judge it against 5.5, and re-skin it or reject it.

### 5.5 Filters: a component is rejected if any of these is true

- It is on the ban list in `antigravity.md` (card grids, bento, gradients, glass everywhere, glow, aurora, sparkles, particle or shader backgrounds, gradient text, hover-scale everything).
- It belongs to a marketing-site genre: **Heroes, Features, Pricing, Testimonials, Logo clouds, CTAs, Footers, Clients, Team sections.** Rudar OS is an operating system, not a landing page.
- Its look cannot be fully replaced by our tokens without rewriting it.
- It adds a heavy dependency for a single effect.
- It runs a continuous animation with no functional purpose.
- It is not keyboard accessible or ignores reduced motion and cannot be fixed cheaply.
- Its license or authorship is unclear.
- It would still look like "a 21st.dev component" after re-skinning.

### 5.6 Dependency hygiene

- Keep the dependency list short. Before adding a package a component needs, check whether we already have an equivalent.
- One animation library only (Framer Motion or its current equivalent). Do not add a second.
- One icon approach for UI icons. Do not mix libraries.
- Check bundle impact for every component. Anything that blows the budgets in the PRD gets simplified or dropped.
- Lazy-load app-specific components with their app.

### 5.7 Attribution and ledger

Create and maintain `COMPONENTS.md` at the repo root. For every component taken from 21st.dev record: component name, author, source URL, which app or surface uses it, what you changed, and the license or usage terms stated on its page. If terms are not clear, do not use it. Credits appear in **Settings > About Rudar OS**.

### 5.8 Account and limits (for Rudar)

The library page says a free account can copy two prompts a day. So the agent should **decide what it needs first, then copy deliberately**, in batches, rather than browsing and copying freely. Rudar creates the free account and, if wanted, sets up the CLI/MCP from https://21st.dev/mcp so the agent can pull components directly.

Do not use any generator to produce whole screens. Components only.

---

## 6. Gate 1 deliverable

Before building UI, produce `DESIGN_PROPOSAL.md` and a dev-only route (`/dev/styleguide`, excluded from production) that shows the system live.

The proposal contains:

1. **Feeling in one paragraph:** what Rudar OS looks and feels like, in plain words.
2. **Palette:** neutrals, the one accent, semantic colors, as tokens, with contrast results.
3. **Typography:** the three families, why each, the scale, sample of each role.
4. **Space, radius, elevation:** the scales and where each is used.
5. **Motion:** the duration and easing tokens.
6. **Icon system and app icon construction rule,** with the nine app icons drafted.
7. **Window chrome:** active and inactive states, controls, title bar.
8. **Component shortlist** from 21st.dev per need (5.4), with the one you chose, why, and what you will change.
9. **What you deliberately chose not to do,** and why.

The styleguide route shows every token and every component in these states: default, hover, focus, active, disabled, loading, empty, error.

I approve once. After that, tokens are law.

---

## 7. Design QA checklist (before calling any screen done)

- [ ] Passes the slop test in `antigravity.md` Section 8.
- [ ] Contains zero raw hex values, zero hard-coded font families, zero magic numbers for radius or duration (search for them).
- [ ] Looks right at a small laptop, a large desktop and a phone (lite mode).
- [ ] Every interactive element has default, hover, focus-visible, active, disabled, loading and error states where relevant.
- [ ] Keyboard-only run-through works. Focus is always visible.
- [ ] Reduced motion tested.
- [ ] Text contrast checked over the wallpaper and over every surface.
- [ ] Empty, loading and error states are designed, not default.
- [ ] Any 21st.dev component used is re-skinned, stripped, tested and logged in `COMPONENTS.md`.
- [ ] No effect exists purely to look impressive.

---

## 8. One-line summary for the agent

Build a calm, precise, tactile operating system. Use 21st.dev for parts, never for personality. Everything flows from tokens, and everything has a reason.
