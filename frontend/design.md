# Design System

## Interactive Product Design System

**Visual direction:** PostHog-inspired, warm, bold, editorial, playful, structural, anti-generic-SaaS.

**Primary design principle:**

> Build interfaces users can manipulate, not interfaces users merely look at.

This document is the single source of truth for the application's visual language, component styling, interaction behavior, responsive rules, accessibility requirements, and workspace interactions.

---

# 1. Design Direction

The application should feel:

* Warm
* Bold
* Playful
* Technical
* Editorial
* Structured
* Slightly unconventional
* Highly interactive
* Fast and responsive
* Deliberately different from generic SaaS dashboards

The visual language should be inspired by the **look and feel of PostHog**, without directly copying its layouts, illustrations, branding assets, or proprietary visual elements.

## Core Principles

1. Warm backgrounds instead of cold white.
2. Near-black typography.
3. Yellow as the primary visual accent.
4. Heavy structural borders.
5. Offset shadows instead of soft blurred shadows.
6. Low border radius.
7. Strong typography hierarchy.
8. Generous whitespace.
9. Interactive elements should communicate their state.
10. Motion should be short and purposeful.
11. Important UI should be keyboard accessible.
12. Drag-and-drop must never be the only way to perform an action.
13. Components should feel physical and manipulable.
14. Avoid generic gradients and excessive glassmorphism.
15. Avoid excessive cards inside cards.

---

# 2. Global Color System

## 2.1 Background Colors

| Token                        | Value     | Usage                              |
| ---------------------------- | --------- | ---------------------------------- |
| `--color-bg`                 | `#EEEFE9` | Global application background      |
| `--color-bg-secondary`       | `#E5E6E0` | Secondary page regions             |
| `--color-bg-tertiary`        | `#D9DAD4` | Subtle section separation          |
| `--color-surface`            | `#F5F5F0` | Cards, panels, controls            |
| `--color-surface-raised`     | `#FFFFFF` | Modals, popovers, elevated content |
| `--color-surface-dark`       | `#1D1F27` | Dark sections and inverted UI      |
| `--color-surface-dark-hover` | `#2E3140` | Hover state for dark surfaces      |

### Rules

* Never use pure white as the global page background.
* White is reserved for raised surfaces.
* Warm off-white should dominate the application.
* Dark surfaces should be used intentionally rather than everywhere.

---

# 3. Brand Colors

| Token                      | Value     | Usage                                 |
| -------------------------- | --------- | ------------------------------------- |
| `--color-primary`          | `#F9BD2B` | Primary CTA, active state, highlights |
| `--color-primary-hover`    | `#E5A800` | Primary hover                         |
| `--color-primary-active`   | `#C48F00` | Primary pressed state                 |
| `--color-primary-muted`    | `#FEF3C7` | Selected/drop/hover backgrounds       |
| `--color-primary-soft`     | `#FFF8DD` | Very subtle yellow surfaces           |
| `--color-secondary`        | `#1D1F27` | Secondary action                      |
| `--color-secondary-hover`  | `#2E3140` | Secondary hover                       |
| `--color-secondary-active` | `#111218` | Secondary pressed                     |

## Accent Rule

Yellow is the dominant accent.

Do not introduce random purple, pink, cyan, or gradient accents.

Semantic colors are permitted for status communication.

---

# 4. Semantic Colors

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-success`       | `#30A46C` | Success                |
| `--color-success-muted` | `#DFF3EB` | Success background     |
| `--color-warning`       | `#F76B15` | Warning                |
| `--color-warning-muted` | `#FFEDD5` | Warning background     |
| `--color-danger`        | `#E5484D` | Error/destructive      |
| `--color-danger-muted`  | `#FFEAEA` | Error background       |
| `--color-info`          | `#0091FF` | Information            |
| `--color-info-muted`    | `#E0F0FF` | Information background |

Semantic colors must not replace the primary yellow for normal interaction states.

---

# 5. Text Colors

| Token                     | Value     | Usage                     |
| ------------------------- | --------- | ------------------------- |
| `--color-text-primary`    | `#1D1F27` | Headings and primary text |
| `--color-text-secondary`  | `#5C5F6B` | Supporting text           |
| `--color-text-tertiary`   | `#9EA0A8` | Metadata/placeholders     |
| `--color-text-inverse`    | `#EEEFE9` | Text on dark surfaces     |
| `--color-text-on-primary` | `#1D1F27` | Text on yellow            |
| `--color-text-link`       | `#1D1F27` | Links                     |
| `--color-text-link-hover` | `#C48F00` | Link hover                |

Links should generally be black with an underline rather than conventional blue.

---

# 6. Borders

Borders are a major part of the visual identity.

## Border Tokens

| Token                     | Value                | Usage                    |
| ------------------------- | -------------------- | ------------------------ |
| `--border-width`          | `2px`                | Default                  |
| `--border-width-heavy`    | `3px`                | Major containers         |
| `--border-width-hairline` | `1px`                | Internal dividers        |
| `--border-default`        | `2px solid #1D1F27`  | Default component border |
| `--border-subtle`         | `1px solid #D0D1CB`  | Secondary divider        |
| `--border-light`          | `1px solid #E5E6E0`  | Very subtle divider      |
| `--border-accent`         | `2px solid #F9BD2B`  | Active state             |
| `--border-danger`         | `2px solid #E5484D`  | Error                    |
| `--border-dashed`         | `2px dashed #D0D1CB` | Drop zones               |

## Border Rules

Default interactive controls use:

```css
border: 2px solid #1D1F27;
```

Do not use soft gray borders as the default for important controls.

---

# 7. Shadows

Avoid conventional blurred SaaS shadows.

Use offset shadows.

| Token             | Value                            |
| ----------------- | -------------------------------- |
| `--shadow-sm`     | `2px 2px 0 #1D1F27`              |
| `--shadow-md`     | `3px 3px 0 #1D1F27`              |
| `--shadow-lg`     | `4px 4px 0 #1D1F27`              |
| `--shadow-xl`     | `6px 6px 0 #1D1F27`              |
| `--shadow-yellow` | `3px 3px 0 #F9BD2B`              |
| `--shadow-focus`  | `0 0 0 3px rgba(249,189,43,.55)` |
| `--shadow-danger` | `0 0 0 3px rgba(229,72,77,.4)`   |

---

# 8. Typography

## Font Family

Primary:

