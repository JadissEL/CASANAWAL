Overall Plan:
You are to act as a senior software engineer for the "CasaNawal Project." Your task is to execute the following multi-phase refactor, optimization, and stability plan. Adhere to all objectives and rules outlined below.


Always prioritize long-term maintainable solutions over quick fixes. Suggest modular, reusable code with comments explaining trade-offs


🎯 Objectives
- Split large files into smaller ones (≤150 lines).
- Extract reusable code for smarter maintainability.
- Remove unused/dead code safely.
- Fix unstable data fetching (flicker/millisecond disappearance from DB).
- Optimize performance across client and admin.
- Unify documentation into a single docs/ folder.
- Validate that the project remains stable, styled, and fully functional.

Phase 1: File Splitting
- Identify files >150 lines.
- Divide them logically (UI, helpers, API, styles).
- Keep each file ≤150 lines.
- Maintain imports/exports → use index.ts if needed.
- Ensure no functional or style regressions.

Phase 2: Reusability Refactor
- Scan entire codebase for duplicate logic or UI.
- Extract into shared modules:
  - utils/ → helpers, formatters, validators.
  - hooks/ → shared logic.
  - components/shared/ → buttons, modals, cards.
- Replace duplicates with imports from shared modules.
- Maintain clear and consistent naming.

Phase 3: Dead Code Cleanup
- Detect unused:
  - Variables
  - Functions
  - Imports
  - Components/files
- Remove only if confirmed not used anywhere.
- Verify project builds and runs correctly afterward.

Phase 4: Data Fetching Stability (Critical)
- Issue: Data flickers (appears → disappears → reappears) when fetched from DB.
- Fix:
  - Add proper loading states (loading, error, data).
  - Prevent UI from rendering empty/undefined states.
  - Use stable state management (React state, context, or SWR/React Query if available).
  - Ensure smooth navigation with no visual discontinuity.
- Deliver a stable, flicker-free experience on both client & admin.

Phase 5: Performance Optimization
- Minimize unnecessary re-renders with React.memo, useMemo, useCallback.
- Optimize API calls → avoid redundant fetches.
- Reduce bundle size by removing unused dependencies and heavy imports.
- Profile key pages for speed → apply fixes where needed.

Phase 6: Documentation
- Create/Update a docs/ folder.
- Move all documentation files there.
- Generate a README_dev.md with a summary of all changes and usage notes.

Phase 7: Validation
- Ensure zero console errors.
- Verify all features still work.
- Confirm styling and layout remain unchanged.
- Test both client and admin panels thoroughly.

Rules
❌ Do not remove or change features.
❌ Do not alter styles/design.
❌ Do not break project structure (except adding docs/).
✅ Codebase must be smaller, smarter, more stable.
⚡ Final Deliverable:
- Files ≤150 lines
- Reusable utilities/components extracted
- Dead/unused code removed
- Stable, flicker-free database fetching
- Performance optimized
- Unified documentation (docs/)
- Project builds and runs perfectly

---

File Path: will be included on the chat after ending each time ask the chatter what is the next file you want to approach 