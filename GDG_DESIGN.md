
---

name: GDG on Campus Design

colors:

surface: '#fcf9f8'

surface-dim: '#dcd9d9'

surface-bright: '#fcf9f8'

surface-container-lowest: '#ffffff'

surface-container-low: '#f6f3f2'

surface-container: '#f0eded'

surface-container-high: '#eae7e7'

surface-container-highest: '#e5e2e1'

on-surface: '#1b1b1c'

on-surface-variant: '#424753'

inverse-surface: '#303030'

inverse-on-surface: '#f3f0ef'

outline: '#727785'

outline-variant: '#c2c6d5'

surface-tint: '#005ac1'

primary: '#0058bd'

on-primary: '#ffffff'

primary-container: '#2771df'

on-primary-container: '#fefcff'

inverse-primary: '#adc6ff'

secondary: '#006e2c'

on-secondary: '#ffffff'

secondary-container: '#86f898'

on-secondary-container: '#00722f'

tertiary: '#7d5400'

on-tertiary: '#ffffff'

tertiary-container: '#9d6b00'

on-tertiary-container: '#fffbff'

error: '#ba1a1a'

on-error: '#ffffff'

error-container: '#ffdad6'

on-error-container: '#93000a'

primary-fixed: '#d8e2ff'

primary-fixed-dim: '#adc6ff'

on-primary-fixed: '#001a41'

on-primary-fixed-variant: '#004494'

secondary-fixed: '#89fa9b'

secondary-fixed-dim: '#6ddd81'

on-secondary-fixed: '#002108'

on-secondary-fixed-variant: '#005320'

tertiary-fixed: '#ffddb0'

tertiary-fixed-dim: '#ffba45'

on-tertiary-fixed: '#281800'

on-tertiary-fixed-variant: '#614000'

background: '#fcf9f8'

on-background: '#1b1b1c'

surface-variant: '#e5e2e1'

typography:

display-lg:

fontFamily: Google Sans

fontSize: 56px

fontWeight: '800'

lineHeight: 64px

letterSpacing: -0.03em

display-lg-mobile:

fontFamily: Google Sans

fontSize: 36px

fontWeight: '800'

lineHeight: 44px

letterSpacing: -0.02em

headline-lg:

fontFamily: Google Sans

fontSize: 32px

fontWeight: '700'

lineHeight: 40px

letterSpacing: -0.02em

headline-lg-mobile:

fontFamily: Google Sans

fontSize: 26px

fontWeight: '700'

lineHeight: 34px

letterSpacing: -0.01em

headline-md:

fontFamily: Google Sans

fontSize: 24px

fontWeight: '700'

lineHeight: 32px

letterSpacing: -0.01em

headline-sm:

fontFamily: Google Sans

fontSize: 20px

fontWeight: '600'

lineHeight: 28px

body-lg:

fontFamily: Google Sans

fontSize: 18px

fontWeight: '400'

lineHeight: 28px

body-md:

fontFamily: Google Sans

fontSize: 15px

fontWeight: '400'

lineHeight: 24px

body-sm:

fontFamily: google Sans

fontSize: 13px

fontWeight: '400'

lineHeight: 20px

code-pill:

fontFamily: Google Sans Mono

fontSize: 13px

fontWeight: '600'

lineHeight: 16px

letterSpacing: 0.02em

label-md:

fontFamily: Google Sans

fontSize: 14px

fontWeight: '600'

lineHeight: 18px

letterSpacing: 0.01em

label-sm:

fontFamily: Google Sans Mono

fontSize: 11px

fontWeight: '500'

lineHeight: 14px

letterSpacing: 0.05em

rounded:

sm: 0.3rem

DEFAULT: 1rem

md: 1.5rem

lg: 2rem

xl: 3rem

full: 9999px

shadow:
  color: '#1E1E1E'
  opacity: 1
  blur: 0px
  spread: -1px
  offsetX: 2.5px
  offsetY: 2.5px

spacing:
gutter: 1.5rem

gutter-mobile: 1rem

margin: 2.5rem

margin-mobile: 1.25rem

space-xs: 0.25rem

space-sm: 0.25rem

space-md: 0.25rem

space-lg: 0.25rem

space-xl: 0.25rem

---

  

## Brand & Style

This design system embodies the developer-first, high-energy ethos of a collegiate tech community while maintaining Google’s signature design clarity. Drawing inspiration from modern neo-brutalist utility, graphic tech primitives, and playful geometric modularity, the aesthetic avoids tired drop-shadows and glassmorphism in favor of crisp outlines, bright color blocks, high-contrast monospace code metadata, and structural pill geometry.

  

The target audience includes aspiring software engineers, open-source contributors, UI/UX designers, and campus innovators. The emotional tone is energetic, welcoming, technically credible, and optimistic. Bold continuous line-art framing, wireframe globes, curly code braces `{ }`, asterisks `*`, and pill-shaped badge elements celebrate the craft of building software in an accessible, community-driven format.

  