```text
Matter, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Fallback:

```text
Inter, system-ui, sans-serif
```

Monospace:

```text
"Source Code Pro", "Fira Code", monospace
```

## Weight

Use:

* 400 — regular
* 500 — medium
* 600 — semibold
* 700 — bold
* 800 — extra bold

---

# 9. Type Scale

| Token            | Size | Line Height | Weight |
| ---------------- | ---: | ----------: | -----: |
| `--text-hero`    | 72px |        1.05 |    800 |
| `--text-display` | 52px |         1.1 |    700 |
| `--text-h1`      | 40px |        1.15 |    700 |
| `--text-h2`      | 32px |         1.2 |    700 |
| `--text-h3`      | 24px |        1.25 |    600 |
| `--text-h4`      | 18px |        1.35 |    600 |
| `--text-body-lg` | 18px |        1.65 |    400 |
| `--text-body`    | 16px |         1.6 |    400 |
| `--text-body-sm` | 14px |         1.5 |    400 |
| `--text-label`   | 13px |         1.4 |    500 |
| `--text-caption` | 12px |         1.4 |    400 |
| `--text-code`    | 13px |        1.65 |    400 |

## Letter Spacing

Hero:

```text
-0.04em
```

H1/H2:

```text
-0.025em
```

H3/H4:

```text
-0.01em
```

Body:

```text
0
```

Avoid unnecessary uppercase text.

---

# 10. Spacing

Base unit:

```text
4px
```

| Token        | Value |
| ------------ | ----: |
| `--space-1`  |   4px |
| `--space-2`  |   8px |
| `--space-3`  |  12px |
| `--space-4`  |  16px |
| `--space-5`  |  24px |
| `--space-6`  |  32px |
| `--space-7`  |  48px |
| `--space-8`  |  64px |
| `--space-9`  |  96px |
| `--space-10` | 128px |

---

# 11. Border Radius

Use small radius values.

| Token           |  Value |
| --------------- | -----: |
| `--radius-none` |    0px |
| `--radius-sm`   |    2px |
| `--radius-md`   |    4px |
| `--radius-lg`   |    8px |
| `--radius-xl`   |   12px |
| `--radius-full` | 9999px |

## Rules

* Structural panels: 0–4px
* Buttons: 4px
* Inputs: 4px
* Cards: 4px
* Modals: 8px
* Pills/avatars: full radius

Avoid excessive rounded cards.

---

# 12. Buttons

Buttons must feel tactile.

## Button Sizes

| Size   | Height | Horizontal Padding | Font       |
| ------ | -----: | -----------------: | ---------- |
| Small  |   32px |               12px | 13px / 600 |
| Medium |   40px |               16px | 14px / 600 |
| Large  |   48px |               24px | 16px / 700 |

Minimum interactive target:

```text
44px × 44px
```

If the visible button is smaller, its hit area should still be touch accessible.

---

## Primary Button

```text
Background: #F9BD2B
Text: #1D1F27
Border: 2px solid #1D1F27
Shadow: 3px 3px 0 #1D1F27
Radius: 4px
```

### Hover

```text
transform: translateY(-1px)
shadow: 4px 4px 0 #1D1F27
```

### Active

```text
transform: translate(2px, 2px)
shadow: none
```

---

## Secondary Button

```text
Background: #F5F5F0
Text: #1D1F27
Border: 2px solid #1D1F27
Shadow: 3px 3px 0 #1D1F27
```

---

## Dark Button

```text
Background: #1D1F27
Text: #EEEFE9
Border: 2px solid #1D1F27
Shadow: 3px 3px 0 #F9BD2B
```

---

## Ghost Button

```text
Background: transparent
Border: transparent
Shadow: none
Text: #1D1F27
```

Hover:

```text
background: #FEF3C7
border: 2px solid #1D1F27
```

---

## Danger Button

```text
Background: #E5484D
Text: #FFFFFF
Border: 2px solid #C0282D
Shadow: 3px 3px 0 #1D1F27
```

---

## Disabled

```text
opacity: 0.45
cursor: not-allowed
box-shadow: none
```

Disabled controls must remain visually distinguishable without relying solely on opacity.

---

# 13. Icon Buttons

Sizes:

```text
32 × 32
40 × 40
44 × 44
```

Icon sizes:

```text
12 / 16 / 20 / 24px
```

Icon-only buttons require:

```html
aria-label
```

Hover:

```text
background: #FEF3C7
border: 2px solid #1D1F27
```

---

# 14. Inputs

## Standard Input

```text
Height: 40px
Padding: 0 14px
Font: 14px
Background: #FFFFFF
Border: 2px solid #1D1F27
Radius: 4px
```

## Focus

```text
Border: 2px solid #F9BD2B
Box-shadow: 0 0 0 3px rgba(249,189,43,.55)
```

## Error

```text
Border: 2px solid #E5484D
Box-shadow: 0 0 0 3px rgba(229,72,77,.4)
```

## Disabled

```text
Background: #EEEFE9
Border: 1px solid #D0D1CB
Opacity: .6
```

---

# 15. Textarea

Default:

```text
min-height: 96px
resize: vertical
```

Never allow horizontal resizing unless the component explicitly requires it.

---

# 16. Select

Match standard inputs.

Requirements:

* Black border
* White/warm surface
* Custom black chevron
* Yellow focus state
* Keyboard navigation
* Clear selected state

---

# 17. Checkbox

```text
Width: 16px
Height: 16px
Border: 2px solid #1D1F27
Radius: 2px
```

Checked:

```text
Background: #F9BD2B
```

Focus:

```text
yellow focus ring
```

---

# 18. Radio

```text
Size: 16px
Border: 2px solid #1D1F27
```

Selected:

```text
yellow center
```

---

# 19. Toggle

```text
Width: 40px
Height: 22px
Border: 2px solid #1D1F27
Border-radius: 9999px
```

Off:

```text
Background: #D0D1CB
```

On:

```text
Background: #F9BD2B
```

Thumb:

```text
16px circle
```

---

# 20. Cards

Cards are supporting containers, not the default layout mechanism.

## Default

```text
Background: #F5F5F0
Border: 2px solid #1D1F27
Shadow: 3px 3px 0 #1D1F27
Radius: 4px
```

## Raised

```text
Background: #FFFFFF
Border: 2px solid #1D1F27
Shadow: 4px 4px 0 #1D1F27
```

## Accent

```text
Background: #FEF3C7
Border: 2px solid #F9BD2B
Shadow: 3px 3px 0 #F9BD2B
```

## Interactive Card

Hover:

```text
transform: translateY(-2px)
box-shadow: 4px 4px 0 #1D1F27
```

Dragging:

```text
opacity: .88
transform: scale(1.02)
box-shadow: 6px 6px 0 #1D1F27
cursor: grabbing
```

---

# 21. Panels

Panels are first-class interactive objects.

## Default Panel

```text
Background: #F5F5F0
Border: 2px solid #1D1F27
Shadow: 4px 4px 0 #1D1F27
```

## Panel Structure

```text
┌─────────────────────────────────────┐
│ [icon] Title        [−] [□] [×]    │
├─────────────────────────────────────┤
│                                     │
│              Content                │
│                                     │
└─────────────────────────────────────┘
```

---

# 22. Panel Dimensions

| Panel   | Default | Minimum | Maximum |
| ------- | ------: | ------: | ------: |
| Small   |   320px |   240px |   440px |
| Medium  |   420px |   300px |   640px |
| Large   |   560px |   360px |   840px |
| Sidebar |   248px |   200px |   400px |

Panel height:

```text
min-height: 180px
```

Panels must not resize below usable content dimensions.

---

# 23. Panel Header

```text
Height: 44px
Background: #E5E6E0
Border-bottom: 2px solid #1D1F27
Padding: 0 12px
```

Title:

```text
13px
font-weight: 600
```

Controls:

```text
28px minimum visual button
44px accessible hit area
```

Controls:

* Minimize
* Maximize
* Close

Use Lucide icons instead of text characters when possible.

---

# 24. Panel States

## Default

Normal border and shadow.

## Active

```text
border: 2px solid #F9BD2B
box-shadow: 4px 4px 0 #F9BD2B
```

## Dragging

```text
opacity: .94
scale: 1.01
box-shadow: 6px 6px 0 #1D1F27
z-index: active
cursor: grabbing
```

## Resizing

```text
cursor: appropriate resize cursor
```

## Minimized

Only header remains visible.

```text
height: 44px
```

Content is hidden, not destroyed.

## Maximized

Panel fills the available workspace.

## Closed

Panel is removed from the visible workspace but its state remains recoverable if the application supports reopening.

---

# 25. Panel Dragging

Only the panel header should initiate dragging unless the panel explicitly supports whole-surface dragging.

Do not allow dragging from:

* Buttons
* Inputs
* Selects
* Textareas
* Links
* Sliders
* Interactive controls

Dragging behavior:

```text
pointerdown
→ drag threshold
→ drag state
→ active z-index
→ visual lift
→ placeholder
→ drop
→ settle animation
```

Recommended drag threshold:

```text
4–8px
```

This prevents accidental movement.

---

# 26. Panel Resizing

Panels may resize horizontally, vertically, or both depending on the layout.

Resize handles:

```text
Edge hit area: 6px
Corner hit area: 12px
```

Minimum dimensions must always be enforced.

Resize feedback:

```text
cursor: col-resize
cursor: row-resize
cursor: nwse-resize
```

During resizing:

* Do not animate width/height.
* Update dimensions immediately.
* Prevent content from escaping the panel.
* Preserve minimum dimensions.
* Preserve maximum dimensions.

---

# 27. Window Management

Interactive workspace windows must support:

```text
Open
Close
Move
Resize
Minimize
Maximize
Restore
Focus
Reorder
```

Each window should maintain:

```text
id
x
y
width
height
isOpen
isMinimized
isMaximized
zIndex
```

The active window receives the highest active z-index.

---

# 28. Z-Index

| Token              | Value |
| ------------------ | ----: |
| `--z-base`         |     0 |
| `--z-raised`       |    10 |
| `--z-dropdown`     |   100 |
| `--z-sticky`       |   200 |
| `--z-drawer`       |   300 |
| `--z-panel-base`   |   400 |
| `--z-panel-active` |   450 |
| `--z-modal`        |   500 |
| `--z-overlay`      |   600 |
| `--z-toast`        |   700 |
| `--z-tooltip`      |   800 |

---

# 29. Sidebar

Desktop:

```text
Width: 248px
Min: 200px
Max: 400px
Background: #EEEFE9
Border-right: 2px solid #1D1F27
```

Collapse:

```text
248px → 56px
```

Mobile:

```text
sidebar → drawer
```

Sidebar items:

```text
height: 40–44px
padding: 0 12px
```

Active:

```text
background: #F9BD2B
color: #1D1F27
border: 2px solid #1D1F27
```

---

# 30. Drawers

Default width:

```text
320px
```

Large drawer:

```text
420px
```

Background:

```text
#FFFFFF
```

Border:

```text
2px solid #1D1F27
```

Shadow:

```text
6px 6px 0 #1D1F27
```

Entrance:

```text
translateX(100%) → translateX(0)
240ms
```

Escape must close the drawer.

---

# 31. Modals

Default:

```text
max-width: 540px
```

Large:

```text
max-width: 720px
```

Mobile:

```text
width: 100%
```

Style:

```text
Background: #FFFFFF
Border: 2px solid #1D1F27
Shadow: 6px 6px 0 #1D1F27
Radius: 8px
```

Backdrop:

```text
rgba(29,31,39,.55)
```

Do not use backdrop blur by default.

---

# 32. Modal Animation

Entrance:

```text
opacity: 0 → 1
scale: .97 → 1
180ms
```

Exit:

```text
opacity: 1 → 0
scale: 1 → .97
120ms
```

Escape closes the modal unless the modal explicitly represents an irreversible workflow.

---

# 33. Dropdowns

```text
Background: #FFFFFF
Border: 2px solid #1D1F27
Shadow: 4px 4px 0 #1D1F27
Radius: 8px
Min-width: 160px
```

Menu item:

```text
height: 36px
padding: 0 16px
```

Hover:

```text
background: #FEF3C7
```

Active:

```text
background: #F9BD2B
```

---

# 34. Popovers

```text
Background: #FFFFFF
Border: 2px solid #1D1F27
Shadow: 4px 4px 0 #1D1F27
Radius: 8px
Padding: 16px
```

Entrance:

```text
opacity: 0 → 1
scale: .97 → 1
140ms
```

---

# 35. Tooltips

```text
Background: #1D1F27
Text: #EEEFE9
Font: 12px / 500
Padding: 4px 10px
Radius: 2px
Max-width: 220px
```

Show delay:

```text
350ms
```

Tooltips must not be the only place where critical information exists.

---

# 36. Tabs

```text
Height: 44px
Border-bottom: 2px solid #1D1F27
```

Tab:

```text
padding: 0 16px
```

Inactive:

```text
color: #5C5F6B
```

Hover:

```text
background: #FEF3C7
```

Active:

```text
font-weight: 700
border-bottom: 3px solid #F9BD2B
```

Mobile tabs should become horizontally scrollable when necessary.

---

# 37. Tables

Wrapper:

```text
border: 2px solid #1D1F27
border-radius: 4px
overflow: hidden
```

Header:

```text
height: 48px
background: #E5E6E0
border-bottom: 2px solid #1D1F27
```

Rows:

```text
min-height: 48px
```

Row divider:

```text
1px solid #D0D1CB
```

Hover:

```text
background: #FEF3C7
```

Selected:

```text
background: #FEF3C7
border-left: 3px solid #F9BD2B
```

---

# 38. Badges

Height:

```text
20px
```

Padding:

```text
0 8px
```

Font:

```text
12px / 500
```

Radius:

```text
2px
```

Variants:

### Default

```text
background: #EEEFE9
border: 1px solid #D0D1CB
color: #5C5F6B
```

### Primary

```text
background: #FEF3C7
border: 1px solid #F9BD2B
```

### Success

```text
background: #DFF3EB
border: 1px solid #30A46C
```

### Warning

```text
background: #FFEDD5
border: 1px solid #F76B15
```

### Danger

```text
background: #FFEAEA
border: 1px solid #E5484D
```

---

# 39. Chips

Height:

```text
30px
```

Padding:

```text
0 12px
```

Default:

```text
background: #F5F5F0
border: 2px solid #1D1F27
```

Selected:

```text
background: #F9BD2B
```

Interactive chips should support keyboard activation and removal.

---

# 40. Avatars

Sizes:

```text
24px
32px
40px
48px
64px
```

Radius:

```text
9999px
```

Border:

```text
2px solid #1D1F27
```

Use yellow or warm-neutral fallback backgrounds.

---

# 41. Links

Default:

```text
color: #1D1F27
text-decoration: underline
text-decoration-thickness: 1px
```

Hover:

```text
color: #C48F00
```

Do not use default browser blue.

---

# 42. Dividers

Primary:

```text
2px solid #1D1F27
```

Secondary:

```text
1px solid #D0D1CB
```

Decorative:

```text
1px solid #E5E6E0
```

---

# 43. Drag & Drop System

Drag-and-drop should be used where it provides meaningful manipulation.

Examples:

* Dashboard widgets
* Workspace panels
* Kanban cards
* Files
* Images
* Blocks
* Components
* Navigation items
* Collections

---

# 44. Drag States

## Idle

```text
cursor: default
```

## Hover

```text
cursor: grab
```

Interactive draggable elements may receive:

```text
border-color: #F9BD2B
```

## Dragging

```text
cursor: grabbing
opacity: .88
scale: 1.02
shadow: 6px 6px 0 #1D1F27
z-index: active
```

## Placeholder

```text
border: 2px dashed #D0D1CB
background: #FEF3C7
opacity: .5
```

---

# 45. Drop Zones

## Valid

```text
background: #FEF3C7
border: 2px dashed #F9BD2B
```

## Invalid

```text
background: rgba(229,72,77,.1)
border: 2px dashed #E5484D
```

## Drop

Use a short settle animation:

```text
scale: 1.02 → 1
180ms
```

---

# 46. Drag Accessibility

Dragging must never be the only operation.

Provide an alternative such as:

```text
Move
Move to...
Reorder
Send to...
```

Keyboard users must be able to:

1. Focus the item.
2. Enter move mode.
3. Select destination.
4. Confirm movement.
5. Cancel movement.

Escape cancels an active drag operation where technically possible.

---

# 47. Reordering

For sortable lists:

```text
drag
→ placeholder
→ reorder
→ drop
→ settle
```

Keyboard alternative:

```text
Move up
Move down
Move to...
```

The current position should be communicated to assistive technology.

---

# 48. Expand / Collapse

Expandable content should use:

```text
opacity
transform
height/layout transition
```

Do not use abrupt visibility changes for normal interactions.

Default duration:

```text
180ms
```

Expanded controls should clearly indicate state.

Use:

```text
aria-expanded
```

when appropriate.

---

# 49. Fullscreen

Good fullscreen candidates:

* Images
* Videos
* Editors
* Maps
* Visualizations
* Large canvases
* Documents
* Workspace panels

Fullscreen must provide:

* Close button
* Escape support
* Clear visual context
* Preserved state

---

# 50. Image Viewer

Thumbnail:

```text
cursor: zoom-in
```

Open:

```text
image → expanded viewer
```

Viewer:

```text
background: rgba(29,31,39,.75)
```

Controls:

* Zoom in
* Zoom out
* Reset
* Fullscreen
* Close

Keyboard:

```text
Escape = close
+ = zoom in
- = zoom out
0 = reset
```

---

# 51. Zoom System

Default:

```text
100%
```

Allowed:

```text
25% → 400%
```

Controls:

```text
−
100%
+
```

Optional:

```text
Fit
Reset
```

Do not apply zoom to ordinary webpage content.

Zoom is intended for:

* Canvas
* Diagram
* Image
* Map
* Design workspace
* Large visualization

---

# 52. Loading States

## Skeleton

Use warm neutral tones.

```text
background: #E5E6E0
```

Animated shimmer must remain subtle.

## Spinner

```text
20px
2px stroke
yellow
```

## Progress

```text
height: 4px
track: #D0D1CB
fill: #F9BD2B
```

## Button Loading

The button retains its dimensions.

Replace the label with a spinner.

Do not allow layout jumping.

---

# 53. Empty States

Empty states should be informative and slightly playful.

Structure:

```text
Illustration/icon
Heading
Short explanation
Primary action
Optional secondary action
```

Avoid giant empty illustrations that dominate the page.

---

# 54. Error States

Errors should explain:

1. What happened.
2. Why it matters.
3. What the user can do next.

Use:

```text
danger border
danger-muted background
clear message
recovery action
```

Never rely on color alone.

---

# 55. Toast Notifications

Position:

```text
bottom-right
```

Desktop width:

```text
320–420px
```

Mobile:

```text
full width minus 16px margins
```

Style:

```text
background: #1D1F27
color: #EEEFE9
border: 2px solid #1D1F27
shadow: 4px 4px 0 #F9BD2B
```

Toast types:

* Success
* Information
* Warning
* Error

Include close control for persistent notifications.

---

# 56. Navigation

Primary navigation should be:

* Clear
* Compact
* Highly legible
* Keyboard accessible

Navigation item height:

```text
40–44px
```

Active navigation:

```text
yellow background
black text
black border
```

Do not use gradients for navigation.

---

# 57. Header

Recommended desktop height:

```text
64px
```

Mobile:

```text
56px
```

Header:

```text
background: #EEEFE9
border-bottom: 2px solid #1D1F27
```

Header controls must use 44px accessible targets.

---

# 58. Workspace Layout

Interactive workspaces should feel like a canvas rather than a traditional dashboard.

Workspace:

```text
position: relative
overflow: hidden
background: #EEEFE9
```

Objects may:

* Move
* Resize
* Focus
* Minimize
* Maximize
* Close
* Reopen

Avoid forcing every object into a rigid grid when free positioning provides meaningful value.

---

# 59. Workspace Grid

Optional grid:

```text
grid size: 8px
```

Snap:

```text
8px
```

Snapping should be subtle.

Do not visually overwhelm the workspace with grid lines.

---

# 60. Workspace Interaction

When a panel is selected:

```text
yellow border
```

When moved:

```text
shadow increases
```

When resized:

```text
dimensions update live
```

When dropped:

```text
settle animation
```

When minimized:

```text
header remains accessible
```

---

# 61. Workspace Persistence

When appropriate, persist:

```text
position
size
order
minimized state
selected state
open panels
zoom
```

Recommended storage:

```text
localStorage
```

or application-level persistence where user accounts are involved.

State must be restored without causing layout jumps.

---

# 62. Mobile Workspace

Do not simply shrink desktop windows.

On mobile:

```text
floating panel
→ full-screen sheet
```

Sidebars:

```text
persistent sidebar
→ drawer
```

Resizable panels:

```text
stacked panels
```

Drag:

```text
simplified touch interaction
```

All controls:

```text
minimum 44 × 44px
```

---

# 63. Responsive Breakpoints

| Token      |  Value |
| ---------- | -----: |
| `--bp-sm`  |  480px |
| `--bp-md`  |  768px |
| `--bp-lg`  | 1024px |
| `--bp-xl`  | 1280px |
| `--bp-2xl` | 1536px |

---

# 64. Responsive Rules

## Desktop

```text
Sidebar: persistent
Panels: floating/resizable
Cards: 3–4 columns
Modal: centered
Workspace: free positioning
```

## Tablet

```text
Sidebar: collapsible
Panels: constrained
Cards: 2 columns
Workspace: reduced free space
```

## Mobile

```text
Sidebar: drawer
Panels: full-screen sheets
Cards: 1 column
Tabs: horizontal scrolling
Modals: bottom/full-width sheet
```

---

# 65. Motion

Motion should communicate:

* State
* Direction
* Hierarchy
* Cause and effect

Do not animate purely for decoration.

---

# 66. Duration

| Token                 | Duration |
| --------------------- | -------: |
| `--duration-instant`  |     60ms |
| `--duration-fast`     |     80ms |
| `--duration-base`     |    120ms |
| `--duration-moderate` |    180ms |
| `--duration-slow`     |    240ms |
| `--duration-slower`   |    320ms |

---

# 67. Easing

```text
--ease-out:
cubic-bezier(0, 0, 0.2, 1)

