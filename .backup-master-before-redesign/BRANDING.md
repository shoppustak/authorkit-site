# AuthorKit Branding Guide

## Color Scheme

Based on the official AuthorKit logo and Amazon-inspired design language:

### Primary Colors

**Orange** (Primary Action Color - Amazon-style)
- Primary: `#ff9900` (Amazon orange - buttons, CTAs, badges)
- Hover: `#e88900` (Darker on hover)
- Dark: `#d97706` (Price/emphasis text)

**Navy Blue** (Brand Identity)
- Primary: `#1E3A5F` (Logo, text, headings)
- Light: `#2C5282`
- Dark: `#152C46`

**Amazon Yellow** (Alternative Accent)
- Star Rating: `#ffa41c` (5-star ratings, highlights)

### Usage Guidelines

#### Buttons
- **Primary CTAs**: Orange background (`#ff9900`) with black text (`#000000` or `#1d2327`)
- **Secondary Buttons**: White background with orange border (`2px solid #ff9900`) and orange text
- **Disabled**: Gray background (`#e0e0e0`) with gray text (`#646970`)

#### WordPress Plugin UI
- **Cards**: White background with orange left border (`4px solid #ff9900`)
- **Badges**: Orange background with white text (e.g., "Coming Soon", "New")
- **Borders**: Use orange (`#ff9900`) instead of navy blue or WP blue (`#2271b1`)
- **Active States**: Orange background or border to indicate selection

#### NOT to Use
- ❌ Navy blue borders on cards (use orange instead)
- ❌ WordPress standard blue (`#2271b1`) for buttons
- ❌ White text on orange buttons (use black for better contrast)

## Logo Files

Located in `/images/`:

1. `logo.jpg` - Main horizontal logo (navy + orange)
2. `icon-books.jpg` - Books module icon
3. `icon-reviews.jpg` - Reviews module icon  
4. `icon-contest.jpg` - Contest module icon

## CSS Variables

All colors are defined in `css/style.css` as CSS custom properties:

```css
:root {
    /* Primary Orange (Amazon-style) */
    --authorkit-orange: #ff9900;
    --authorkit-orange-hover: #e88900;
    --authorkit-orange-dark: #d97706;

    /* Secondary Navy Blue (brand) */
    --authorkit-navy: #1E3A5F;
    --authorkit-navy-light: #2C5282;
    --authorkit-navy-dark: #152C46;

    /* Additional Colors */
    --authorkit-star-orange: #ffa41c;
    --authorkit-price-orange: #c45500;
    --authorkit-wp-blue: #2271b1; /* Avoid using */

    /* Neutrals */
    --authorkit-gray-50: #F9FAFB;
    --authorkit-gray-100: #F3F4F6;
    --authorkit-gray-200: #e0e0e0;
    --authorkit-gray-600: #646970;
    --authorkit-gray-900: #1d2327;
}
```

## Tailwind Overrides

The website uses Tailwind CSS via CDN. Blue classes are overridden to use orange:

- `bg-blue-600` → Orange `#ff9900`
- `text-blue-600` → Navy Blue `#1E3A5F` (for links/text)
- `hover:bg-blue-700` → Orange Hover `#e88900`
- `border-blue-600` → Orange `#ff9900`

Explicit orange classes:
- `bg-orange-600` → `#ff9900`
- `text-orange-600` → `#ff9900`
- `border-orange-600` → `#ff9900`
- `hover:bg-orange-700` → `#e88900`

## Typography

- **Headings**: Default sans-serif (system fonts)
- **Body**: Default sans-serif
- **Logo**: Uses actual logo image, no custom font needed

## Product Naming Convention

**IMPORTANT**: Product names use the format "AuthorKit XXXX" (without "for")

### Correct Format:
- ✅ AuthorKit Books
- ✅ AuthorKit Reviews
- ✅ AuthorKit Contests
- ✅ AuthorKit Bookshelf
- ✅ AuthorKit Launches

### Incorrect Format:
- ❌ AuthorKit for Books
- ❌ AuthorKit for Reviews
- ❌ AuthorKit for Contests

This applies to:
- Page titles and headings
- Product descriptions
- Navigation items
- Marketing copy
- Documentation

## WordPress Plugin Styling

### Button Examples

**Primary Button (Orange with Black Text)**
```css
.authorkit-button-primary {
    background-color: #ff9900;
    color: #000000;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.authorkit-button-primary:hover {
    background-color: #e88900;
}
```

**Secondary Button (White with Orange Border)**
```css
.authorkit-button-secondary {
    background-color: #ffffff;
    color: #ff9900;
    border: 2px solid #ff9900;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.authorkit-button-secondary:hover {
    background-color: #fff7ed; /* Light orange tint */
}
```

### Card/Module Styling

**WordPress Admin Card with Orange Border**
```css
.authorkit-card {
    background: #ffffff;
    border-left: 4px solid #ff9900;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

**Badge/Label**
```css
.authorkit-badge {
    display: inline-block;
    background: #ff9900;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}
```

### Toggle/Module Cards

**Active Module Card**
```css
.authorkit-module-card.active {
    border: 2px solid #ff9900;
    background: #fff7ed; /* Light orange background */
}

.authorkit-module-card.inactive {
    border: 2px solid #e0e0e0;
    background: #ffffff;
}
```

## Design Principles

1. **Amazon-inspired** - Familiar, trusted e-commerce styling
2. **High contrast** - Black text on orange for accessibility
3. **Author-focused** - Content speaks to writers
4. **Trust-building** - Clear pricing, no hidden fees
5. **Conversion-oriented** - Strong orange CTAs, clear value props
