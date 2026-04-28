<!-- Sync Impact Report (v0.0.0 → v1.0.0)
  Version change: initial adoption
  Added sections: Core Principles, Stack & Tokens, Design-to-Code Workflow, Governance
  Removed sections: all placeholder tokens replaced
  Templates requiring updates:
    ✅ .specify/memory/constitution.md (this file)
    ⚠ .specify/templates/plan-template.md (review for stack alignment)
    ⚠ .specify/templates/spec-template.md (review for i18n + Figma workflow sections)
    ⚠ .specify/templates/tasks-template.md (review for category alignment)
  Follow-up TODOs: none
-->

# Infinita Poesia Portfolio — Constitution

## Core Principles

### I. Design-First, Code-Second
Every feature MUST originate from a Figma design node before any code is written.
The implementation pipeline is: `get_design_context` → `get_screenshot` → adapt tokens → implement.
Raw hex colors and inline font-family are NEVER acceptable in the final code — they MUST map to
design tokens (`text-brand`, `font-sans`, `font-serif`, etc.). The Figma file is the single source
of visual truth; the code is its faithful translation.

### II. Token-Driven Styling (NON-NEGOTIABLE)
All colors, typography, and spacing MUST use the design tokens defined in `src/app/globals.css`
under the `@theme` block. Tailwind v4 generates native utility classes from `--color-*` variables —
use them directly (`text-brand`, `bg-panel`, etc.). Using `text-[--color-brand]` without `var()`
is a CSS error and will silently produce the wrong color. Hardcoded hex values are forbidden.

#### IIa. Semantic Typography Classes (NON-NEGOTIABLE)
Typography is defined in `@layer components` inside `globals.css` as semantic classes sourced
from Figma ip-design-system node `1:2`. Use ONLY these classes for text elements — never raw
Tailwind size utilities (`text-xl`, `text-4xl`, etc.) for headings or body copy:

| Class | Style | Specs |
|---|---|---|
| `.type-h1` | Heading/H1 | Fira Sans Light, 3rem, leading 3.25rem, tracking -0.125rem |
| `.type-h2` | Heading/H2 | Fira Sans Light, 2.25rem, leading 2.5rem, tracking -0.0625rem |
| `.type-h3` | Heading/H3 | Fira Sans Regular, 1.25rem, leading 2rem |
| `.type-h3-up` | Heading/H3 UP | same + uppercase |
| `.type-body` | Body/Texto | Fira Sans Regular, 1rem, leading 1.25rem |
| `.type-body-up` | Body/Texto UP | same + uppercase |
| `.type-label` | Body/Label | Fira Sans SemiBold, 0.875rem, leading 1.125rem, tracking 0.053rem |
| `.type-label-up` | Body/Label UP | same + uppercase |

**Implementation rule**: Classes use `font-family: var(--font-fira), sans-serif` + `@apply` with
hardcoded Tailwind values (NOT CSS variable references like `var(--text-h1)`) due to a Tailwind v4
scoping limitation with `@theme` variables inside `@layer components`. The `@apply` approach is the
canonical and validated pattern.

**Tag alignment rule**: When changing a text element's HTML tag (e.g. `<p>` → `<h2>`), always
update the semantic class to match (e.g. `type-body` → `type-h2`). Mismatched tag+class pairs
break accessibility and visual hierarchy.

### III. Component Reuse Before Creation
Before building any UI element, check shadcn/ui, Radix, and the existing `src/components/` tree.
Only create a new component when nothing suitable exists. New components go in `src/components/ui/`
with `.jsx` extensions (never `.tsx`). Icon libraries MUST NOT be installed — use Unicode characters
(`*`, `/`) or assets from the Figma MCP.

### IV. i18n by Default
Every user-visible string MUST support both `pt` (default) and `en` locales. Dictionaries live in
`src/dictionaries/pt.json` and `en.json`. Bilingual data structures use keys in `src/data/siteData.js`.
Pages read `params.lang` to derive the active locale. No hardcoded Portuguese or English strings in
component JSX.

### V. Minimalist Aesthetic
No borders, shadows, or colored backgrounds unless explicitly present in the Figma design.
Navigation uses `uppercase tracking-wide`. Transitions are `transition-colors duration-300`.
Active states use `text-brand`; hover states use `text-text-light`. The asterisk `*` in brand red
is the only decorative element permitted outside of project imagery.

## Stack & Token Constraints

**Framework**: Next.js 16 App Router, React 19, JavaScript only — TypeScript (`.ts`/`.tsx`) is forbidden.

**Styling**: Tailwind CSS v4 via `@import "tailwindcss"`. Class merging via `cn()` from `@/lib/utils`.

**Animations**: Framer Motion for React-driven animations; p5 vanilla (not react-p5) for canvas.

**Images**: `next/image` with `unoptimized` on gallery grids. CDN via UploadThing. Grid uses `fill` +
`object-cover` + `aspect-video` + `gap-0` for a continuous mosaic.

**Layout rules**:
- Content column: `max-w-7xl mx-auto px-6`
- Project grid: `max-w-[1400px] mx-auto px-8` — cards are edge-to-edge on mobile/tablet (`lg:px-30` only)
- Sections: `py-12`
- Header/Footer are injected by `PageLayoutWrapper` — NEVER add them manually inside page components

**Infra**: Vercel deploy (auto on push to main), Vercel Analytics, UploadThing for media.

## Design-to-Code Workflow

This workflow is MANDATORY for any visual change:

1. `get_design_context(fileKey, nodeId)` — extract structure, tokens, and reference code
2. If response is truncated: `get_metadata` → identify child nodes → `get_design_context` per node
3. `get_screenshot` — visual reference for validation
4. Only after both: implement, using existing components and project tokens
5. Validate the implementation against the screenshot before marking the task complete

**Figma MCP**: Use the remote server (`mcp__claude_ai_Figma__` prefix). The plugin-based server
(`mcp__plugin_figma_figma__`) requires a local Figma plugin running and MUST NOT be used.

**Primary Figma file**: `ip-design-system` — FileKey `gY7ACSmZ9rzmVfnkkLYAYE`

## Governance

This constitution supersedes all other style guides and ad-hoc conventions for this repository.
`CLAUDE.md` at the project root is the authoritative runtime reference for the AI agent; this
constitution drives spec and plan generation. When the two conflict, this constitution takes precedence
for spec artifacts and `CLAUDE.md` takes precedence for in-session AI behavior.

**Amendment procedure**: Any change to a principle requires a version bump, a rationale comment, and
an update to `CLAUDE.md` if the principle affects agent behavior. Breaking changes (principle removal
or redefinition) increment MAJOR. New principles increment MINOR. Clarifications increment PATCH.

All implementation plans MUST include a "Token & Design Compliance" checklist item verifying that
no hardcoded colors, inline fonts, or missing i18n strings are introduced.

**Version**: 1.1.0 | **Ratified**: 2026-04-23 | **Last Amended**: 2026-04-27