--ease-in:
cubic-bezier(0.4, 0, 1, 1)

--ease-in-out:
cubic-bezier(0.4, 0, 0.2, 1)

--ease-spring:
cubic-bezier(0.34, 1.4, 0.64, 1)
```

---

# 68. Interaction Motion

## Hover

```text
120ms
```

## Button press

```text
translateY(2px)
80ms
```

## Panel open

```text
scale(.97) → scale(1)
opacity 0 → 1
180ms
```

## Drawer

```text
translateX(100%) → translateX(0)
240ms
```

## Drag lift

```text
scale(1) → scale(1.02)
80ms
```

## Drop

```text
scale(1.02) → scale(1)
180ms
```

---

# 69. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Reduced motion must preserve functionality.

---

# 70. Icons

Preferred library:

```text
Lucide
```

Style:

```text
outline
2px stroke
```

Sizes:

```text
12
16
20
24
32
```

Default:

```text
16px
```

Icons inherit text color unless the icon communicates semantic status.

Do not mix unrelated icon styles.

---

# 71. Scrollbars

Desktop:

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #EEEFE9;
}

::-webkit-scrollbar-thumb {
  background: #D0D1CB;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9EA0A8;
}
```

Mobile should rely primarily on native scrolling behavior.

---

# 72. Focus

