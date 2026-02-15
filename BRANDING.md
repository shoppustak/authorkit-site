# AuthorKit Branding Guide

## Color Scheme

Based on the official AuthorKit logo, the website uses the following colors:

### Primary Colors

**Navy Blue** (Main Brand Color)
- Primary: `#1E3A5F`
- Light: `#2C5282`
- Dark: `#152C46`

**Orange** (Accent Color)
- Primary: `#F59E0B`
- Light: `#FBBF24`
- Dark: `#D97706`

### Usage

- **Navy Blue** - Buttons, links, headers, branding elements
- **Orange** - Accents, hover states, CTAs (to be added strategically)
- **Gray** - Text, backgrounds, borders

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
    --color-primary: #1E3A5F;        /* Navy Blue */
    --color-primary-light: #2C5282;
    --color-primary-dark: #152C46;
    
    --color-accent: #F59E0B;         /* Orange */
    --color-accent-light: #FBBF24;
    --color-accent-dark: #D97706;
}
```

## Tailwind Overrides

The website uses Tailwind CSS via CDN. Blue classes are overridden to use navy:

- `bg-blue-600` → Navy Blue `#1E3A5F`
- `text-blue-600` → Navy Blue `#1E3A5F`
- `hover:bg-blue-700` → Dark Navy `#152C46`

Orange accent classes are also available:
- `bg-orange-600`
- `text-orange-600`  
- `border-orange-600`

## Typography

- **Headings**: Default sans-serif (system fonts)
- **Body**: Default sans-serif
- **Logo**: Uses actual logo image, no custom font needed

## Design Principles

1. **Professional** - Clean, modern layout
2. **Author-focused** - Content speaks to writers
3. **Trust-building** - Clear pricing, no hidden fees
4. **Conversion-oriented** - Strong CTAs, clear value props
