# RUDAR OS: Product Requirements Document (Agent Build Spec)

**Version:** 2.0 (agent-ready)
**Owner:** Rudar Sharma
**Status:** Approved for build
**Companion file:** `antigravity.md` (taste, bans, working rules). Read it first, every session.

---

## 0. How to read this document

- **Precedence:** `antigravity.md` > this PRD > your own assumptions.
- This PRD supersedes v1. The architecture questions from v1 are answered in Section 2. Do **not** return a long analysis and wait for approval. Build.
- You stop and wait for me at exactly two points: **Gate 1 (identity)** and **Gate 2 (vertical slice)**. Both are defined in Section 20. Everywhere else, keep going and report briefly.
- Priority tags: **[MVP]** must ship. **[SHOULD]** ships if the MVP is solid. **[COULD]** only after everything else is polished.
- Never invent content. If a fact, text, image or link is missing, use the content-file TODO mechanism (Section 11) and list it for me. Do not fill it in.
- If something is technically impossible, use the fallback written here and tell me in one line.

---

## 1. Concept

Rudar OS is a personal portfolio that is a working operating system.

A visitor lands in a quiet 3D room with a computer on a desk. They log in. The camera moves into the screen and they are inside a custom desktop with windows, a dock, and real apps. Each app shows a different side of me. The Browser opens my actual live projects. An assistant answers questions about my work.

> "You are not visiting a portfolio. You are using Rudar's computer."

### Experience pillars

1. **Believable.** Windows, dock, focus and keyboard behave like a real OS. This is what sells it.
2. **Calm.** Confident and restrained. No drama, no gimmicks, nothing that tries too hard.
3. **Real work, live.** Projects run live, not as screenshots.
4. **Every app earns its place.** If an app does not reveal something real about me, it is cut.
5. **Fast and accessible.** The 3D is never allowed to make the site slow, broken, or unusable.

### Visitor promise

- Within 10 seconds: "this is a computer I can use."
- Within 60 seconds: "I just opened a live project and it works."
- Never: "how do I get out of this?"

### Audience

Developers, collaborators, hackathon organizers and judges, and curious visitors. Technical and non-technical. No copy aimed at recruiters, and no "hire me" language anywhere.

---

## 2. Resolved decisions (v1 questions answered)

| #   | Question                  | Decision                                                                                                           | Reason                                                                               |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 1   | Where does 3D live?       | **Only in the login scene.** After login, everything is normal DOM.                                                | Interactive HTML inside 3D is slow and fragile. The OS is the product.               |
| 2   | Build order               | **OS first, 3D last** (before polish).                                                                             | The OS must be fully usable in lite mode before any 3D exists. De-risks the project. |
| 3   | Assistant                 | **Rule-based, intent and entity matching.** LLM only as a later, gated phase.                                      | No cost, no hallucination, predictable.                                              |
| 4   | Backend                   | **Only Notes** (Supabase or Neon, via Next.js route handlers). Everything else is static.                          | Smallest attack surface.                                                             |
| 5   | Stack                     | Next.js (App Router), TypeScript strict, Tailwind, React Three Fiber + Drei, Framer Motion, Zustand, zod, Fuse.js. | Mainstream, well documented, fits the agent.                                         |
| 6   | 3D assets                 | **Build the scene from code primitives first.** Swap in an optimized GLB only if it clearly improves things.       | No dependency on an asset I do not have. Licensing stays clean.                      |
| 7   | Mobile and weak devices   | **Lite mode is first-class**, not an afterthought. Same apps, full-screen app model, no 3D.                        | Must never break.                                                                    |
| 8   | 3D keyboard               | **[SHOULD], built last.**                                                                                          | Costly, cute, never required.                                                        |
| 9   | Window layout persistence | **None.** Every visit starts clean. Only settings persist locally.                                                 | Simpler, more predictable.                                                           |
| 10  | Browser embedding         | **Server-side embeddability check** plus fallback. See Section 9.                                                  | Iframe blocking is the biggest technical risk.                                       |

---

## 3. The experience, beat by beat

### Beat 0: Loading

- The loader is the OS starting up, not a generic spinner. Small, quiet, in the identity's style.
- Show real progress (asset loading), not a fake bar.
- A visible **"Skip to lite mode"** link is present from the first frame.
- The critical path (shell and loader) must render before any 3D code downloads.