Every interactive element must have visible keyboard focus.

Default:

```text
0 0 0 3px rgba(249,189,43,.55)
```

Do not remove browser focus indicators without replacing them with a stronger equivalent.

---

# 73. Accessibility

Requirements:

* Keyboard navigation
* Visible focus
* Escape to close overlays
* ARIA labels
* ARIA expanded states
* ARIA selected states where applicable
* Screen-reader-friendly controls
* Reduced-motion support
* Minimum 44px touch targets
* Drag alternatives
* No color-only communication

---

# 74. Keyboard Shortcuts

Where appropriate:

| Shortcut           | Action                          |
| ------------------ | ------------------------------- |
| `Escape`           | Close/cancel                    |
| `Enter`            | Activate                        |
| `Space`            | Toggle/activate                 |
| `Arrow keys`       | Navigate                        |
| `Cmd/Ctrl + K`     | Command/search                  |
| `Cmd/Ctrl + Enter` | Confirm                         |
| `Delete/Backspace` | Delete selected item where safe |

Destructive keyboard actions should require appropriate confirmation when necessary.

---

# 75. Focus Management

When opening:

```text
Modal → focus first meaningful control
Drawer → focus drawer content
Menu → focus first menu item
```

When closing:

```text
return focus to triggering element
```

Do not allow keyboard focus to disappear behind overlays.

