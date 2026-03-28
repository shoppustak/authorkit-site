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
    - "All text is minimum 16px (no 14px or 15px)"
    - "All grey rgba text is replaced with pure black"
    - "Body text is consistently 18px for optimal readability"
  artifacts:
    - path: "/Users/maulik/authorkit-site/css/styles.css"
      provides: "Updated typography sizes and colors"
      contains: "no font-size: 14px or 15px"
  key_links:
    - from: "css files"
      to: "HTML pages"
      via: "stylesheet references"
      pattern: "minimum 16px fonts"
---

<objective>
Fix typography violations across the entire AuthorKit site to comply with monochrome design system standards.

Purpose: Increase small text from 14-15px to minimum 16px, replace all grey rgba text with pure black, ensure all body text is 18px for optimal readability. Green accent color (#059669) is kept as valid.
Output: Updated CSS and HTML files with corrected typography that follows monochrome design principles.
</objective>

<context>
The AuthorKit site currently has several typography violations that need correction:
1. Small text (14px-15px) throughout various components
2. Grey rgba text colors instead of pure black
3. Body text needs to be consistently 18px

Green accent color (#059669) is intentional and should be kept.

Files with violations found:
- HTML files with inline styles using small fonts and grey text
- CSS files with small font sizes and rgba colors
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix minimum font sizes in Tailwind configuration</name>
  <files>/Users/maulik/authorkit-site/tailwind.config.js</files>
  <action>
    1. In tailwind.config.js:
       - Update fontSize definitions to ensure minimum 16px:
         - Change 'xs': ['0.875rem'] to 'xs': ['1rem'] (16px minimum)
         - Keep 'sm': ['1rem'] already at 16px minimum
       - Keep green success color (#059669) as it's intentional

    This ensures Tailwind utility classes enforce minimum 16px font sizes.
  </action>
  <verify>
    <automated>grep -n "0.875rem" /Users/maulik/authorkit-site/tailwind.config.js || echo "No sub-16px font sizes in config - success"</automated>
  </verify>
  <done>Tailwind config updated to enforce minimum 16px font size</done>
</task>

<task type="auto">
  <name>Task 2: Fix typography sizes and colors in CSS files</name>
  <files>/Users/maulik/authorkit-site/css/styles.css, /Users/maulik/authorkit-site/css/monochrome-components.css, /Users/maulik/authorkit-site/css/bookshelf.css, /Users/maulik/authorkit-site/css/input.css</files>
  <action>
    1. In css/styles.css:
       - Replace font-size: 15px with font-size: 16px (if found)
       - Replace any rgba(0, 0, 0, 0.x) text colors with #000000
       - Keep green (#059669) border/background colors as they're intentional accents

    2. In css/monochrome-components.css:
       - Replace font-size: 15px with font-size: 16px (if found)
       - Replace any rgba(0, 0, 0, 0.x) text colors with #000000
       - Keep green (#059669) colors for accents

    3. In css/bookshelf.css:
       - Replace all instances of font-size: 14px with font-size: 16px
       - Replace all instances of font-size: 15px with font-size: 16px
       - Replace any rgba text colors with pure black

    4. In css/input.css:
       - Update body font-size to 18px consistently across all viewports

    5. Rebuild CSS if needed:
       - Run: cd /Users/maulik/authorkit-site && npx tailwindcss -i ./css/input.css -o ./css/styles.min.css --minify
  </action>
  <verify>
    <automated>grep -n "font-size: 1[45]px" /Users/maulik/authorkit-site/css/*.css || echo "No 14px or 15px fonts found - success"</automated>
  </verify>
  <done>All CSS files updated with minimum 16px fonts and pure black text, green accents preserved</done>
</task>

<task type="auto">
  <name>Task 3: Fix inline styles in HTML files</name>
  <files>/Users/maulik/authorkit-site/index.html, /Users/maulik/authorkit-site/pricing.html, /Users/maulik/authorkit-site/features.html, /Users/maulik/authorkit-site/docs.html</files>
  <action>
    1. In pricing.html:
       - Line 58: Change font-size: 14px to font-size: 16px (keep green color for accent)
       - Line 63: Change font-size: 14px to font-size: 16px
       - Line 63: Change color: rgba(0, 0, 0, 0.85) to color: #000000
       - Keep green (#059669) colors for "Limited spots remaining" and "Save 60%+" accents

    2. In features.html:
       - Lines 42, 222, 234, 259: Change rgba(0, 0, 0, 0.7) to #000000
       - Lines 71, 77, 83, 89, 95, 101: Change font-size: 15px to font-size: 16px
       - Lines 124, 130, 136, 142, 148, 154: Change font-size: 15px to font-size: 16px
       - Lines 177, 183, 189, 195, 201, 207: Change font-size: 15px to font-size: 16px
       - Line 220: Change font-size: 14px to font-size: 16px
       - Lines 235, 260, 284: Change font-size: 15px to font-size: 16px, change rgba colors to #000000
       - Keep green (#059669) background for CTA buttons as accent color

    3. In docs.html:
       - Line 47: Change rgba(0, 0, 0, 0.7) to #000000
       - Keep green (#059669) background for CTA button as accent color

    4. In index.html:
       - Keep green (#059669) accent color for "Plugin Built for Authors" span

    Note: These changes improve readability with larger fonts and pure black text while preserving green as a valid accent color.
  </action>
  <verify>
    <automated>grep -n "font-size: 1[45]px" /Users/maulik/authorkit-site/*.html || echo "No small fonts in HTML files - success"</automated>
  </verify>
  <done>All HTML inline styles updated to use minimum 16px fonts and pure black text, green accents preserved</done>
</task>

</tasks>

<verification>
Run comprehensive checks to ensure all typography violations are fixed:
1. No font sizes below 16px (14px or 15px eliminated)
2. Grey rgba text colors replaced with pure black
3. Body text consistently at 18px
4. Green accent color (#059669) preserved for intentional use
</verification>

<success_criteria>
- Minimum text size of 16px enforced across all components
- Pure black text instead of rgba variations for body text
- Body text at 18px for optimal readability
- Green accent color preserved as valid design element
- Site maintains visual hierarchy through typography weight and spacing
</success_criteria>

<output>
After completion, the site will have:
- Improved readability with larger minimum text sizes (16px+)
- Higher contrast with pure black body text
- Consistent 18px body text across all viewports
- Green accent color preserved for CTAs and emphasis
- Typography following monochrome design system principles
</output>