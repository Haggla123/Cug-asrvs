---
name: Academic Veritas
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#544244'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#877274'
  outline-variant: '#dac0c2'
  surface-tint: '#9a4152'
  primary: '#4e051a'
  on-primary: '#ffffff'
  primary-container: '#6b1d2f'
  on-primary-container: '#ee8495'
  inverse-primary: '#ffb2bc'
  secondary: '#775a00'
  on-secondary: '#ffffff'
  secondary-container: '#fece57'
  on-secondary-container: '#735700'
  tertiary: '#172538'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d3b4f'
  on-tertiary-container: '#97a5bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bc'
  on-primary-fixed: '#400013'
  on-primary-fixed-variant: '#7c2a3b'
  secondary-fixed: '#ffdf98'
  secondary-fixed-dim: '#eec14b'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  title-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects academic gravitas, administrative transparency, and institutional authority for the Catholic University of Ghana (CUG). Designed for alumni, current students, partner institutions, and academic registries, the interface bridges institutional solemnity with streamlined administrative throughput. 

The aesthetic is **Corporate / Modern Academic**: high legibility, structured documentary clarity, dignified color placement, and calm, confident pacing. It departs from dense bureaucratic tables in favor of structured card surfaces, precise micro-labels, and crisp document-tracking mechanics. Key emotional responses to evoke:
- **Trust & Authenticity:** Uncompromising security cues, clear academic verification stamps, and institutional seals.
- **Clarity & Efficiency:** Zero-friction credential application flows, instant status visibility, and transparent fee schedules.
- **Dignity & Prestige:** Deep university burgundy paired with refined academic gold, evoking heritage without visual clutter.

## Colors

The palette establishes an authoritative hierarchy rooted in Ghanaian collegiate heritage and modern administrative design:

- **Primary Colors (`#6B1D2F`, `#801830`, `#541222`):** Catholic University of Ghana Burgundy and Maroons. Used strictly for dominant navigational anchors, primary action buttons, key brand banners, and verification confirmation elements. `#541222` serves as deep pressed/active states.
- **Secondary Accent (`#C59B27`, `#D4AF37`):** Restrained Academic Gold. Reserved for certified status badges, seal trims, completion check rings, highlighted step nodes, and prominent verification tags. Gold is never applied to standard body text.
- **Text & Neutral Anchors (`#1E293B`, `#334155`, `#64748B`):** Deep Slate and Charcoal provide superior optical contrast and high-density readability across desktop displays and varied mobile environments under direct sunlight.
- **Surfaces & Backgrounds (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`):** Pure white container cards rest on layered warm-neutral slate backgrounds, creating low-strain optical boundaries for dense form handling.
- **Status Tones:** Success (`#15803D`), Pending/Processing (`#B45309`), Flagged/Rejected (`#B91C1C`), and Info (`#1D4ED8`), each paired with low-saturation 50-tint backgrounds.

## Typography

The type scale pairs **Newsreader** (authoritative, editorial, collegiate serif) for headings and formal institutional framing with **Public Sans** (accessible, systematic, institutional sans-serif) for tabular records, transactional forms, and metadata.

- **Newsreader** delivers the traditional authority appropriate for an accredited Catholic university document hub. It establishes immediate gravitas on transcript headers, portal sections, and credential banners.
- **Public Sans** ensures legibility in form inputs, verification numbers, audit timestamps, and micro-labels. 
- Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled on all registration numbers, verification hashes, index numbers, currency amounts (GHS), and dates.

## Layout & Spacing

The layout model uses a disciplined responsive grid calibrated for administrative workflows:
- **Desktop (1024px+):** 12-column layout, max-width 1280px container, with `gutter: 1.5rem` and `margin: 2rem`. Forms deploy asymmetric groupings (8 columns for inputs, 4 columns for request summaries and fee counters).
- **Tablet (768px - 1023px):** 8-column layout, full width with `margin: 1.5rem`. Request summaries float into sticky bottom sheets or collapse into linear cards.
- **Mobile (&lt; 768px):** 4-column layout, full width with `margin-mobile: 1rem` and `gutter-mobile: 1rem`. Multi-step academic applications switch into stacked single-column viewports with fixed bottom-docked action bars for finger accessibility.
- **Spacing Rhythm:** Based on a strict 8px base unit (`space-xs`: 4px, `space-sm`: 8px, `space-md`: 16px, `space-lg`: 24px, `space-xl`: 40px). Field pairings use `space-sm`, section clusters use `space-lg`, and major document partitions use `space-xl`.

## Elevation & Depth

Visual hierarchy uses **tonal layering combined with warm ambient shadows** tinted slightly by burgundy and cool slate, avoiding flat sterility while maintaining document precision:

- **Level 0 (Canvas):** `#F8FAFC` base page background.
- **Level 1 (Surface Cards & Sections):** `#FFFFFF` with a 1px solid border in `#E2E8F0` and subtle drop shadow (`box-shadow: 0 1px 3px rgba(30, 41, 59, 0.05)`).
- **Level 2 (Interactive Floating Elements, Steppers, & Flyouts):** `#FFFFFF` with `box-shadow: 0 4px 12px -2px rgba(107, 29, 47, 0.08), 0 2px 6px -1px rgba(30, 41, 59, 0.04)`.
- **Level 3 (Modals, Official Verification Drawer, & Document Previews):** `#FFFFFF` with `box-shadow: 0 12px 32px -4px rgba(30, 41, 59, 0.16)`.
- **Accents & Seals:** Official verified badges utilize a dual inner highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.6)`.

## Shapes

The shape system employs **Soft (`roundedness: 1`)** geometry:
- Core UI items (inputs, table headers, buttons, standard badges) use `0.25rem` (4px).
- Surface containers, verification panels, and application cards use `rounded-lg` (`0.5rem` / 8px).
- Modal dialogues and official certificate preview frames use `rounded-xl` (`0.75rem` / 12px).
- Status pills, circular step indicators, and official university counter rings retain `rounded-full` for deliberate geometry contrast against rectangular cards.

## Components

### Buttons
- **Primary:** Deep Burgundy (`#6B1D2F`) fill, text `#FFFFFF`, border-radius `0.25rem`, subtle hover shift to `#801830`, active state `#541222`. Focus ring: 2px offset with `#C59B27`.
- **Secondary:** Transparent fill, 1.5px border in `#6B1D2F`, text `#6B1D2F`. Hover fills with `#6B1D2F` at 6% opacity.
- **Tertiary / Utility:** Text `#334155`, transparent fill, subtle hover background `#F1F5F9`.