### Beat 1: The room

- A calm 3D scene: desk, monitor, keyboard, mouse. The screen glows and shows the lock screen.
- The camera has a very subtle idle drift or pointer parallax (max about 2 degrees). Disabled for reduced-motion and touch.
- Lighting is motivated: the monitor lights the desk. Nothing glows for decoration.
- No instructions. The login UI on the monitor is obvious enough.

### Beat 2: Login

- The lock screen belongs to **Rudar's machine**: my avatar and name show as the machine owner.
- The visitor sees a field: **"Who's visiting?"** (optional, defaults to "Guest") and a password field.
- The password field is a **simulated interaction**. Helper text is honest: _"Any password works. Please don't type a real one."_ Nothing typed is sent, stored, or logged. The password value is discarded immediately.
- The visitor name lives in memory only (session state). It is never sent to a server unless they submit a Note, and the Notes form discloses that.
- Enter or the Log in button proceeds. **Skip intro** is always visible.
- Physical keyboard always works. **[SHOULD]** the 3D keyboard also works and stays in sync (Section 5).

### Beat 3: Push into the screen

- The camera dollies toward the monitor (900 to 1400 ms, eased) until the screen fills the viewport exactly.
- The 3D scene's screen content and the real DOM desktop are aligned so the crossfade is invisible (about 150 ms).
- Then the 3D canvas is **unmounted and fully disposed** to free the GPU (Section 5.4).
- Reduced motion: skip the camera move, use a short fade.

### Beat 4: First moments on the desktop

- Wallpaper first, then top bar, then dock, in a short staggered reveal (under 400 ms total).
- One welcome notification: _"Welcome, {name}."_ Nothing else. No tutorial, no tooltips pulsing, no tour.
- Nothing opens automatically. The visitor chooses what to explore.

### Beat 5: Using it

- The visitor opens apps, moves windows, switches focus, opens a live site, asks the assistant questions.
- The OS never traps them. Every full-screen state has an obvious way back (Section 9).

### Beat 6: Leaving gracefully **[SHOULD]**

- System menu has **Log out**. Full mode: the camera pulls back into the room. Lite mode: returns to the lock screen.
- Closing the browser tab needs no ceremony.

---

## 4. Visual identity

The identity is defined **once**, at Gate 1, and then enforced through tokens. See `antigravity.md` Sections 3 and 4.

Requirements for the identity itself:

- It must feel like a **custom OS with its own personality**. Not macOS, not Windows, not a game menu, not a sci-fi dashboard.
- It borrows desktop conventions (windows, dock, top bar) for usability, never Apple's assets, icons, logo or typeface.
- Everything is token-driven: color, type, spacing, radius, shadow, motion duration and easing, z-index layers, icon stroke.
- The 3D room, the lock screen and the desktop must clearly belong to the same world (same palette, same materials language, same wallpaper continuity).
- The dock icons form **one coherent custom set**. No default icon-library icons dropped in unchanged.

---

## 5. 3D login scene

### 5.1 Contents

- **Required:** desk surface, monitor with the login on the screen, keyboard, mouse.
- **Props:** at most three, and each must be either motivated by lighting or tied to a real fact about me from the content files. If I have not provided a real fact, add no prop. No decorative plants, mugs or random objects.
- **Lighting:** one key light, screen glow (emissive plus a soft point light), baked or faked contact shadow. No real-time shadow maps beyond one. No post-processing stack.
- **Environment:** procedural or a tiny HDR (200 KB or less), or none.

### 5.2 Login on the monitor

Render the login UI with Drei `<Html transform>` (or an equivalent that keeps real DOM inputs). This keeps real inputs, real focus, real accessibility and real text rendering. Do not draw the login as a flat texture.

### 5.3 Camera and interaction

- Camera is fixed-position with the subtle drift above. No orbit controls for visitors.
- Clicking the monitor focuses the login. Hovering keys gives feedback.
- All camera moves are driven by a single timeline, defined by tokens (duration, easing).

### 5.4 Disposal (required)

After the handoff:

- Unmount `<Canvas>`.
- Dispose geometries, materials and textures.
- Call renderer dispose and force context loss.
- Verify in dev tools that GPU memory is released and no animation loop keeps running.

### 5.5 3D keyboard **[SHOULD]**

