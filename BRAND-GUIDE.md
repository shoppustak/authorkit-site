# AuthorKit Brand Guide

## Color Strategy

AuthorKit uses a **dual-color system** across all products (WordPress plugins + website):

### Primary Colors

**Navy Blue** `#1E3A5F` - Foundation
- Logo text and icon structures
- Headings and body text
- Navigation links
- Borders and outlines
- Professional, trustworthy foundation

**Orange** `#ff9900` - Action & Accent
- Primary buttons and CTAs
- Hover states
- Badges and highlights
- Interactive elements
- Energy and action

### Color Usage Rules

#### Website (authorkit-site)
- **Headings**: Navy Blue
- **Body Text**: Dark Gray (#333)
- **Links**: Navy Blue (hover → Orange)
- **Primary Buttons**: Orange background + white text
- **Secondary Buttons**: Navy outline + navy text
- **Badges/Labels**: Orange
- **Icons**: Navy with orange accents

#### WordPress Plugins (authorkit/)
- **Admin Elements**: WordPress Blue (#2271b1) for WP integration
- **Primary Buttons**: Orange (#ff9900)
- **Coming Soon Badges**: Orange
- **Star Ratings**: Star Orange (#ffa41c)
- **Price Display**: Price Orange (#c45500)
- **Cards/Borders**: Light gray (#e0e0e0)

### Full Color Palette

```css
/* Primary Colors */
--authorkit-navy: #1E3A5F;           /* Main navy */
--authorkit-navy-light: #2C5282;     /* Lighter navy */
--authorkit-navy-dark: #152C46;      /* Darker navy */

--authorkit-orange: #ff9900;         /* Main orange (buttons, CTAs) */
--authorkit-orange-hover: #e88900;   /* Hover state */
--authorkit-orange-dark: #d97706;    /* Dark variant */

/* Supporting Colors */
--authorkit-star-orange: #ffa41c;    /* Star ratings */
--authorkit-price-orange: #c45500;   /* Price displays */
--authorkit-wp-blue: #2271b1;        /* WordPress admin integration */

/* Neutrals */
--authorkit-gray-50: #F9FAFB;
--authorkit-gray-100: #F3F4F6;
--authorkit-gray-200: #e0e0e0;
--authorkit-gray-600: #646970;
--authorkit-gray-900: #1d2327;
```

## Logo Usage

### Files Available
1. **logo.jpg** - Horizontal logo (navy text + navy/orange icon)
2. **icon-books.jpg** - Books module (navy books + orange arrow)
3. **icon-reviews.jpg** - Reviews module (navy bubble + orange star)
4. **icon-contest.jpg** - Contest module (navy trophy + orange accent)

### Logo Rules
- Never change colors
- Maintain aspect ratio
- Use on white or light backgrounds
- Minimum height: 32px for web
- Always include "AuthorKit" text with icon when possible

## Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Hierarchy:**
- H1: 48-60px, Navy, Bold
- H2: 36-48px, Navy, Bold
- H3: 28-32px, Navy, Semibold
- H4: 20-24px, Navy, Semibold
- Body: 16-18px, Gray, Regular
- Small: 14px, Gray, Regular

## Component Styling

### Buttons

**Primary Button:**
- Background: Orange (#ff9900)
- Text: White
- Hover: Darker Orange (#e88900)
- Border Radius: 8px
- Padding: 12px 24px
- Font Weight: 600

**Secondary Button:**
- Background: Transparent
- Text: Navy
- Border: 2px solid Navy
- Hover: Navy background + white text
- Border Radius: 8px
- Padding: 12px 24px

### Cards
- Background: White
- Border: 1px solid #e0e0e0
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
- Hover: 0 4px 12px rgba(0, 0, 0, 0.1)

### Badges
- Background: Orange (#ff9900)
- Text: White
- Padding: 4px 8px
- Border Radius: 4px
- Font Size: 12px
- Font Weight: 600
- Text Transform: uppercase

### Links
- Default: Navy (#1E3A5F)
- Hover: Orange (#ff9900)
- Underline: None (add on hover)
- Transition: 0.3s ease

## Consistency Across Suite

### WordPress Plugins ↔ Website
Both should use:
- Same orange for buttons (#ff9900)
- Same navy for text/headings (#1E3A5F)
- Same border color (#e0e0e0)
- Same border radius (8px for cards, 4px for buttons)
- Same shadow values
- Same font stack

### Implementation
- **Website**: Uses Tailwind CSS with custom overrides
- **Plugins**: Uses vanilla CSS with .authorkit- prefixed classes
- **Variables**: Both use CSS custom properties for colors

## Design Principles

1. **Balanced** - Navy foundation, orange accents (not overwhelming)
2. **Professional** - Clean, trustworthy, author-focused
3. **Actionable** - Orange draws eye to CTAs
4. **Consistent** - Same look across all touchpoints
5. **Accessible** - Sufficient contrast ratios (WCAG AA)

## Examples

### Good Use
✅ Navy heading + orange CTA button
✅ Navy logo + orange badge for "New"
✅ White card + navy text + orange price
✅ Navy links that turn orange on hover

### Bad Use
❌ All orange everything (too overwhelming)
❌ Orange text on white (use navy instead)
❌ Mixing random blues or oranges
❌ Using colors not in palette

---

**Last Updated:** February 15, 2026
**Maintained By:** AuthorKit Team
