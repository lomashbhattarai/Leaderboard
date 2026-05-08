# Redesign Log

## Goal

Give NEPSE Leader a systematic visual redesign inspired by Family's crypto web app while keeping the product an efficient finance dashboard.

## Inspiration Notes

Sources:
- https://benji.org/family-values
- https://family.co/

Useful Family values translated for this web app:
- Keep the interface direct and focused. Finance screens should feel calm, scannable, and useful before they feel decorative.
- Use contextual polish rather than heavy explanation. Color, motion, and surface depth should guide attention without adding tutorial text.
- Prefer a warm, friendly base with confident accents. Family's site mixes near-white/warm paper surfaces, blue action color, green success, pink/orange delight, and black text.
- Make the system replaceable. Colors should live in theme tokens and CSS variables so future redesign passes can swap the palette without editing every component.

## Current Pass: Foundation

Status: complete

Implemented:
- Added reusable theme tokens in `src/themes/spaceThemes.ts`.
- Added `src/themes/designTokens.ts` to generate CSS variables and the MUI theme from the same source.
- Updated global CSS variables and Tailwind theme extensions in `src/index.css` and `tailwind.config.js`.
- Moved the app shell from hardcoded `aliceblue` to theme-driven backgrounds.
- Reworked the sticky nav to use the centralized surface, border, text, motion, and shadow tokens.
- Updated the logo colors to follow the active theme.
- Removed the embedded `NewPortfolio` page theme so it inherits the app-level theme.

## Current Pass: Theme Adoption

Status: in progress

Implemented:
- Replaced remaining hardcoded chart palettes in chart components with `currentTheme.chart.palette` and theme status colors.
- Updated chart grid, axis, tooltip, and reference-line colors to use text, border, surface, and status tokens.
- Replaced page-level Tailwind status colors with app token classes such as `text-app-positive`, `text-app-negative`, and `text-app-muted`.
- Removed visible page/component hex literals from `src/components` and `src/pages`, including stale commented-out theme snippets.
- Updated journal cards, tags, auth button contrast, leaderboard trophy colors, portfolio row actions, and admin stat cards to use theme tokens.

## Palette

Primary light theme:
- Canvas: `#FBFAF9`
- Soft background: `#F6F4EF`
- Surface: `#FFFFFF`
- Text: `#171717`
- Muted text: `#747484`
- Primary action: `#008CFF`
- Success/action secondary: `#34C759`
- Delight accent: `#F966AC`
- Warning: `#FFBE4C`
- Negative: `#FF4E4E`

Dark theme:
- Canvas: `#121212`
- Surface: `#171717`
- Raised: `#222222`
- Primary action: `#7DC4FF`
- Success: `#52CB58`

## Token Ownership

Edit these first for future visual passes:
- Theme objects: `src/themes/spaceThemes.ts`
- CSS/MUI bridge: `src/themes/designTokens.ts`
- Tailwind aliases: `tailwind.config.js`

Avoid adding raw page-level colors unless the color is data-specific, such as gain/loss or chart series.

## Follow-Up Ideas

- Decide whether the dark theme should be user-facing or kept only as a future design path.
- Continue moving repeated layout/page styling into reusable surface primitives once the visual direction stabilizes.

## Visual QA Checklist

Use this after each redesign pass. Check desktop and a narrow mobile viewport.

### Leaderboard (`/` and `/leaderboard`)

- Nav remains sticky, readable, and lightly translucent over the warm app background.
- Leaderboard table/header, cards, alerts, trophy, and gain/loss values use app token colors.
- Positive, negative, zero, and unavailable performance values are visually distinct and readable.
- Compact dashboard leaderboard and full leaderboard both fit without horizontal text collisions.

### Portfolio (`/my-portfolio`)

- Summary cards, portfolio tables, row action hover surfaces, and buttons use the shared surface/border/action tokens.
- Charts use `currentTheme.chart.palette`; cost/current-value bars are distinguishable.
- Masked amounts, stop-loss chips, and transaction actions remain readable against all surfaces.
- Empty/loading/error states do not fall back to old slate/emerald styling.

### Stocks (`/stocks`)

- Stock list/search/filter surfaces match the app shell, nav, and card treatment.
- Gain/loss and watchlist actions use theme status/action colors.
- Stock cards/tables remain dense and scannable on mobile.
- Links and icon buttons have visible hover/focus affordances.

### Login (`/login`)

- Form paper, inputs, primary button, and signup link follow the theme tokens.
- Button contrast is accessible with `currentTheme.text.inverse`.
- Page background feels connected to the app shell rather than a separate auth theme.
- Error/success toast placement does not obscure the form.

### Journals (`/journals`)

- Journal heading, subtitle, cards, tags, and empty state use app token classes.
- Drawer form inherits the app-level MUI theme.
- Edit/delete icon buttons are muted but discoverable.
- Floating add button remains visible without covering journal card actions on mobile.