- Every key is an individual mesh with a press animation (translate down, spring back).
- Click or tap a key: types into the focused field. Physical key: the matching 3D key animates and the field updates. Mouse and physical input stay in sync.
- Backspace, Enter, Shift, Space and basic punctuation work.
- It is a bonus input method. The login must be fully usable without ever touching it.

### 5.6 Budgets

- Total 3D payload: **5 MB or less** (geometry plus textures). Use Draco or Meshopt for geometry and WebP or KTX2 for textures, max 2048 px.
- Device pixel ratio clamped to **1.5** (2 on a confirmed high tier).
- Use on-demand rendering where possible (`frameloop="demand"`) with explicit invalidation during motion.
- Target **60 fps** on mid-range integrated graphics. If the first 60 frames average slower than about 24 ms, show a gentle "Switch to lite mode" prompt.

---

## 6. OS core

### 6.1 Layers

- **Top bar:** system menu (About Rudar OS, Settings, Log out), focused app name, and on the right only **real** indicators: clock, sound toggle, online status from `navigator.onLine`. No fake Wi-Fi or battery icons.
- **Desktop:** wallpaper, desktop icons, the window layer.
- **Dock:** pinned apps, open indicators, hover labels, minimized windows.
- **Notifications:** toast stack (max 3, auto-dismiss about 5 s, dismissible, announced to screen readers via live region).
- **Launcher [SHOULD]:** `Cmd/Ctrl + K` opens a quick launcher that lists apps, projects and terminal-style commands. It is also the keyboard-first path through the whole OS.

### 6.2 Window manager **[MVP, build first]**

State per window (Zustand): `id`, `appId`, `title`, `x`, `y`, `w`, `h`, `z`, `minimized`, `maximized`, `prevBounds`, `focused`.

Behavior:

- Open, focus, drag, resize (where the app allows), minimize, maximize, restore, close.
- Focus raises the window to the top. Z-order is deterministic and tested.
- Drag uses pointer events with pointer capture. A window can never be dragged so far that its title bar is unreachable (clamp to viewport).
- Double-click the title bar toggles maximize.
- New windows cascade from a sensible origin and never open off-screen.
- Each app declares in the registry: `defaultSize`, `minSize`, `singleInstance`, `resizable`.
- Minimize animates toward its dock icon. Clicking the dock icon restores it.
- Dock shows an indicator for open apps and a different state for minimized.
- Windows are keyboard operable: title bar controls are real buttons, focus order is sane, `Esc` closes menus and the launcher (not windows).
- Window animations have a functional purpose and use token durations. Honor reduced motion.

### 6.3 App registry

A single typed registry defines every app: `id`, `title`, `icon`, `defaultSize`, `minSize`, `singleInstance`, `tier` (mvp/should/could), and a lazily imported component. Adding an app means adding one registry entry.

### 6.4 AppFrame abstraction

Every app renders inside an `AppFrame`. In full mode it is a draggable window. In lite mode it is a full-screen page with a back control. Apps never know which one they are in. This is how mobile works without a second codebase.

---

## 7. Applications

All apps share: recognizable icon, title, opening animation, consistent controls, and **loading, empty and error states** (Section 17). All content comes from the content layer (Section 11).

### 7.1 Development Studio **[MVP]**

**Purpose:** explain _how_ projects were built. (The Browser shows the product itself.)

**Layout:** an IDE-like navigator, **not a card grid**. Left sidebar lists projects as a file tree. The main pane renders the selected project as a clean case study. Breadcrumb and tabs for open projects.

Per project: name, one-line description, problem, why it exists, main features, tech stack, my contribution, media (images or video), repo link if public, live link if available, achievements if real.

Initial projects (details come from content files, do not embellish):

- **SafeWare:** AI-based road safety project (computer vision). Achievement: Top 140, Delhi AI Grand Hackathon.
- **TruSight AI:** AI media authenticity detection, multiple-model analysis and aggregation, offline fallback.
- **AfterClass:** school-focused app: homework discussions, teacher uploads, class-specific experience.
- **WorldOS:** real-time global data visualization with an interactive 3D globe and multiple data layers.
- **Zetklo:** e-commerce product.
- **3D automotive website.**

A button on each project opens it in the Browser app. No invented statistics, ever.

### 7.2 Browser **[MVP]**

**Purpose:** let visitors use the real products.

