# RUDAR OS: DESIGN PROPOSAL & IDENTITY SPECIFICATION
**Identity Reset — Studio Slate & Mineral Linen**
**Precedence:** `antigravity.md` > `prd.md` > `design.md`

---

## 1. The Feeling in One Paragraph

Rudar OS feels like a calm, tactile physical workshop made of warm studio slate, milled graphite, and mineral linen. It rejects aggressive neon accents, orange-on-black terminal tropes, macOS traffic-light buttons, and uppercase monospace labels. Surfaces possess natural physical weight, content is separated by delicate hairline rules and generous whitespace rather than bordered boxes, and every visible detail honors quiet engineering craft.

---

## 2. Palette & Contrast Verification

| Token | Value | Role | Contrast on Base | Rating |
| :--- | :--- | :--- | :--- | :--- |
| `surface.canvas` | `#111315` | Studio wallpaper ground | N/A | Base |
| `surface.base` | `#181A1D` | Window frame, top bar, dock | 1.1:1 | Structural |
| `surface.panel` | `#1F2226` | Window interior | 1.2:1 | Structural |
| `surface.raised` | `#272B30` | Menus, dialogs, popovers | 1.4:1 | Floating |
| `border.subtle` | `#25292E` | Delicate hairline rule | 1.2:1 | Divider |
| `border.default` | `#2E3339` | Frame boundaries | 1.5:1 | Edge |
| `border.strong` | `#3B424A` | Active focus boundary | 2.1:1 | Active |
| `text.primary` | `#F0EFEA` | Warm mineral white headings and body | **14.8:1** | **AAA** |
| `text.secondary`| `#9CA2A8` | Readable body and labels | **6.1:1** | **AA** |
| `text.tertiary` | `#666C72` | Subtle timestamps | **3.6:1** | Metadata |
| `accent.DEFAULT`| `#C49B72` | Restrained mineral ochre / copper | **5.4:1** | **AA** |

---

## 3. Typography System

1. **Display:** Cabinet Grotesk (Lock screen clock, case study titles).
2. **UI & Reading:** Switzer (System menus, buttons, case study text in sentence case).
3. **Monospace:** JetBrains Mono (Terminal CLI and code metadata only).

---

## 4. Custom Window Chrome (No macOS Traffic Lights)

- Left: App icon and window title in sentence-case Switzer.
- Right: Minimalist geometric tactile controls:
  - Minimize: Hairline bar `—`
  - Maximize: Hairline square `□`
  - Close: Hairline cross `×`
- Window focus is denoted by subtle border contrast and active elevation shadow.

---

## 5. Custom App Icons (One Construction Rule)

All 9 app icons are drawn on a uniform 24x24 grid with a consistent 1.25px stroke, rounded caps and joins, and monochrome `#F0EFEA`. Zero third-party library icons are dropped in unchanged.

---

## 6. Wallpaper & Desktop Surface

- High-resolution architectural wallpaper with deep studio charcoal gradient and graceful contour horizon sweeps.
- Desktop grid icons with double-click opening: SafeWare, TruSight AI, WorldOS, About Rudar, Browser, Rudar AI, Terminal, and Notes.

---

## 7. Strict Verified Facts Law

All content contains exclusively facts confirmed by Rudar Sharma:
- Flutter and app developer
- SafeWare, Top 140 at Delhi AI Grand Hackathon
- Verified public links: LinkedIn, GitHub, Portfolio, Instagram
- Projects: SafeWare, TruSight AI, AfterClass, WorldOS, Zetklo, 3D Automotive Website
- Everything else is tracked as a clean TODO in `MISSING_CONTENT.md`.