### Chips & Status Badges
- Strict color-coded semantics for request lifecycles:
  - *Verified / Completed:* `#F0FDF4` background, `#15803D` text, 1px `#BBF7D0` border.
  - *Under Review / Processing:* `#FEFCE8` background, `#854D0E` text, 1px `#FEF08A` border.
  - *Action Required / Incomplete:* `#FEF2F2` background, `#991B1B` text, 1px `#FECACA` border.
  - *Official Stamp Seal:* Subtle gold gradient border (`#C59B27`) with bold uppercase micro-typography (`label-sm`).

### Stepper & Progress Counters
- **Application Stepper:** Horizontal segmented tracker on desktop; collapsible numeric step drawer on mobile. Completed steps feature a burgundy fill with white checkmarks. The active step features a prominent 2px `#C59B27` outer ring around a white node with burgundy index numbering.
- **Copy / Document Counter:** Incremental input component with clear `+` / `-` target touch targets (min 44px on mobile), enclosed in a 1px `#CBD5E1` border with high-contrast centered numeric text.

### Form Inputs
- 1px `#CBD5E1` border resting on `#FFFFFF` surfaces.
- Focus state switches border to `#6B1D2F` with a soft `0 0 0 3px rgba(107, 29, 47, 0.12)` glow.
- Labels in `#334155` (`label-md`), accompanied by explicit helper text in `#64748B`. Required flags highlighted in `#6B1D2F`.

### Document & Request Cards
- White surface with clear header partition: top left displays reference number (e.g., `CUG-ASR-2024-8891`) in monospaced/tabular figures, top right positions the lifecycle badge. Bottom edge hosts total processing fee, submission date, and direct CTA.

### Verification Seal & Security Block
- Specialized component designed for third-party verification: bordered by an academic gold rule (`#C59B27`), showing the CUG coat-of-arms watermark, cryptographic verification hash, registrar approval stamp, and QR lookup matrix.