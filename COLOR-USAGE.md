# AuthorKit Color Usage Guide

## Quick Reference

### Where Navy Blue is Used
- Logo text and icon structures
- Navigation links (hover → orange)
- Headings (H1, H2, H3)  
- Body text (dark variant)
- Secondary button borders
- Footer text

### Where Orange is Used
- Primary CTA buttons
- "Download Free" buttons
- Badge backgrounds ("COMING SOON", "MOST POPULAR")
- Hover states for links
- Focus outlines
- Scrollbar
- Active states
- Icon accents (pen, arrow, star)

## Complete Color Map

### CSS Variables Defined
```css
/* Navy - Foundation */
--authorkit-navy: #1E3A5F
--authorkit-navy-light: #2C5282
--authorkit-navy-dark: #152C46

/* Orange - Actions */
--authorkit-orange: #ff9900  
--authorkit-orange-hover: #e88900
--authorkit-orange-dark: #d97706

/* Supporting */
--authorkit-star-orange: #ffa41c
--authorkit-price-orange: #c45500
--authorkit-wp-blue: #2271b1
```

### Current Implementation

#### Navigation
- Logo: Actual image (navy + orange)
- Links: Navy text → Orange on hover
- Mobile menu button: Gray
- Download button: Orange background + white text

#### Homepage
- Hero heading: Navy (via Tailwind)
- Hero buttons: Orange (primary) + Navy outline (secondary)
- Stats numbers: Orange
- Feature cards: White bg, navy text, orange icons (if added)
- CTA sections: Orange buttons

#### Features Page
- Feature icons: Should use module icons (navy + orange)
- Checkmarks: Green
- Premium badge: Yellow (consider changing to orange)

#### Pricing Page  
- "MOST POPULAR" badge: Orange
- Primary buttons: Orange
- Borders: Orange for selected tier
- Prices: Navy

#### Docs Page
- Sidebar links: Navy → Orange on hover
- Code blocks: Gray background
- Info boxes: Orange left border

#### Download Page
- Download buttons: Orange
- "COMING SOON" badges: Yellow (should be orange)

## Consistency Checklist

✅ Primary buttons = Orange
✅ Secondary buttons = Navy outline  
✅ Links = Navy → Orange hover
✅ Badges = Orange (some need updating)
✅ Focus states = Orange
✅ Logo = Actual image (both colors)
⚠️ Some badges still yellow (should be orange)
⚠️ Consider adding orange icon accents

## Matching Plugin Styles

### Plugin Files Use:
```css
/* From authorkit-public.css */
background-color: #ff9900;  /* buttons */
color: #ffa41c;             /* star ratings */
color: #c45500;             /* prices */
border: 1px solid #e0e0e0;  /* cards */
border-radius: 8px;         /* cards */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
```

### Website Now Uses:
```css
/* Matches plugins exactly */
--authorkit-orange: #ff9900;
--authorkit-gray-200: #e0e0e0;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
```

## Next Steps

1. ✅ Update yellow badges to orange
2. ✅ Add orange accents to feature icons
3. ✅ Ensure all CTAs use orange
4. ✅ Test contrast ratios (WCAG AA)
5. ✅ Add module icons to features page

---

**Summary:** Navy provides professional foundation, Orange drives action. Both colors appear in logo, creating cohesive brand across website and WordPress plugins.
