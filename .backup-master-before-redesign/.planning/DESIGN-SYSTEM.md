# AuthorKit Minimalist Monochrome Design System

**Version:** 1.0.0
**Last Updated:** 2026-03-18

## Core Principles

1. **Pure Black & White**: Only #000000 and #FFFFFF for primary design
2. **Zero Decorations**: No border-radius (0px everywhere), no shadows (none), no gradients
3. **Typography-First**: Content hierarchy through type scale and weight
4. **Generous White Space**: 2-3x more spacing than typical sites
5. **Instant Interactions**: No transitions, no animations, immediate state changes
6. **WCAG AAA Compliance**: 21:1 contrast ratio for black on white

## Color Palette

### Primary Colors
- **Pure Black**: #000000 (rgb(0, 0, 0)) - All text, borders, icons
- **Pure White**: #FFFFFF (rgb(255, 255, 255)) - Backgrounds, inverted text

### Brand Accent Colors (Use Sparingly)
- **AuthorKit Orange**: #FF9900 (Primary CTAs only)
- **AuthorKit Blue**: #1E3A5F (Secondary accents, links)

### Semantic Colors
- **Success**: #059669 (emerald-600, WCAG AA on white)
- **Error**: #DC2626 (red-600, WCAG AA on white)
- **Warning**: #D97706 (amber-600, WCAG AA on white)
- **Info**: #2563EB (blue-600, WCAG AA on white)

## Typography Scale

### Font Families
- **Headlines**: 'Playfair Display', serif (elegant, bookish)
- **Body Text**: 'Source Serif 4', serif (highly readable)
- **UI Elements**: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif

### Desktop Type Scale
- **Display**: 64px / 1.1 / 700 (rare, hero only)
- **H1**: 48px / 1.2 / 700
- **H2**: 36px / 1.3 / 600
- **H3**: 24px / 1.4 / 600
- **H4**: 20px / 1.4 / 500
- **Body Large**: 20px / 1.6 / 400
- **Body**: 18px / 1.7 / 400 (optimal reading)
- **Small**: 14px / 1.5 / 400
- **Caption**: 12px / 1.4 / 400

### Mobile Type Scale (Responsive)
- **Display**: 40px / 1.2 / 700
- **H1**: 32px / 1.2 / 700
- **H2**: 28px / 1.3 / 600
- **H3**: 20px / 1.4 / 600
- **H4**: 18px / 1.4 / 500
- **Body Large**: 18px / 1.6 / 400
- **Body**: 16px / 1.7 / 400
- **Small**: 14px / 1.5 / 400
- **Caption**: 12px / 1.4 / 400

## Spacing System

Base unit: 8px (0.5rem)

### Scale
- **0**: 0px
- **0.5**: 4px (0.25rem)
- **1**: 8px (0.5rem)
- **2**: 16px (1rem)
- **3**: 24px (1.5rem)
- **4**: 32px (2rem)
- **6**: 48px (3rem)
- **8**: 64px (4rem)
- **12**: 96px (6rem)
- **16**: 128px (8rem)
- **20**: 160px (10rem)
- **24**: 192px (12rem)

### Application
- **Component padding**: 16-32px (2-4 units)
- **Section spacing**: 64-128px (8-16 units)
- **Text line height**: 1.5-1.7x font size
- **Paragraph spacing**: 24px (3 units)

## Component Patterns

### Buttons

#### Primary Button
```css
background: #000000;
color: #FFFFFF;
border: 2px solid #000000;
border-radius: 0;
padding: 12px 24px;
font-weight: 600;
min-height: 44px;
```

#### Secondary Button
```css
background: #FFFFFF;
color: #000000;
border: 2px solid #000000;
border-radius: 0;
padding: 12px 24px;
font-weight: 600;
min-height: 44px;
```

#### Accent Button (CTA)
```css
background: #FF9900;
color: #FFFFFF;
border: 2px solid #FF9900;
border-radius: 0;
padding: 12px 24px;
font-weight: 600;
min-height: 44px;
```

### Cards
```css
background: #FFFFFF;
border: 1px solid #000000;
border-radius: 0;
padding: 32px;
```

### Forms

#### Input Fields
```css
background: #FFFFFF;
border: 1px solid #000000;
border-radius: 0;
padding: 12px 16px;
min-height: 44px;
font-size: 16px; /* Prevents zoom on iOS */
```

#### Focus State
```css
border: 2px solid #000000;
outline: none;
```

### Navigation
```css
background: #FFFFFF;
border-bottom: 1px solid #000000;
padding: 16px 0;
position: sticky;
top: 0;
z-index: 50;
```

## Layout Grid

### Container
- **Max width**: 1280px (80rem)
- **Padding**: 16px mobile, 24px tablet, 32px desktop
- **Center aligned**: margin: 0 auto

### Grid System
- **Columns**: 12-column grid
- **Gap**: 24px (3 units) mobile, 32px (4 units) desktop
- **Breakpoints**:
  - Mobile: < 640px (1 column)
  - Tablet: 640-1024px (2-3 columns)
  - Desktop: > 1024px (3-4 columns)

## Responsive Breakpoints

- **xs**: 0-639px (mobile)
- **sm**: 640px+ (large mobile)
- **md**: 768px+ (tablet)
- **lg**: 1024px+ (desktop)
- **xl**: 1280px+ (large desktop)
- **2xl**: 1536px+ (ultra-wide)

## Interaction States

### Hover (Desktop Only)
- **Buttons**: Invert colors instantly (black→white, white→black)
- **Links**: Add underline instantly
- **Cards**: Change border to 2px thickness

### Focus
- **All interactive**: 2px black border or outline
- **Skip contrast**: Ensure visible focus for keyboard navigation

### Active
- **Buttons**: Slight opacity (0.9)
- **Links**: Keep underline

### Disabled
- **Opacity**: 0.5
- **Cursor**: not-allowed

## Animation & Motion

**NONE** - All interactions are instant:
- No fade transitions
- No slide animations
- No hover transitions
- No loading spinners (use text: "Loading...")
- No parallax effects
- No scroll animations

## Accessibility Guidelines

- **Contrast**: Minimum 21:1 (WCAG AAA)
- **Touch targets**: Minimum 44x44px
- **Focus indicators**: Always visible, 2px minimum
- **Text sizing**: Base 16px minimum, user scalable
- **ARIA labels**: On all interactive elements
- **Semantic HTML**: Proper heading hierarchy
- **Screen readers**: Test with NVDA/JAWS

## Performance Guidelines

- **CSS**: < 50KB minified (current goal)
- **Fonts**: Preload critical, swap display
- **Images**: WebP format, lazy load below fold
- **Critical CSS**: Inline above-the-fold styles
- **Purge unused**: Remove all unused Tailwind classes