---

# 76. Forms

Form structure:

```text
Label
Input
Helper text
Error text
```

Spacing:

```text
label → input: 8px
input → helper: 6px
field → field: 16–24px
```

Labels must not depend on placeholders.

---

# 77. Search

Search field:

```text
height: 40px
background: #FFFFFF
border: 2px solid #1D1F27
```

Focused:

```text
yellow focus ring
```

Search results:

```text
hover: yellow-muted
selected: yellow
```

Keyboard:

```text
↑ ↓ = navigate
Enter = select
Escape = close
```

---

# 78. Command Menu

Command menu:

```text
width: 560px
max-width: calc(100vw - 32px)
```

Visual:

```text
white surface
2px black border
6px offset shadow
8px radius
```

Search field at top.

Items:

```text
height: 40px
```

Selected:

```text
background: #FEF3C7
```

---

# 79. Context Menus

Context menus should:

* Appear near the interaction point.
* Stay within viewport.
* Support keyboard navigation.
* Close on Escape.
* Close when clicking outside.

Use the same menu visual language as dropdowns.

---

# 80. Toolbars

Toolbar:

```text
height: 48px
background: #F5F5F0
border: 2px solid #1D1F27
```

Controls should be grouped logically.

Avoid filling every toolbar with buttons.

Use separators only when they clarify grouping.

