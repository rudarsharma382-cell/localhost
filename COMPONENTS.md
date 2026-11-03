# COMPONENTS LEDGER (21st.dev & Primitives)

> **Core Rule (design.md Section 5.2):** 
> *21st.dev is a parts bin, not a design direction.*
> Every component adopted must be re-skinned into Rudar OS design tokens, stripped of decorative AI-slop, audited for keyboard accessibility and reduced motion, and logged here.

---

## Component Ledger

| Component Name | Author | Source URL | Rudar OS Surface / App | Modifications Made | License / Terms |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `VintageKeyboard` | Ayushmaan Singh (`@ayushmxxn`) | https://21st.dev/r/ayushmxxn/vintage-keyboard | 3D Room / Login Scene | Re-skinned to design tokens (`var(--font-sans)`, Tailwind v3 CSS variable compatibility), added `onKeyAction` callback for 3D typing sync, removed typing target mute so physical keys animate while inputs are focused, added Web Audio thock engine integration | MIT / Open Source |

---

## 21st.dev Evaluation Criteria & Re-skinning Protocol

1. **Need First**: Must serve an explicit PRD requirement (e.g. Window dock, file tree, accessible tabs, search input).
2. **AI-Slop Filter Check**:
   - ❌ No aurora / glowing gradients / floating orb effects
   - ❌ No bento grid layouts
   - ❌ No liquid glass / shiny metal buttons
   - ❌ No continuous non-functional animation
3. **Token Re-skinning**:
   - Colors replaced with `tokens.color` (surface base, panel, raised, accent `#E58B24`, hairline borders)
   - Fonts replaced with `tokens.typography` (Cabinet Grotesk, Switzer, JetBrains Mono)
   - Radii snapped strictly to `radius.sm` (4px), `radius.md` (8px), or `radius.lg` (12px)
   - Motion mapped to `duration.instant` (90ms), `duration.quick` (160ms), `duration.base` (240ms)
4. **Accessibility Verification**:
   - ARIA landmarks, `aria-label`, visible focus indicator (`ring-1 ring-accent`)
   - Complete keyboard operability (`Tab`, `Enter`, `Space`, `Escape`, arrow keys)
   - `prefers-reduced-motion` compliance