## Colors
The color architecture is built directly on the official 4-quadrant chromatic foundation (Core, Halftone, and Pastel steps), anchored by a deep near-black line tone and crisp light surfaces:

  

- **Core Blue (`#4285F4`)**: Primary brand actions, active states, key structural outlines, and lead interactive badges. Supported by Halftone Blue (`#57CAFF`) for hover/focus accents and Pastel Blue (`#C3ECF6`) for thematic container backgrounds.

- **Core Green (`#34A853`)**: Secondary accent for success feedback, registration calls-to-action, live status indicators, and algorithmic tracks. Supported by Halftone Green (`#5CDB6D`) and Pastel Green (`#CCF6C5`).

- **Core Yellow (`#F9AB00`)**: Tertiary warmth for spotlight tags, recruitment deadlines, and event milestones. Supported by Halftone Yellow (`#FFD427`) and Pastel Yellow (`#FFE7A5`).

- **Core Red (`#EA4335`)**: Critical alert tone, high-urgency notifications, and special track highlights. Supported by Halftone Red (`#FF7DAF`) and Pastel Red (`#F8D8D8`).

- **Surface & Foundation**:

- `Crisp White` (`#FFFFFF`): Primary content card surfaces.

- `Off White` (`#F0F0F0`): Neutral canvas workspace and table header fills.

- `Black 02` (`#1E1E1E`): High-contrast typography, strict 1.5px–2px structural borders, wireframe icons, and mono tags.

  

Never blend the palette into multicolored soft gradients. Use sharp color-blocking where pastel backgrounds host solid-core pill badges and white content cards.

  

## Typography

  

The typographic hierarchy pairs clean, modern geometric sans-serif shapes with high-clarity technical monospace fonts:

  

- **Display & Headings (Google Sans)**: Heavyweights (700 and 800) with tight tracking give recruitment campaigns and tech showcases a punchy, confident tone. The rounded terminal joints complement the pill container aesthetics.

- **Body Text (Google Sans)**: Used at 400 and 500 weights for maximum legibility across announcements, task requirements, and onboarding copy.

- **Code Primitives & Badging (Google Sans Mono)**: Reserved for micro-labels, dates, technical requirements, curly brackets `{ }`, tags, and system stats. This keeps the developer identity front and center.

  

## Layout & Spacing

This design system uses a flexible 12-column grid on desktop screens (scaling down to a 6-column grid on tablet and 4-column grid on mobile).

- **Outer Margins**: 2.5rem (40px) on desktop workspaces, collapsing to 1.25rem (20px) on compact mobile viewports to preserve container boundary integrity.

- **Rhythm**: Spacing follows a modular 4px/8px scale. Component interiors enforce generous internal clearance (`space-md` to `space-lg`) to preserve the feeling of airy, structural campaign posters.

- **Asymmetric Notched Containers**: Cards and window frames frequently employ extended tab-headers (such as a 3-circle window header or an offset tab top) with defined gutters (`1.5rem`), creating visual silhouettes evocative of physical browser viewports and IDE tabs.
## Elevation & Depth
Visual hierarchy does not rely on soft, realistic drop shadows or blurred glass layers. Instead, depth is communicated through **tactile flat stacking, bold borders, and pastel-fill layering**:

  

1. **Structural Outlines**: All interactive cards, modal windows, and hero banners feature a solid `1.5px` or `2px` border rendered in `Black 02` (`#1E1E1E`).

2. **Offset Block Drops**: Active interactive components (such as primary buttons or featured campaign modules) utilize a zero-blur, hard offset shadow (`2px 2px 0px #1E1E1E` or `4px 4px 0px #1E1E1E`).

3. **Tinted Matting (Color Stacking)**: White card layers sit cleanly over saturated pastel canvasses (`#C3ECF6`, `#CCF6C5`, `#FFE7A5`, or `#F8D8D8`), creating instant foreground-background separation without optical ambiguity.

4. **Window Metaphors**: Header tabs feature tri-color circles or monochrome pill capsules embedded directly within the container edge.

## Shapes
The shape system centers on elongated **pill forms, stadium geometries, and continuous rounded cutouts**:

- **Pill Radius**: Full circular rounding (`9999px` or standard `3rem` on large banners) is applied to all action buttons, metadata tags, segment tabs, and accent ornaments.

- **Card Containers**: Cards utilize a consistent `1.25rem` to `1.5rem` border radius on standard corners, with custom asymmetrical top tabs shaped like desktop browser windows or code editor panels.

- **Graphic Primitives**: Embedded decorative assets include wireframe globes, segmented ellipses, curved connector stems, code operators, and horizontal directional arrows framed within unified rounded outlines.

  

## Components

  

### Buttons

- **Primary Action**: Pill-shaped (`rounded-full`), solid Core Blue (`#4285F4`) or Core Green (`#34A853`) background, crisp white typography (`label-md`), enclosed in a `1.5px solid #1E1E1E` border with a `2px 2px 0px #1E1E1E` offset shadow. On press, the shadow collapses to `0px 0px` with a `translate(2px, 2px)`.