---

# 81. Segmented Controls

Container:

```text
background: #E5E6E0
border: 2px solid #1D1F27
padding: 2px
radius: 4px
```

Selected:

```text
background: #F9BD2B
```

Minimum item height:

```text
36px
```

---

# 82. Pagination

Pagination controls:

```text
minimum 40px
```

Active:

```text
background: #F9BD2B
border: 2px solid #1D1F27
```

Disabled:

```text
opacity: .45
```

---

# 83. Date / Time Controls

Use standard input styling.

Calendar:

```text
white surface
black border
yellow selected date
warm-neutral hover
```

Current date should have a non-color-only visual marker.

---

# 84. File Upload

Drop zone:

```text
border: 2px dashed #D0D1CB
background: #F5F5F0
min-height: 160px
```

Drag over:

```text
border: 2px dashed #F9BD2B
background: #FEF3C7
```

Invalid:

```text
border: 2px dashed #E5484D
background: #FFEAEA
```

Always provide:

```text
Browse files
```

as a non-drag alternative.

---

# 85. Image Cards

Image cards should support:

```text
hover
preview
expand
fullscreen
```

Hover:

```text
scale: 1.01
```

Do not over-animate images.

---

# 86. Video

Video containers may support:

```text
play
pause
volume
seek
fullscreen
```

Fullscreen:

```text
Escape = exit
```

Controls should remain discoverable.

---

# 87. Notifications

Notifications must have:

* Clear message
* Status
* Optional action
* Dismiss control
* Appropriate semantic color

Never communicate important status using color alone.

---

# 88. Confirmation Dialogs

Use for:

* Permanent deletion
* Account-level destructive operations
* Irreversible changes

Avoid confirmation dialogs for routine reversible actions.

Whenever possible prefer:

```text
Delete
→ Undo
```

over unnecessary confirmation.

---

# 89. Undo

For reversible actions, show a toast:

```text
Item moved
[Undo]
```

Undo duration:

```text
5–8 seconds
```

Undo should restore the previous application state.

---

# 90. Selection

Selected elements should use:

```text
background: #FEF3C7
border: 2px solid #F9BD2B
```

Do not use only a tiny color change to indicate selection.

---

# 91. Hover

Hover should be subtle.

Preferred:

```text
background shift
small translation
border highlight
shadow adjustment
```

Avoid:

* Large scaling
* Rotations
* Flashing
* Continuous animation

---

# 92. Cursor Rules

| Interaction       | Cursor                      |
| ----------------- | --------------------------- |
| Normal            | `default`                   |
| Link              | `pointer`                   |
| Button            | `pointer`                   |
| Draggable         | `grab`                      |
| Dragging          | `grabbing`                  |
| Horizontal resize | `col-resize`                |
| Vertical resize   | `row-resize`                |
| Corner resize     | `nwse-resize` / appropriate |
| Disabled          | `not-allowed`               |
| Zoom              | `zoom-in` / `zoom-out`      |

---

# 93. Content Width

Recommended maximum reading width:

```text
720px
```

Standard application content:

```text
1200–1440px
```

Wide workspace:

```text
100%
```

Do not create unnecessarily narrow desktop layouts.

---

# 94. Page Layout

Recommended page padding:

Desktop:

```text
32–64px
```

Tablet:

```text
24–32px
```

Mobile:

```text
16px
```

Major sections:

```text
64–128px
```

---

# 95. Grid

Base spacing:

```text
8px
```

Recommended columns:

Desktop:

```text
12-column grid
```

Tablet:

```text
8-column grid
```

Mobile:

```text
4-column grid
```

Use grid only when it improves structure.

---

# 96. Surface Hierarchy

Visual hierarchy should generally be:

```text
App background
    ↓
Surface
    ↓
Raised surface
    ↓
Active surface
    ↓
Modal / overlay
```

Hierarchy should be established through:

1. Position
2. Typography
3. Border
4. Contrast
5. Shadow

Do not rely entirely on shadows.

---

# 97. Design Anti-Patterns

Do NOT use:

* Generic purple SaaS gradients
* Excessive glassmorphism
* Huge rounded cards
* Soft blurry shadows everywhere
* Random colors
* Excessive animation
* Tiny buttons
* Tiny labels
* All-caps UI
* Blue default links
* Inconsistent icon sets
* Unnecessary floating buttons
* Nested cards without purpose
* Hover-only critical interactions
* Drag-only interactions
* Unrecoverable destructive actions

---

# 98. Component State Model

Every interactive component should explicitly model states.

Common states:

```text
default
hover
focus
active
selected
disabled
loading
error
success
dragging
drop-target
expanded
collapsed
minimized
maximized
```

Do not create visual states without updating the underlying application state.

---

# 99. Component Naming

Components should use predictable names.

