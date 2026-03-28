---
phase: 260328-ari
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - /Users/maulik/authorkit-site/tailwind.config.js
  - /Users/maulik/authorkit-site/css/styles.css
  - /Users/maulik/authorkit-site/css/monochrome-components.css
  - /Users/maulik/authorkit-site/css/bookshelf.css
  - /Users/maulik/authorkit-site/css/design-tokens.css
autonomous: true
must_haves:
  truths:
    - "All green colors (#059669) are removed from the site"
    - "All text is minimum 16px (no 14px or 15px)"
    - "All grey rgba text is replaced with pure black"
    - "Body text is consistently 18px for optimal readability"
  artifacts:
    - path: "/Users/maulik/authorkit-site/tailwind.config.js"
      provides: "Updated color configuration without green"
      contains: "no #059669"
    - path: "/Users/maulik/authorkit-site/css/styles.css"
      provides: "Updated typography sizes and colors"
      contains: "no font-size: 14px or 15px"
  key_links:
    - from: "tailwind.config.js"
      to: "generated CSS"
      via: "Tailwind build process"
      pattern: "no success: '#059669'"
---

<objective>
Fix typography violations across the entire AuthorKit site to comply with monochrome design system standards.

Purpose: Eliminate all green colors (#059669), increase small text from 14-15px to minimum 16px, replace all grey rgba text with pure black, ensure all body text is 18px for optimal readability.
Output: Updated CSS and configuration files with corrected typography that follows monochrome design principles.
</objective>

<context>
The AuthorKit site currently has several typography violations that need correction:
1. Green color (#059669) used for success states and accents
2. Small text (14px-15px) throughout various components
3. Grey rgba text colors instead of pure black
4. Body text at 17px on mobile instead of 18px

Files with violations found:
- HTML files with inline styles using green and small fonts
- CSS files with small font sizes and rgba colors
- Tailwind config with green success color defined
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove green colors and fix Tailwind configuration</name>
  <files>/Users/maulik/authorkit-site/tailwind.config.js, /Users/maulik/authorkit-site/css/design-tokens.css</files>
  <action>
    1. In tailwind.config.js:
       - Remove or comment out the 'success': '#059669' color definition (line 24)
       - Update fontSize definitions to ensure minimum 16px:
         - Change 'xs': ['0.875rem'] to 'xs': ['1rem'] (16px minimum)
         - Keep 'sm': ['1rem'] already at 16px minimum

    2. In css/design-tokens.css:
       - Remove or comment out --color-success: #059669; (line 22)
       - Add comment explaining removal for monochrome compliance

    This removes green from the design system foundation.
  </action>
  <verify>
    <automated>grep -n "#059669" /Users/maulik/authorkit-site/tailwind.config.js /Users/maulik/authorkit-site/css/design-tokens.css || echo "No green color found - success"</automated>
  </verify>
  <done>Tailwind config and design tokens no longer define green success color, minimum font size is 16px</done>
</task>

<task type="auto">
  <name>Task 2: Fix typography sizes and colors in CSS files</name>
  <files>/Users/maulik/authorkit-site/css/styles.css, /Users/maulik/authorkit-site/css/monochrome-components.css, /Users/maulik/authorkit-site/css/bookshelf.css, /Users/maulik/authorkit-site/css/input.css</files>
  <action>
    1. In css/styles.css:
       - Remove --color-success: #059669; (line 25)
       - Remove border-color: #059669; and color: #059669; (lines 591-592)
       - Replace font-size: 15px with font-size: 16px (lines 718, 729)
       - Replace any rgba(0, 0, 0, 0.x) colors with #000000 or rgba(0, 0, 0, 1)

    2. In css/monochrome-components.css:
       - Remove border-color: #059669; and color: #059669; (lines 487-488)
       - Replace font-size: 15px with font-size: 16px (lines 635, 648)
       - Replace any rgba(0, 0, 0, 0.x) colors with #000000

    3. In css/bookshelf.css:
       - Replace all instances of font-size: 14px with font-size: 16px
       - Replace all instances of font-size: 15px with font-size: 16px
       - Total of ~20 replacements needed
       - Replace any rgba text colors with pure black

    4. In css/input.css:
       - Update body font-size from 17px to 18px on line 93
       - This ensures consistent body text size across all viewports

    5. Rebuild CSS if needed:
       - Run: cd /Users/maulik/authorkit-site && npx tailwindcss -i ./css/input.css -o ./css/styles.min.css --minify
  </action>
  <verify>
    <automated>grep -n "font-size: 1[45]px" /Users/maulik/authorkit-site/css/*.css || echo "No 14px or 15px fonts found - success"</automated>
  </verify>
  <done>All CSS files updated with minimum 16px fonts, no green colors, pure black text</done>
</task>

<task type="auto">
  <name>Task 3: Fix inline styles in HTML files</name>
  <files>/Users/maulik/authorkit-site/index.html, /Users/maulik/authorkit-site/pricing.html, /Users/maulik/authorkit-site/features.html, /Users/maulik/authorkit-site/docs.html</files>
  <action>
    1. In index.html (line 331):
       - Replace: color: #059669;
       - With: color: #000000; font-weight: 700;
       - This maintains emphasis without green color

    2. In pricing.html:
       - Line 58: Remove entire span with green color and 14px text
       - Line 63: Change font-size: 14px to font-size: 16px
       - Line 65: Replace color: #059669 with color: #000000; font-weight: 700

    3. In features.html:
       - Line 63: Change font-size: 15px to font-size: 16px
       - Lines 71, 77, 83, 89, 95, 101: Change font-size: 15px to font-size: 16px
       - Lines 116, 124, 130, 136, 142, 148, 154: Change font-size: 15px to font-size: 16px
       - Lines 169, 177, 183, 189, 195, 201, 207: Change font-size: 15px to font-size: 16px
       - Line 220: Change font-size: 14px to font-size: 16px
       - Lines 235, 260, 284: Change font-size: 15px to font-size: 16px
       - Line 292: Remove green background color #059669, use black background instead
       - Replace all rgba(0, 0, 0, 0.65) and rgba(0, 0, 0, 0.85) with #000000

    4. In docs.html (line 49):
       - Replace background: #059669 with background: #000000
       - Keep the white text on black background for CTA button

    Note: These changes maintain visual hierarchy through weight and spacing rather than color and small sizes.
  </action>
  <verify>
    <automated>grep -n "font-size: 1[45]px\|#059669" /Users/maulik/authorkit-site/*.html | head -5 || echo "No violations in HTML files - success"</automated>
  </verify>
  <done>All HTML inline styles updated to remove green, use minimum 16px fonts, and pure black text</done>
</task>

</tasks>

<verification>
Run comprehensive checks to ensure all typography violations are fixed:
1. No green colors (#059669) remain in any CSS or HTML files
2. No font sizes below 16px (14px or 15px eliminated)
3. Grey rgba text colors replaced with pure black
4. Body text consistently at 18px
</verification>

<success_criteria>
- All green success colors removed from design system
- Minimum text size of 16px enforced across all components
- Pure black text instead of rgba variations
- Body text at 18px for optimal readability
- Site maintains visual hierarchy through typography weight and spacing
</success_criteria>

<output>
After completion, the site will have:
- Monochrome color scheme without green accents
- Improved readability with larger minimum text sizes
- Higher contrast with pure black text
- Consistent typography following design system principles
</output>