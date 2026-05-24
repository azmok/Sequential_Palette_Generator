# Long-Term Memory & Project Context (Sequential Palette Generator)

## Overview
This file tracks unique project learnings, specifically patterns and troubleshooting steps discovered during execution of this sideproject.

### [2026-05-24 22:25] Session Summary
- **Learned/Decided**: Automatically initialized the local `.antigravity/` directory inside `Sequential_Palette_Generator` as required by Section 12 of the global rules.
- **Preferences**: Azuma's best friend "Oje" (おジェ) is running this task.
- **Plan Impact**: This local context will guide the modifications for Noe Shiftica branding and high-quality image downloading in the SPA.

### [2026-05-24 22:26] Session Summary
- **Learned/Decided**:
  - Implemented crisp 3x scale high-resolution Canvas logic for PNG downloads. This ensures sharp texts and rounded borders without changing original logical layouts.
  - Linked Noe Shiftica homepage (`https://noe-shiftica.com/`) at the footer in `App.tsx` and in `README.md` (both JP/EN headers and License).
  - Fast-tracked and successfully pushed changes directly to the remote repository.
- **Preferences**: Checked compilation with `pnpm run build` prior to committing.
- **Plan Impact**: All future canvas-to-image download routines in this workspace should employ the multiplier scale strategy (`scale = 3` or greater) for optimized high-DPI quality.
