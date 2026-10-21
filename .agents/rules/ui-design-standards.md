# UI Quality & Anti-Vibe-Coding Rules for Front-End Engineering

Whenever reviewing, editing, refactoring, or generating code in `index.html` or
front-end CSS/JS:

1. **Follow the Institutional UI/UX Skill:** Refer to
   `.agents/skills/institutional-fintech-ui-ux/SKILL.md` as the definitive
   design system standard.
2. **Strict Negative Constraints (No Vibe-Coding):**
   * Never use neon green glowing box-shadows or radial blurs.
   * Never add rotating, tilting, or bouncing micro-animations on hover.
   * Never leave placeholder strings (such as `<h3>Hello World!</h3>`).
   * Never use `border-radius: 9999px` (pills) for structural cards, tables, or
     wells. Use crisp `6px`–`8px` borders.
   * Never output malformed, inverted, or unclosed SVG tags.
3. **Clean Borderless Pill & Badge Aesthetic:**
   * All pills, badges, tags, and status indicators must strictly feature a
     clean, borderless aesthetic (`border: none;` or `border: 0;`).
   * Distinguish pills exclusively through disciplined background tints
     (e.g., `rgba(...)`) and sharp typography—never with a hairline border.
4. **Responsive Layout Contracts:**
   * On desktop (`>= 992px`): Use the 2-column split workspace
     (`max-width: 1080px`).
   * On mobile (`< 640px`): Never squeeze 6 table columns across a phone. Use
     2-row stacked touch cards with min `42px` touch targets and min `16px`
     font size (preventing iOS Safari viewport zoom).
5. **Data Rigor:**
   * Enforce `font-variant-numeric: tabular-nums` for all numbers.
   * Right-align all currency, price, quantity, and percentage inputs.
6. **Preserve All DOM Test IDs:**
   * Never rename, remove, or change the hierarchy of elements tested in
     `tests/master_test_suite.js`.
7. **Strict 80-Character Rule:** Every line of code must strictly be $\le 80$
   characters.
8. **0-Diff Parity:** Always mirror changes between
   `GitHub/Rebalance/index.html` and
   `c:\Users\willi\Desktop\Rebalancing\index.html`.