- Address bar, back, forward, reload, tabs, and a **start page** listing my live projects (a considered list or gallery, not a uniform card grid).
- Each start-page entry: name, preview image, one-line description, Open button. Preview images are **static captures generated by a script** (Section 9.3). The page that opens is always the live site.
- Search box: searches my projects and content first. For general web search, it hands off to a real search provider URL in a new tab. **Do not** imitate any search engine's interface and **do not** fabricate results.
- Full behavior in Section 9.

### 7.3 About Me **[MVP]**

A personal profile app: avatar, short introduction, background, interests, current learning, selected experiences, personal philosophy.

**The copy must be written by me.** You build the structure and render `content/about.md`. If it is empty, show the TODO marker in dev and a clean minimal state in production. Do not write my bio.

### 7.4 Rudar AI (assistant) **[MVP, rule-based]**

Full spec in Section 10.

### 7.5 Socials **[MVP]**

A short, clean list of public profiles with custom icons, labels, one-line descriptions, and a clear external-link indicator.

- LinkedIn: https://linkedin.com/in/rudarsharma-dev/
- GitHub: https://github.com/rudarsharma382-cell
- Portfolio: https://rudar.vercel.app/

All external links use `target="_blank"` with `rel="noopener noreferrer"`. More profiles are added through the content file only.

### 7.6 Notes (guestbook) **[SHOULD]**

A simple way to leave a message.

- Fields: name (optional), message (required), category (feedback, collaboration, general).
- Disclosure above the form: _"Your name and message are stored so Rudar can read them."_
- Success state, failure state, and a clear empty state.
- Backend rules in Section 12.
- Visitors **cannot read other people's notes**. This is a one-way inbox.

### 7.7 Resume **[SHOULD]**

PDF viewer plus a Download button, and links to public profiles. The PDF lives at a fixed path (`/public/resume.pdf`) so replacing it is trivial. If it is missing, show the empty state. Do not generate a fake resume.

### 7.8 Terminal **[SHOULD]**

Commands: `help`, `about`, `projects`, `skills`, `socials`, `contact`, `open <project>`, `clear`.

All output comes from the content layer. `open <project>` launches the Browser at that project. The terminal is optional exploration, never the only way to reach anything.

### 7.9 Settings **[SHOULD]**

Wallpaper (from my own assets), sound on/off, reduce motion (defaults to the OS preference), lite mode toggle, reset desktop, About Rudar OS (version, tech, credits, asset licenses). Only non-sensitive preferences persist in local storage.

---

## 8. Audio **[SHOULD]**

- Very few, very quiet sounds: key click, window open, notification. Nothing ambient and looping unless it clearly adds to the room.
- Audio starts only after the first user gesture. Visible sound toggle in the top bar. State persists locally.
- All sounds are short, optimized, and lazy-loaded. Mute fully when the tab is hidden.

---

## 9. Browser embedding (critical)

### 9.1 The problem

Many sites forbid iframe embedding (`X-Frame-Options`, CSP `frame-ancestors`). `iframe.onload` cannot reliably tell you whether embedding was blocked.

### 9.2 The solution

1. Every project has `live_url` and `embed: 'auto' | 'never'` in content.
2. A server route (`/api/embeddable`) checks the response headers of **allowlisted URLs only** (only those listed in the content files, never arbitrary input, to prevent SSRF) and returns whether framing is allowed. Cache the result.
3. If embeddable: load in an iframe inside the Browser window, with a sensible `sandbox` and `allow` configuration, a loading state, and a timeout.
4. If not embeddable, or the timeout fires: show a clear, friendly state with an **Open in new tab** button. No blank frame, no broken state.
5. **Open in new tab** is always visible, even when embedding works.

### 9.3 Previews

A script (`scripts/capture-previews.ts`, Playwright) generates static preview images for the start page during development. Previews are for the start page only. They never replace the live site.

### 9.4 Full-screen site mode

Selecting a project can expand the site to occupy the whole desktop area, keeping a slim top strip with: Back to OS, address, Reload, Open in new tab. Leaving returns the visitor to the exact previous desktop state.

### 9.5 Human task for me (Rudar)

For my own Vercel projects to embed, each one must send `Content-Security-Policy: frame-ancestors 'self' https://<my-portfolio-domain>` and must not send `X-Frame-Options: DENY`. The agent must list exactly which projects still need this change.