Examples:

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Toggle
Card
Panel
Modal
Drawer
Tabs
Table
Badge
Chip
Tooltip
Popover
Dropdown
Toast
Sidebar
Toolbar
CommandMenu
FileDropzone
ImageViewer
Workspace
WorkspacePanel
```

---

# 100. CSS Architecture

Use design tokens rather than hardcoded values.

Preferred:

```css
background: var(--color-surface);
border: var(--border-default);
box-shadow: var(--shadow-md);
border-radius: var(--radius-md);
padding: var(--space-4);
```

Avoid repeatedly writing:

```css
background: #F5F5F0;
border: 2px solid #1D1F27;
```

Tokens are the source of truth.

---

# 101. Global CSS Variables

```css
:root {
  /* Background */
  --color-bg: #EEEFE9;
  --color-bg-secondary: #E5E6E0;
  --color-bg-tertiary: #D9DAD4;

  /* Surfaces */
  --color-surface: #F5F5F0;
  --color-surface-raised: #FFFFFF;
  --color-surface-dark: #1D1F27;
  --color-surface-dark-hover: #2E3140;

  /* Brand */
  --color-primary: #F9BD2B;
  --color-primary-hover: #E5A800;
  --color-primary-active: #C48F00;
  --color-primary-muted: #FEF3C7;
  --color-primary-soft: #FFF8DD;

  --color-secondary: #1D1F27;
  --color-secondary-hover: #2E3140;
  --color-secondary-active: #111218;

  /* Semantic */
  --color-success: #30A46C;
  --color-success-muted: #DFF3EB;
  --color-warning: #F76B15;
  --color-warning-muted: #FFEDD5;
  --color-danger: #E5484D;
  --color-danger-muted: #FFEAEA;
  --color-info: #0091FF;
  --color-info-muted: #E0F0FF;

  /* Borders */
  --color-border: #1D1F27;
  --color-border-subtle: #D0D1CB;
  --color-border-light: #E5E6E0;

  /* Text */
  --color-text-primary: #1D1F27;
  --color-text-secondary: #5C5F6B;
  --color-text-tertiary: #9EA0A8;
  --color-text-inverse: #EEEFE9;
  --color-text-on-primary: #1D1F27;
  --color-text-link: #1D1F27;
  --color-text-link-hover: #C48F00;

  /* Overlay */
  --color-overlay: rgba(29,31,39,.55);
  --color-overlay-light: rgba(29,31,39,.25);

  /* Fonts */
  --font-sans: "Matter", "Inter", system-ui, sans-serif;
  --font-mono: "Source Code Pro", "Fira Code", monospace;

  /* Typography */
  --text-hero: 72px;
  --text-display: 52px;
  --text-h1: 40px;
  --text-h2: 32px;
  --text-h3: 24px;
  --text-h4: 18px;
  --text-body-lg: 18px;
  --text-body: 16px;
  --text-body-sm: 14px;
  --text-label: 13px;
  --text-caption: 12px;
  --text-code: 13px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;

  /* Radius */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Borders */
  --border-width: 2px;
  --border-width-heavy: 3px;
  --border-width-hairline: 1px;
  --border-default: 2px solid #1D1F27;
  --border-subtle: 1px solid #D0D1CB;
  --border-light: 1px solid #E5E6E0;
  --border-accent: 2px solid #F9BD2B;
  --border-danger: 2px solid #E5484D;
  --border-dashed: 2px dashed #D0D1CB;

  /* Shadows */
  --shadow-sm: 2px 2px 0 #1D1F27;
  --shadow-md: 3px 3px 0 #1D1F27;
  --shadow-lg: 4px 4px 0 #1D1F27;
  --shadow-xl: 6px 6px 0 #1D1F27;
  --shadow-yellow: 3px 3px 0 #F9BD2B;
  --shadow-focus: 0 0 0 3px rgba(249,189,43,.55);
  --shadow-danger: 0 0 0 3px rgba(229,72,77,.4);

  /* Motion */
  --duration-instant: 60ms;
  --duration-fast: 80ms;
  --duration-base: 120ms;
  --duration-moderate: 180ms;
  --duration-slow: 240ms;
  --duration-slower: 320ms;

  --ease-out: cubic-bezier(0,0,.2,1);
  --ease-in: cubic-bezier(.4,0,1,1);
  --ease-in-out: cubic-bezier(.4,0,.2,1);
  --ease-spring: cubic-bezier(.34,1.4,.64,1);

  /* Breakpoints */
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;

  /* Z-index */
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-drawer: 300;
  --z-panel-base: 400;
  --z-panel-active: 450;
  --z-modal: 500;
  --z-overlay: 600;
  --z-toast: 700;
  --z-tooltip: 800;
}
```

---

# 102. Global Reset

Use a predictable reset.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  background: var(--color-bg);
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

img,
svg,
video {
  max-width: 100%;
}

a {
  color: var(--color-text-link);
}
```

---

# 103. Responsive Interaction Rules

## Desktop

Prioritize:

* Free workspace movement
* Resizing
* Multiple panels
* Keyboard shortcuts
* Hover feedback
* Multi-column layouts

## Tablet

Prioritize:

* Collapsible navigation
* Constrained panels
* Touch-friendly controls
* Reduced simultaneous windows

## Mobile

Prioritize:

* Full-screen sheets
* Drawers
* Vertical stacking
* Touch-friendly actions
* Simplified drag
* Explicit move controls

Never depend on hover on mobile.

---

# 104. Touch Interaction

Touch targets:

```text
minimum 44 × 44px
```

Dragging should use sufficient movement thresholds to prevent accidental activation.

Avoid placing tiny controls next to one another.

For complex drag operations on mobile, provide:

```text
Move
Reorder
Move to...
```

actions.

---

# 105. Performance Rules

Interactive UI must remain responsive.

Avoid:

* Expensive continuous re-renders during drag
* Layout thrashing
* Large synchronous animations
* Unnecessary DOM updates
* Animating width/height when transform can be used

Prefer:

```text
transform
opacity
```

for animation.

For workspace dragging/resizing, throttle or otherwise efficiently process pointer updates.

---

# 106. Animation Rules

Never animate:

* Every page element simultaneously
* Large typography unnecessarily
* Backgrounds continuously
* Decorative elements indefinitely

Animations must communicate state or spatial relationships.

---

# 107. Persistence Rules

If users rearrange the interface, preserve meaningful changes.

Persist:

```text
panel positions
panel dimensions
panel order
panel open state
panel minimized state
sidebar width
sidebar state
workspace zoom
```

Do not persist transient states such as:

```text
hover
focus
temporary drag state
loading
```

---

# 108. State Recovery

Users should be able to recover from:

* Accidental movement
* Accidental deletion
* Accidental closing
* Incorrect resize

Preferred recovery patterns:

```text
Undo
Restore
Reset layout
Reopen
Move to...
```

Provide a:

```text
Reset workspace
```

action when the interface supports extensive customization.

---

# 109. Layout Reset

Reset should restore:

```text
default panel positions
default dimensions
default order
default sidebar state
default zoom
```

Reset must not silently destroy user data.

---

# 110. Component Consistency Rules

Every component must use:

* Design tokens
* Consistent borders
* Consistent radius
* Consistent typography
* Consistent focus states
* Consistent motion
* Consistent semantic colors
* Consistent interaction patterns

A component should never introduce its own random visual language.

---

# 111. Visual Hierarchy Rules

Prioritize hierarchy in this order:

```text
1. Typography
2. Layout
3. Contrast
4. Border
5. Accent
6. Shadow
```

Do not solve every hierarchy problem using a card or shadow.

---

# 112. PostHog-Inspired Visual Rules

The application should consistently preserve these traits:

