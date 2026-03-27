# Spacing Guidelines

**Purpose:** Maintain consistent, elegant spacing across all pages of the AuthorKit.pro website to create a premium, minimalist aesthetic.

## Core Spacing Principles

The AuthorKit.pro design uses an 8px base spacing unit, creating a harmonious rhythm throughout the site.

**Base Unit:** 8px

All spacing values should be multiples of the base unit for visual consistency.

### Standard Section Padding

**Vertical Padding:** 64px (8 × 8 base units)

This is the standard vertical padding for all main sections including:
- Hero sections
- Content sections
- Feature sections
- Final sections before footer

**Horizontal Padding:**
- Desktop: 32px (4 × 8)
- Mobile: 16px (2 × 8)

## Section-Specific Guidelines

### Hero Sections

**Desktop:**
```css
.hero {
    padding: 64px 32px;
}
```

**Mobile:**
```css
@media (max-width: 768px) {
    .hero {
        padding: 64px 16px;
    }
}
```

**Note:** Vertical padding remains 64px on both desktop and mobile for consistency.

### Content Sections

**Desktop:**
```css
section {
    padding: 64px 32px;
}
```

**Mobile:**
```css
@media (max-width: 768px) {
    section {
        padding: 64px 16px;
    }
}
```

### Card/Component Internal Padding

For cards, pricing boxes, and other contained components:

```css
.card {
    padding: 32px;
}
```

**Mobile:**
```css
@media (max-width: 768px) {
    .card {
        padding: 24px;
    }
}
```

### Small Utility Sections

For smaller sections like breadcrumbs, notices, or compact content:

**Option 1 (40px):**
```css
.small-section {
    padding: 40px 32px; /* 5 × 8 */
}
```

**Option 2 (48px):**
```css
.small-section {
    padding: 48px 32px; /* 6 × 8 */
}
```

## Spacing Scale Reference

All spacing should use values from this scale:

| Multiplier | Pixels | Use Case |
|------------|--------|----------|
| 1× | 8px | Tight spacing, icons |
| 2× | 16px | Element spacing, mobile padding |
| 3× | 24px | Card spacing (mobile), margins |
| 4× | 32px | Card padding, horizontal padding |
| 5× | 40px | Small section padding |
| 6× | 48px | Small section padding |
| 8× | 64px | **Standard section padding** |

## Anti-Patterns to Avoid

### Excessive Whitespace

**DON'T use:**
- 96px section padding (creates too much whitespace)
- 128px section padding (excessive, breaks visual flow)
- Inconsistent padding between similar sections

**WHY:** Excessive padding creates visual disconnect, makes pages feel disjointed, and causes awkward spacing before the footer.

### Inconsistent Mobile/Desktop Padding

**DON'T:**
```css
section {
    padding: 96px 32px;
}

@media (max-width: 768px) {
    section {
        padding: 64px 16px; /* Different vertical padding */
    }
}
```

**DO:**
```css
section {
    padding: 64px 32px;
}

@media (max-width: 768px) {
    section {
        padding: 64px 16px; /* Same vertical padding */
    }
}
```

**WHY:** Maintaining consistent vertical padding across breakpoints creates a more cohesive experience.

### Non-Base-Unit Values

**DON'T:** Use arbitrary values like 50px, 75px, 100px

**DO:** Stick to the 8px spacing scale (8, 16, 24, 32, 40, 48, 64)

**WHY:** Consistency creates visual harmony and makes the design feel intentional.

## Implementation Examples

### Inline Styles (Legacy Pages)

```html
<section style="padding: 64px 32px;">
    <!-- Content -->
</section>
```

### CSS Classes

```css
/* Standard section */
.section {
    padding: 64px 32px;
}

@media (max-width: 768px) {
    .section {
        padding: 64px 16px;
    }
}

/* Hero section */
.hero {
    padding: 64px 32px;
    text-align: center;
}

@media (max-width: 768px) {
    .hero {
        padding: 64px 16px;
    }
}

/* Content card */
.card {
    padding: 32px;
}

@media (max-width: 768px) {
    .card {
        padding: 24px;
    }
}
```

### Tailwind Classes (If Used)

```html
<!-- Section: 64px vertical, 32px horizontal -->
<section class="py-16 px-8">
    <!-- Content -->
</section>

<!-- Mobile responsive -->
<section class="py-16 px-8 md:px-8">
    <!-- Content -->
</section>

<!-- Card: 32px padding -->
<div class="p-8">
    <!-- Card content -->
</div>
```

**Tailwind Reference:**
- `py-16` = 64px vertical padding
- `px-8` = 32px horizontal padding
- `p-8` = 32px all-around padding
- `py-10` = 40px vertical padding
- `py-12` = 48px vertical padding

## Design Rationale

The 64px standard section padding was chosen because:

1. **Elegant Proportions:** Creates sophisticated, premium feel without excess
2. **Visual Balance:** Provides breathing room without disconnecting sections
3. **Consistent Rhythm:** Maintains 8px base unit system throughout
4. **Footer Proximity:** Prevents excessive whitespace before footer
5. **Proven Pattern:** Matches the "delicate" spacing on the pricing page

## Quick Reference

**When in doubt:**
- Sections: 64px vertical padding
- Cards: 32px padding
- Mobile horizontal: 16px
- Desktop horizontal: 32px
- Keep vertical padding consistent across breakpoints

**Verification:**
```bash
# Check for non-standard padding
grep -E "padding:\s*(96|128)px" *.html
# Should return 0 results
```

---

*Last updated: 2026-03-27*
*Version: 1.0*