---

## 10. Rudar AI: rule-based assistant

### 10.1 Behavior

- Identifies itself as **Rudar's portfolio assistant**. Never pretends to be me.
- Concise by default. Conversational. Plain language. No marketing tone.
- Answers only from the knowledge base. If it does not know: _"I don't have that. Here is what I can tell you:"_ followed by 3 suggested questions and the Socials link.
- Off-topic questions: a polite one-line redirect to what it can answer.

### 10.2 UX

Chat window, input, send, in-session history only, suggested questions on open (clickable), typing indicator (max about 400 ms, none under reduced motion), clear conversation.

Suggested starters: _Tell me about Rudar. Show me his best projects. What has he built with AI? What are his technical skills? How can I connect with him?_

### 10.3 Matching engine

Do not write a pile of if-statements. Build a small pipeline:

1. **Normalize:** lowercase, strip punctuation, expand a small synonym map ("stuff" to "projects", "tech" to "stack", "reach" to "contact").
2. **Detect intent** (what-is, features, tech-stack, links, achievements, contact, current-work, skills) and **entity** (a project id, a skill, or none).
3. **Compose from data** where possible: project answers are generated from the project record so that adding a project automatically makes the assistant able to discuss it. Hand-written entries cover the general questions.
4. **Fuzzy fallback:** Fuse.js over question variants and keywords. Above a high threshold: answer. In the middle band: _"Did you mean ...?"_ with 2 options. Below: honest fallback.
5. **Follow-ups:** remember the last entity so "what tech does it use?" resolves to the last project discussed.
6. **Output:** short markdown answer plus optional related links and 2 suggested follow-ups.

### 10.4 Knowledge base

`content/knowledge.ts`: `id`, `category`, `question_variants[]`, `keywords[]`, `verified_answer`, `related_links[]`, `follow_ups[]`. Editable without touching engine code. Every answer must be traceable to my provided facts.

### 10.5 LLM upgrade **[COULD, gated]**

Only if I approve later. Server route only, retrieval over the same knowledge base, strict system prompt, citations by entry id, rate limiting, abuse protection, graceful fallback to the rule-based engine on any failure. API keys never reach the client.

---

## 11. Content architecture

All portfolio content lives in typed data files, validated at build time with zod. Components read from them. Missing required content fails loudly in dev (visible TODO marker) and degrades cleanly in production.

```ts
type Profile = {
  name: string;
  intro: string;
  avatar: string;
  skills: string[];
  interests: string[];
  links: SocialLink[];
};

type Project = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  problem?: string;
  why?: string;
  features?: string[];
  stack: string[];
  contribution?: string;
  media?: { type: "image" | "video"; src: string; alt: string }[];
  repoUrl?: string;
  liveUrl?: string;
  embed: "auto" | "never";
  achievements?: string[];
  featured?: boolean;
  preview?: string;
};

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
};

type KnowledgeEntry = {
  id: string;
  category: string;
  questionVariants: string[];
  keywords: string[];
  answer: string;
  relatedLinks?: string[];
  followUps?: string[];
};

type VisitorNote = {
  id: string;
  visitorName?: string;
  message: string;
  category: "feedback" | "collaboration" | "general";
  createdAt: string;
  status: "pending" | "reviewed" | "hidden";
};
```

**TODO mechanism:** a field marked `TODO` renders a visible dev-only marker and appears in a generated `MISSING_CONTENT.md` report. The agent updates that report whenever it runs.

---

## 12. Backend (Notes only)

- Next.js route handler plus Supabase or Neon Postgres. Choose one and say which in one line.
- Validate with zod: name max 60 chars, message 1 to 1000 chars, category enum.
- Sanitize and **never render submitted content as HTML**.
- Rate limit per hashed IP (never store raw IPs), plus a honeypot field and a minimum-time-to-submit check.
- Row-level security: no public read. Service credentials only on the server.
- New notes default to `pending`.
- Admin review view is out of scope for now. I read notes in the database dashboard.
- No secrets in client code or in the repo. Use environment variables.

---

## 13. Lite mode, mobile and fallbacks

Lite mode is **the same OS without 3D**: lock screen as a clean 2D screen, then the desktop. On touch or narrow screens, apps render full-screen through `AppFrame` with a bottom dock and a clear back control.