- **Secondary Action**: Pill-shaped, pure white surface (`#FFFFFF`), `1.5px solid #1E1E1E` border, dark text (`#1E1E1E`). Hover triggers a pastel background fill tint matching the current domain quadrant.

- **Ghost / Code Button**: Pill-shaped or subtle tab, transparent background, monospaced font bracketed by `{ name }` with hover underlines.

  

### Chips & Badges

- **Monospace Code Pill**: Compact stadium containers with `0.25rem` vertical and `0.75rem` horizontal padding. Rendered in pastel fills (e.g., `#FFE7A5`) with a `1px solid #1E1E1E` border, featuring `label-sm` monospaced text.
- **Status Indicator**: Features a solid colored circle (`#34A853` for open applications) paired with a clean text label: `OPEN` (no decorative square brackets).

  

### Asymmetrical Window Cards

- **Structure**: Outer card rendered with pure white surface (`#FFFFFF`), outlined with a continuous `2px solid #1E1E1E`.
- **Window Header**: The top-left features a distinct rounded notch containing three circular window controls (`12px` diameter each, spaced `6px` apart) filled in Core Halftone shades or pure monochrome strokes.
- **Footer Section**: Branded bottom notch displaying the chapter mark alongside recruitment track info.

  

### Form Inputs

- **Text Field**: High-contrast white container, `1.5px solid #1E1E1E`, `12px` border radius, using `body-md` typography.
- **Focus State**: The outline increases to `2px` Core Blue (`#4285F4`) with an offset hard shadow of `2px 2px 0px #4285F4`.
- **Helper & Code Meta**: Positioned below the field in `Google Sans Mono` (clean text without decorative `//` prefixes).

### Checkboxes & Segmented Controls

- **Checkboxes**: Square with softened `4px` corners, `1.5px solid #1E1E1E`, displaying a clean check glyph in crisp white over Core Blue or Core Green when selected.
- **Segmented Pill Bar**: Enclosed capsule container in `#F0F0F0` with a `1.5px solid #1E1E1E` border. Active segment slides via a white pill card with its own border and label.

---

## Text Conventions & Identity Branding

To maintain maximum visual clarity, accessibility, and professional presentation across all screen sizes while preserving the Neo-Brutalist Light aesthetic, enforce the following strict rules:

### 1. No Decorative Slashes (`//`)
- **Rule**: Do NOT use decorative `//` prefixes before headings, sentences, section labels, card labels, footer labels, navigation links, or other UI text.
- **Examples**:
  - `CHAPTER OVERVIEW` (never `// CHAPTER OVERVIEW`)
  - `GDG ON CAMPUS · UVCE` (never `// GDG ON CAMPUS · UVCE`)
  - `Workshop` (never `// Workshop`)
  - `Community` (never `// Community`)
  - `01_structure.html` (never `// 01_structure.html`)
  - `ARCADE_CHALLENGE` (never `// ARCADE_CHALLENGE`)
  - `18-SEC SPEED CHALLENGE` (never `// 18-SEC SPEED CHALLENGE`)
  - `STACK COMPLETE ✓` (never `// STACK COMPLETE ✓`)
- **Functional Exception**: Legitimate code syntax, operators, file paths, or URLs where slashes are syntactically required remain untouched.

### 2. No Decorative Square Brackets (`[ ]`)
- **Rule**: Do NOT wrap UI labels, status indicators, badges, or window tags in decorative square brackets.
- **Examples**:
  - `CHAPTER_PROFILE` (never `[ CHAPTER_PROFILE ]`)
  - `REGISTRATION_PORTAL` (never `[ REGISTRATION_PORTAL ]`)
  - `EVENT_METADATA` (never `[ EVENT_METADATA ]`)
  - `ON CAMPUS` (never `[ ON CAMPUS ]`)
  - `OPEN` (never `[ OPEN ]`)
  - `WEB_STACK_ARCADE` (never `[ WEB_STACK_ARCADE ]`)
  - `WEB STACK` (never `[ WEB STACK ]`)
- **Functional Exception**: Square brackets that are part of functional programming arrays, attribute selectors, or keyboard instructions remain untouched.

### 3. Logo & Visual Branding System
- **Official Asset**: Use the official Google Developer Groups logo (`Logo/Logos/GDG-Main-Logo.png`) across all brand touchpoints:
  - Sticky navigation bar (`.site-nav__brand img`)
  - Hero branding mark (`.hero-logo`)
  - Chapter overview card (`.about-logo`)
  - Footer brand lockup (`.site-footer__brand img`)
  - Browser tab favicon (`<link rel="icon">`) and social card metadata (`og:image`, `twitter:image`)
- **Presentation**: Maintain the established neo-brutalist container conventions:
  - Solid structural outline (`1.5px`–`2px solid #1E1E1E`)
  - Crisp white container fill (`#FFFFFF`) with internal breathing room (`padding: 2px` to `4px`)
  - `object-fit: contain;` to preserve crisp vector geometry without clipping or distortion
  - Hard tactile drop shadow matching the surrounding elevation system.