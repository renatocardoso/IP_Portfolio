# Feature Specification: Infinita Poesia — Portfolio Baseline

**Feature Directory**: `specs/001-portfolio-baseline`
**Created**: 2026-04-23
**Status**: Draft
**Input**: Baseline specification covering the full portfolio as it currently exists

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Discover and Browse Projects (Priority: P1)

A visitor arrives at the portfolio home page (infinitapoesia.com) and sees an animated
typographic hero. From there, they navigate to the Projects page, where all work is listed
in a responsive grid. They filter by category (Gráfico / Produto) to narrow down what is
relevant to them, then click a project card to view its full case study with image gallery
and description.

**Why this priority**: This is the core user journey — the entire site exists to showcase
work. Without functional project browsing and filtering, the portfolio has no value to
prospective clients or collaborators.

**Independent Test**: A tester can visit `/pt/projetos`, apply each filter tag, confirm
the correct projects appear, and open at least one project detail page — without touching
any other part of the site.

**Acceptance Scenarios**:

1. **Given** the visitor is on `/pt` (home), **When** they navigate to `/pt/projetos`,
   **Then** all projects from both "gráfico" and "produto" categories are displayed in a
   responsive grid with no overlapping elements.

2. **Given** the visitor is on `/pt/projetos`, **When** they click the "Gráfico" tag filter,
   **Then** only graphic design projects are shown and the active tag is visually distinguished.

3. **Given** the visitor clicks a project card, **When** the detail page loads,
   **Then** a carousel of project images is displayed alongside a textual description,
   with no layout breakage on any screen size.

---

### User Story 2 — Experience the Site in English (Priority: P2)

An international visitor opens the portfolio. The browser's `Accept-Language` header is set
to English, so they are automatically redirected to the `/en` prefix. All navigation labels,
filter tags, and descriptive text appear in English. They can also manually toggle to
Portuguese at any time via the language switcher.

**Why this priority**: The portfolio targets both Brazilian and international clients. Without
working i18n, half the potential audience sees a broken or mismatched experience.

**Independent Test**: A tester can open the site with `Accept-Language: en` and confirm
the `/en` prefix, English tags ("Graphic" / "Product"), and English navigation — then switch
to `/pt` via the toggle and see Portuguese content.

**Acceptance Scenarios**:

1. **Given** a browser with `Accept-Language: en`, **When** the user visits `/`,
   **Then** they are redirected to `/en` and all labels are in English.

2. **Given** the user is on `/en/projetos`, **When** they click the language toggle,
   **Then** they are taken to `/pt/projetos` and all labels switch to Portuguese.

3. **Given** a direct URL `/pt/projetos`, **When** the page loads,
   **Then** no redirect occurs and Portuguese content is shown.

---

### User Story 3 — View the Animated Hero on the Home Page (Priority: P3)

A visitor opens the home page and sees a full-screen layout (no Header or Footer visible)
with a typewriter-style animation cycling through representative phrases of the studio's
work. The Dandelion particle animation runs in the background. The experience is purely
aesthetic and establishes the studio's visual identity.

**Why this priority**: The hero experience is the brand's first impression. It doesn't
block core navigation, but its correctness (timing, no layout shift, no Header/Footer
intrusion) reflects directly on perceived quality.

**Independent Test**: A tester can visit `/pt` and confirm: no Header or Footer is rendered,
the typewriter animation starts within 200ms, cycles correctly, and the Dandelion animation
runs without errors in the browser console.

**Acceptance Scenarios**:

1. **Given** the user visits `/pt`, **When** the page renders,
   **Then** neither the site Header nor Footer is visible.

2. **Given** the page has loaded, **When** 200ms have elapsed,
   **Then** the typewriter animation has started and the first phrase is partially visible.

3. **Given** the typewriter has completed a full cycle,
   **When** the animation loops,
   **Then** there is no visible flash, jump, or layout shift between phrases.

---

### Edge Cases

- What happens when a project slug in the URL doesn't match any project in the data?
  (Expected: 404 page, not a crash.)
- What happens when the browser language is neither `pt` nor `en`?
  (Expected: falls back to `pt` as the default locale.)
- What happens when an image CDN URL is unreachable?
  (Expected: the grid still renders; broken images show nothing without crashing the page.)
- What happens when the viewport is resized mid-session between mobile and desktop widths?
  (Expected: filter tags reflow without clipping; project grid recolumns without overlap.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display all projects from both "gráfico" and "produto"
  categories on `/[lang]/projetos` when no filter is active.
- **FR-002**: The system MUST filter the project grid in real time when a tag is selected,
  showing only projects whose `category` matches the selected tag value.
- **FR-003**: The system MUST redirect visitors from `/` to `/pt` or `/en` based on the
  `Accept-Language` header, defaulting to `/pt` when the language is not supported.
- **FR-004**: The system MUST render the home page (`/[lang]`) without a Header or Footer.
- **FR-005**: The system MUST provide a language toggle that switches between `/pt` and `/en`
  while preserving the current path segment (e.g., `/pt/projetos` ↔ `/en/projetos`).
- **FR-006**: Project cards MUST be edge-to-edge on mobile and tablet viewports; lateral
  padding is applied only at `lg` breakpoint and above.
- **FR-007**: Filter tags MUST respect lateral content margins at all breakpoints (they do
  NOT extend edge-to-edge).
- **FR-008**: Each project detail page MUST display an image carousel and a textual
  description, both responsive across all breakpoints.
- **FR-009**: All visible text strings MUST be sourced from locale dictionaries or bilingual
  data structures — no hardcoded Portuguese or English strings in JSX.
- **FR-010**: All colors MUST use design token utility classes (`text-brand`, `bg-panel`,
  etc.) — no hardcoded hex values in any component.

### Key Entities

- **Project**: A portfolio work item with `slug`, `title`, `img` (CDN URL), and `category`
  (`"grafico"` | `"produto"`). Displayed as a card in the grid and has a dedicated detail page.
- **Locale**: One of `pt` (default) or `en`. Controls all visible text and the URL prefix.
- **Tag Filter**: A UI control representing a category or "todos" (all). Filters the project
  grid client-side with no page reload.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from the home page to a specific project detail page in 3
  clicks or fewer.
- **SC-002**: The project grid renders correctly (no overlapping, no clipping) on viewport
  widths from 320px to 2560px.
- **SC-003**: Switching between filter tags produces a visible result change in under 100ms
  (client-side filter — no network round-trip).
- **SC-004**: Language switching preserves the user's current section — no unnecessary
  redirects to the home page.
- **SC-005**: Zero hardcoded colors (hex) or font-family declarations appear in any
  component file at any point in the build.
- **SC-006**: The home page typewriter animation starts within 200ms of the page becoming
  interactive.

---

## Assumptions

- Visitors have a modern browser (Chrome 110+, Firefox 110+, Safari 16+); IE is not supported.
- All project images are hosted on UploadThing CDN and are publicly accessible.
- The project data (slugs, titles, images) in `src/app/[lang]/projetos/page.js` is
  maintained manually — there is no CMS or database backing it.
- Mobile support covers portrait orientation as the primary use case; landscape is a bonus.
- The `/admin` route is out of scope for this baseline spec — it is a separate concern.
- Vercel deploy is the only deployment target; local build correctness is the primary
  gate before shipping.