### Warm

Use:

```text
#EEEFE9
#F5F5F0
#FFFFFF
```

instead of a cold gray/white SaaS palette.

### Bold

Use:

```text
2px black borders
```

as a major visual primitive.

### Yellow

Use:

```text
#F9BD2B
```

for:

* Primary CTA
* Active navigation
* Selected state
* Focus
* Drop targets
* Highlights

### Physical

Use:

```text
offset shadows
```

instead of generic blur.

### Editorial

Use:

* Large typography
* Strong whitespace
* Uneven visual rhythm where appropriate
* Interesting compositions

### Restrained

Avoid:

* Rainbow UI
* Excessive gradients
* Excessive rounded corners
* Excessive shadows
* Excessive cards

---

# 113. Component Interaction Matrix

| Component      | Hover | Focus | Drag     | Resize   | Expand   | Minimize | Fullscreen |
| -------------- | ----- | ----- | -------- | -------- | -------- | -------- | ---------- |
| Button         | Yes   | Yes   | No       | No       | No       | No       | No         |
| Card           | Yes   | Yes   | Optional | No       | Optional | No       | Optional   |
| Panel          | Yes   | Yes   | Yes      | Yes      | Yes      | Yes      | Yes        |
| Image          | Yes   | Yes   | Optional | No       | Yes      | No       | Yes        |
| Sidebar        | Yes   | Yes   | No       | Optional | Yes      | Yes      | No         |
| Drawer         | Yes   | Yes   | No       | Optional | Yes      | No       | No         |
| Modal          | Yes   | Yes   | No       | Optional | Yes      | No       | Yes        |
| Table row      | Yes   | Yes   | Optional | No       | Optional | No       | No         |
| Workspace item | Yes   | Yes   | Yes      | Yes      | Yes      | Yes      | Yes        |

Interactions must only be implemented when they provide genuine utility.

---

# 114. Design QA Checklist

Before shipping any screen, verify:

## Colors

* [ ] Background uses warm palette.
* [ ] Primary actions use yellow.
* [ ] Text uses near-black.
* [ ] Semantic colors are used consistently.
* [ ] No unnecessary accent colors.

## Typography

* [ ] Heading hierarchy is obvious.
* [ ] Body text is readable.
* [ ] Font weights are consistent.
* [ ] No unnecessary uppercase labels.

## Components

* [ ] Buttons use correct dimensions.
* [ ] Inputs use correct borders.
* [ ] Cards use correct shadows.
* [ ] Panels use correct headers.
* [ ] Modals use correct overlay.
* [ ] Dropdowns follow menu pattern.
* [ ] Tables follow table pattern.

## Interaction

* [ ] Hover states exist where appropriate.
* [ ] Focus states are visible.
* [ ] Active states are visible.
* [ ] Drag feedback is clear.
* [ ] Drop zones are visible.
* [ ] Resize feedback is clear.
* [ ] Minimize preserves state.
* [ ] Maximize preserves context.
* [ ] Close actions are recoverable where appropriate.
* [ ] Fullscreen has an obvious exit.

## Accessibility

* [ ] Keyboard navigation works.
* [ ] Escape closes overlays.
* [ ] Focus is restored.
* [ ] Icon buttons have labels.
* [ ] Dragging has a keyboard alternative.
* [ ] Touch targets are at least 44px.
* [ ] Reduced motion is supported.
* [ ] Color is not the only state indicator.

## Responsive

* [ ] Desktop works.
* [ ] Tablet works.
* [ ] Mobile works.
* [ ] Sidebars become drawers.
* [ ] Floating panels become sheets where appropriate.
* [ ] Controls remain touch accessible.
* [ ] Hover is never required for critical functionality.

---

# 115. Final Design Contract

This design system is mandatory for all new UI.

When creating a new component:

1. Check whether an existing component already solves the problem.
2. Reuse existing tokens.
3. Reuse existing interaction patterns.
4. Reuse existing motion.
5. Maintain the warm PostHog-inspired visual identity.
6. Avoid introducing unnecessary colors.
7. Avoid introducing unnecessary rounded surfaces.
8. Avoid introducing soft generic SaaS shadows.
9. Make meaningful elements interactive.
10. Preserve state.
11. Provide keyboard alternatives.
12. Support responsive behavior.
13. Support reduced motion.
14. Ensure the component remains usable without drag-and-drop.
15. Test hover, focus, active, disabled, loading, error, and selected states where relevant.

The finished application should feel like a **coherent interactive product system**, not a collection of unrelated pages.

---

# 116. Definition of Done

A screen is considered complete only when:

```text
Visual Design
    ✓ Correct background
    ✓ Correct typography
    ✓ Correct borders
    ✓ Correct shadows
    ✓ Correct spacing
    ✓ Correct component styling

Interaction
    ✓ Hover
    ✓ Focus
    ✓ Active
    ✓ Drag where useful
    ✓ Drop where useful
    ✓ Resize where useful
    ✓ Expand where useful
    ✓ Minimize where useful
    ✓ Fullscreen where useful

State
    ✓ State is stored
    ✓ State transitions correctly
    ✓ State survives rerender
    ✓ Recoverable actions exist

Responsive
    ✓ Desktop
    ✓ Tablet
    ✓ Mobile
    ✓ Touch

Accessibility
    ✓ Keyboard
    ✓ Focus
    ✓ Escape
    ✓ ARIA where appropriate
    ✓ Reduced motion
    ✓ Non-drag alternative

Quality
    ✓ No visual-only fake interactions
    ✓ No unexplained animations
    ✓ No unnecessary dependencies
    ✓ No random colors
    ✓ No inconsistent components
```

---

# 117. Design Philosophy Summary

The application should feel:

**Warm like an editorial workspace.**

**Bold like a physical interface.**

**Playful without becoming childish.**

**Technical without becoming sterile.**

**Interactive without becoming gimmicky.**

**Structured without becoming generic.**

The visual foundation is:

```text
Warm off-white
        +
Near-black ink
        +
Punchy yellow
        +
Heavy borders
        +
Offset shadows
        +
Strong typography
        +
Low-radius geometry
        +
Purposeful motion
        +
Manipulable workspace
```

The interaction foundation is:

```text
Drag
  +
Drop
  +
Resize
  +
Reposition
  +
Expand
  +
Minimize
  +
Maximize
  +
Fullscreen
  +
Zoom
  +
Keyboard alternatives
```

The result should be a **modern, distinctive, highly interactive web application with a PostHog-inspired visual character**, while remaining its own product and design system.