**Triggers (any of):** no WebGL2, `deviceMemory` below 4, `hardwareConcurrency` of 2 or less, `saveData`, coarse pointer with width under about 900 px, slow first-frames check, or the visitor chooses it (`?mode=lite` and a visible link).

**Rules:**

- No physical keyboard is ever required.
- All major information is reachable in lite mode.
- Reduced motion removes the camera move and heavy transitions.
- Lite mode is tested as carefully as full mode.

---

## 14. Performance budgets

| Item                                      | Budget                                  |
| ----------------------------------------- | --------------------------------------- |
| Critical path JS (shell and loader)       | 150 KB gzipped or less                  |
| 3D chunk                                  | Lazy loaded, never blocks the loader    |
| Each app chunk                            | Lazy loaded on first open               |
| 3D payload                                | 5 MB or less                            |
| Largest Contentful Paint (loader or lite) | 2.5 s or less on a mid-range connection |
| Interaction latency (window drag)         | No dropped frames on mid-range laptop   |
| Idle CPU after login                      | Near zero. No render loops running.     |

Other rules: images optimized, videos compressed and lazy-loaded, nothing in a project loads until the visitor opens it, no continuous animation without a reason.

---

## 15. Accessibility

- Everything important reachable by keyboard. Visible focus indicators using a token color.
- Real buttons, labels, and landmarks. Windows have accessible names. Notifications use a live region.
- Contrast meets WCAG AA.
- Icons always have text labels (hover or visible) and `aria-label`.
- Reduced motion honored globally, with a manual override in Settings.
- The launcher (`Cmd/Ctrl + K`) provides a complete keyboard-first path to every app and project.
- A skip link and a plain "lite mode" path means a screen-reader user is never forced through the 3D room.

---

## 16. Security and privacy

- No real password collection. The field is simulated, honest about it, and the value is discarded.
- Visitor name stays in memory unless they submit a Note, and that is disclosed.
- No API keys, tokens, or database credentials in client code.
- Validate and sanitize every server input. Never trust user content. Never render it as HTML.
- External links: `noopener noreferrer`.
- Iframes: restrictive `sandbox`, only for allowlisted URLs.
- Set sensible response headers and a Content Security Policy for the portfolio itself.
- No analytics or tracking added without my approval.
- No private information about me in any content file.

---

## 17. Error and empty states

Nothing ever shows a blank window.

| Situation                                     | Behavior                                          |
| --------------------------------------------- | ------------------------------------------------- |
| Project site cannot embed                     | Friendly message plus **Open in new tab**         |
| Project site slow or down                     | Timeout state with retry and open-in-new-tab      |
| External link fails                           | Notification with the plain URL to copy           |
| Assistant has no answer                       | Honest fallback plus suggestions                  |
| Notes submit fails                            | Inline error, message text preserved, retry       |
| No content yet (about, resume, project media) | Clean empty state, never a broken layout          |
| App chunk fails to load                       | Error panel with retry                            |
| WebGL fails or context lost                   | Automatic switch to lite mode with a notification |

---

## 18. Suggested repository structure

```
src/
  app/                    Next.js routes, route handlers (notes, embeddable)
  os/
    window-manager/       store, Window, drag/resize logic, tests
    desktop/              Desktop, TopBar, Dock, Notifications, Launcher
    app-frame/            AppFrame (window vs full-screen)
    registry.ts           app registry
  apps/                   studio, browser, about, assistant, notes, socials,
                          resume, terminal, settings
  scene/                  3D room, login-on-monitor, keyboard, camera timeline, dispose
  assistant/              engine (normalize, intent, compose, fuzzy), tests
  content/                profile, projects, socials, knowledge, about.md
  styles/                 tokens.ts, tailwind theme, fonts
  lib/                    capability detection, audio, helpers
scripts/                  capture-previews.ts, content-report
public/                   resume.pdf, wallpapers, avatar, audio, previews
MISSING_CONTENT.md        generated TODO report
```

---

## 19. Out of scope (do not build without asking)

- User accounts or real authentication.
- Visitor-visible guestbook or comments.
- Admin dashboard.
- Games, widgets, weather, calendars, music players, fake system apps.
- Fake system indicators (battery, Wi-Fi, CPU graphs).
- Multiplayer or real-time features.
- Analytics or tracking.
- Any app not listed in Section 7.

---

