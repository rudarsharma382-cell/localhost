# ANTIGRAVITY.md

Master rules for the agent building **Rudar OS**.

Read this file once at the start of every session. Absorb it, then move on and build. Do not summarize it back to me, do not ask me to confirm it, do not quote it in your replies.

The PRD is the source of truth for what the product does. This file is the source of truth for **taste, restraint, and how to work**.

---

## 1. What this is

Rudar OS is a personal portfolio that works like a custom operating system. A 3D desk scene is the login. After login, the camera moves into the screen and the visitor lands in a real windowed desktop made of normal DOM, with apps that each show a different side of me.

It is a creative piece, not a job application. No copy like "open to opportunities", "hire me", or "available for work". It should feel like a thoughtfully made product with a point of view, built by one person with taste.

The 3D computer is the entry point, not the product. The OS is the product.

---

## 2. What I want

- **A real identity.** One clear visual language for the whole OS. If you cover the logo, it should still look like Rudar OS and not like any other portfolio.
- **Calm and confident.** No drama, no gimmicks, no trying too hard. The work and the craft do the talking.
- **Believable OS behavior.** Windows that drag, focus, stack, minimize, maximize and close properly. Dock that reflects what is open. This is what sells it, so build it early and build it solid.
- **Live work, not screenshots.** The Browser app loads my real projects. If a site blocks iframes, open it in a dedicated view or a new tab. Never fake it with images.
- **Every app has a reason to exist.** Each one reveals something real about me. If an app has no purpose, cut it.
- **Restraint.** Fewer things, done properly. One detail polished to an obsessive level beats ten things that are fine.
- **Fast.** Lazy-load apps and heavy assets. Light 3D. Reduced-motion support. A 2D fallback for weak devices and mobile.
- **Content driven by data.** Profile, projects, socials and the assistant's knowledge live in data files, so adding a project means adding data, not editing components.
- **Take components from : "https://21st.dev/community/components"**

---

## 3. What I do NOT want (AI slop list)

If you catch yourself doing any of these, stop and redo it.

### Layout and components

- No generic card grids. No 3-up feature rows. No "icon in a circle, bold title, two grey lines" cards.
- No bento grids used as a default answer to "what layout should this be".
- No every-section-is-a-centered-hero structure.
- No same radius, same shadow, same padding on everything. Use a deliberate system with variation where it matters.
- No dashboard clutter: no random stat counters, badges, pills or tags added to fill space.

### Colors and effects

- No purple/blue gradients. No gradient text on headings.
- No glassmorphism on everything. Use blur only where it has a functional reason (for example a menu bar over a wallpaper).
- No glowing neon blobs, aurora backgrounds, floating orbs, grain-overlay-because-trendy, or particle backgrounds.
- No dark-mode-plus-neon-accent as a substitute for identity.
- Limited palette: a neutral base, one accent, and clear semantic colors. Defined once as tokens, never ad hoc hex values in components.

### Typography

- Do not use Inter, Roboto, Arial, Poppins, Montserrat, Open Sans, Lato, or the browser default as the identity of the site.
- Do not default to Space Grotesk either, it has become the new AI default.
- Pick a deliberate pairing: one display face, one text face, one mono. Three families maximum.
- Load fonts properly (self-host or Fontshare/Google), with sensible fallbacks and no layout shift.
- Starting points to evaluate, not mandates: Instrument Serif, Fraunces, Satoshi, General Sans, Switzer, Cabinet Grotesk, JetBrains Mono, IBM Plex Mono, Commit Mono. Propose your choice with a one-line reason before using it.

### Icons and imagery

- No emojis as icons or decoration.
- No default Lucide/Heroicons dropped in unchanged for the dock or app icons. App icons need a consistent custom treatment so the dock feels like one OS.
- No stock photos, no placeholder avatars, no lorem ipsum, no "John Doe".
- No fake previews of projects. Real sites or nothing.

### Motion

- No fade-up-on-scroll on every element. No hover-scale on every card. No bouncing, wobbling, or floating loops.
- Motion must have a job: window open, minimize, maximize, login transition, notification, dock feedback. Keep durations short and consistent, defined as tokens.
- Respect `prefers-reduced-motion`.

### Copy