## 20. Phases, gates and definition of done

### Phase 0: Setup **[MVP]**

Repo, TypeScript strict, Tailwind, lint, formatting, content layer with zod, `MISSING_CONTENT.md` generator.
**Done when:** the app builds, content validates, and TODO markers work.

### **GATE 1: Identity.** Stop and wait for my approval, once.

Deliver the design proposal described in `antigravity.md` Section 4. After approval, implement it as tokens and never ask again.

### Phase 1: Desktop shell **[MVP]**

Wallpaper, top bar, dock, notifications, app registry, `AppFrame`.
**Done when:** the shell renders from tokens only, with no hard-coded colors, fonts or radii.

### Phase 2: Window manager **[MVP]**

Everything in Section 6.2, with unit tests for focus, z-order, clamp, maximize and restore.
**Done when:** I can open five windows, drag, minimize, maximize and reorder them without a glitch, using mouse and keyboard.

### Phase 3: Core apps **[MVP]**

Development Studio, Browser (with embeddability check and fallbacks), About Me, Socials.
**Done when:** at least one project loads live inside the Browser, one non-embeddable project falls back correctly, and every app has loading, empty and error states.

### Phase 4: Assistant **[MVP]**

Engine, knowledge base, chat UI, suggested questions, follow-ups.
**Done when:** it answers verified questions correctly, handles follow-ups, and admits ignorance on unknown questions without inventing anything. Engine has tests.

### **GATE 2: Vertical slice.** Stop and wait for my review.

Lite mode must already be a complete, polished OS: lock screen, desktop, windows, and all MVP apps, with no 3D yet. Provide a short report: what works, what is rough, what content is missing.

### Phase 5: 3D login and handoff **[MVP]**

Scene, login on the monitor, camera timeline, seamless handoff, disposal, capability detection, lite fallback, skip intro.
**Done when:** the handoff has no visible seam, the GPU is released afterwards, budgets are met, and lite mode triggers correctly.

### Phase 6: Should-haves **[SHOULD]**

Notes with backend, Resume, Terminal, Settings, launcher, sound, Log out, 3D keyboard (last).

### Phase 7: Hardening and ship **[MVP]**

Performance pass, accessibility pass, security review, cross-browser testing (current Chrome, Safari, Firefox, Edge), mobile device testing, error-state review, deploy to Vercel with environment variables.

---

## 21. Acceptance criteria

The product is complete when all of these are true:

- A visitor reaches the login scene, enters a name (or skips), and arrives at the desktop.
- The desktop loads reliably. Apps open, close, minimize, maximize and reorder correctly.
- The Browser shows real projects, and at least one is fully interactive inside the OS.
- A non-embeddable site falls back gracefully every time.
- Development Studio shows accurate information with no invented facts.
- Social links work and are clearly external.
- The assistant answers verified questions, handles follow-ups, and never fabricates.
- The entire experience is usable in lite mode on a phone, with no physical keyboard.
- Everything important is operable by keyboard. Reduced motion is respected.
- No secret exists in client-side code or the repository.
- The 3D scene is disposed after login and nothing keeps rendering in the background.
- Every screen passes the slop test in `antigravity.md` Section 8.

---

## 22. Human tasks (Rudar must provide)

The agent builds around these and lists any that are still missing in `MISSING_CONTENT.md`:

1. Avatar image and wallpaper(s).
2. `about.md` copy, written in my own voice.
3. Final project write-ups: problem, why, features, my contribution, stack.
4. Live URLs and repo URLs for each project.
5. Resume PDF.
6. Real achievements beyond Top 140 at the Delhi AI Grand Hackathon, if any.
7. The frame-ancestors header change on each of my own project sites.
8. Notes database account and environment variables.
9. Decision on the assistant's tone examples (a few sample answers in my voice).

---

## 23. Working protocol for the agent

1. Read `antigravity.md`, then this PRD. Do not summarize them back to me.
2. Start with Phase 0, then Gate 1.
3. Build phase by phase. Commit in small, focused changes.
4. After each phase, give a **three-line report**: what shipped, what is next, what is blocked.
5. Test before claiming done: run the app, check the console, run the tests, check the done-criteria for that phase.
6. When unsure, choose the simpler option and note it. Ask me only when a decision changes identity, scope or cost.
7. Never invent content. Never add features outside this document.