- Ban these phrases and anything like them: "Welcome to my portfolio", "Passionate developer", "Crafting digital experiences", "Cutting-edge", "Seamless", "Elevate", "Unleash", "Innovative solutions", "Journey".
- Write like a person talking. Short, direct, specific.
- Never invent facts. No fake stats, testimonials, awards, or numbers. The only verified achievement so far is SafeWare reaching Top 140 at the Delhi AI Grand Hackathon. If a fact is missing, leave a clearly marked TODO in the data file and tell me. Do not fill it in.

### Product

- Do not clone macOS or Windows. No Apple logos, no SF Pro, no copied icon sets. Take usability conventions only.
- Do not add features, apps, or "nice extras" that are not in the PRD. Ask first.
- Do not build the fake Google lookalike search page.
- Do not collect real passwords. The login is a simulation.

---

## 4. Identity gate (do this once, before building UI)

Before writing any UI, produce a short design proposal and wait for my approval **once**:

- Palette (5 colors max, with the accent), as tokens
- Font pairing with reasons
- Spacing scale, radius scale, shadow rules
- Motion durations and easing
- Icon style for the dock
- A one-paragraph description of what Rudar OS feels like

After I approve it, do not ask again. Implement it as a single tokens file (`src/styles/tokens.ts` plus Tailwind theme) and use only those tokens everywhere.

---

## 5. Technical rules

- **Stack:** Next.js, TypeScript, Tailwind, React Three Fiber and Drei for the 3D scene, Framer Motion for UI motion, Zustand for window manager state. Change this only with a good reason, and tell me why.
- **Two layers:** 3D is only for the login scene. After login, swap to a normal DOM desktop. Do not try to render interactive HTML inside the 3D scene.
- **Window manager first.** Drag, focus, z-order, minimize, maximize, close, and dock sync. Build and test this before any app content.
- **Content in data files:** `content/profile`, `content/projects`, `content/socials`, `content/knowledge`. Components read from these.
- **Assistant:** start rule-based with a knowledge base and fuzzy matching. Unknown question means an honest "I don't have that", never a guess. It must say it is the portfolio assistant and never pretend to be me. LLM integration only later, server-side, with rate limiting.
- **Security:** no API keys or credentials in client code. Sanitize and validate all visitor input (Notes). Never render user HTML. External links use `rel="noopener noreferrer"`.
- **Performance:** keep the 3D model small (target under 5 MB), compress textures, lazy-load every app, show loaders and error states. No blank windows ever.
- **Accessibility:** keyboard navigation, visible focus, readable contrast, labeled controls, reduced-motion support.
- **Skip intro** button on the 3D login, and a 2D fallback from day one.

---

## 6. Build order

1. Project setup, tokens, content data files
2. Desktop shell: top bar, dock, wallpaper
3. Window manager
4. Core apps: Browser (real projects), Development Studio, About Me, Socials
5. Basic assistant (rule-based)
6. 3D login scene and camera transition, plus 2D fallback
7. Polish: performance, mobile, accessibility, deploy

Should-haves (Notes, Resume, Terminal, Settings, 3D keyboard) come only after the above works. The 3D keyboard is last.

---

## 7. How to work with me

- Build, don't narrate. Short updates: what changed, what is next, anything blocked.
- Make small decisions yourself. Ask me only when a choice changes the identity, scope, or cost.
- Do not rewrite working files without a reason. Small, focused changes.
- Run it and check it before saying it is done. Fix console errors and type errors.
- When something is not possible (for example an iframe blocked by a site), say so plainly and use the fallback in the PRD.
- Keep the code clean and boring. No clever abstractions that only you understand.

---

## 8. The slop test

Before you finish any screen or component, ask:

1. Could this belong to any other portfolio? If yes, redo it.
2. Is there anything here that exists only to look busy? Remove it.
3. Does every color, font, radius and duration come from the tokens? If not, fix it.
4. Would a person who cares about craft be embarrassed by this? If yes, fix it.

---

## 9. Verified facts you may use

- Name: Rudar Sharma. Flutter and app developer.
- LinkedIn: https://linkedin.com/in/rudarsharma-dev/
- GitHub: https://github.com/rudarsharma382-cell
- Portfolio: https://rudar.vercel.app/
- Instagram: https://www.instagram.com/codealchemist_07/
- Projects (details come from the content files, do not embellish): SafeWare, TruSight AI, AfterClass, WorldOS, Zetklo, 3D automotive website.
- Achievement: SafeWare, Top 140, Delhi AI Grand Hackathon.

Anything not listed here or in the content files is unknown. Do not make it up.
