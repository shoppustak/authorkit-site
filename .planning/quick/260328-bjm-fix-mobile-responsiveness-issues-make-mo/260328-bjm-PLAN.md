---
phase: quick
plan: 260328-bjm
type: execute
wave: 1
depends_on: []
files_modified: [css/styles.css, includes/header.html, about.html]
autonomous: true
requirements: []
must_haves:
  truths:
    - "Mobile menu expands to full width on mobile devices"
    - "Hamburger button visible only on mobile screens"
    - "Cards don't overflow horizontally on narrow screens"
    - "Images have explicit dimensions to prevent layout shifts"
  artifacts:
    - path: "css/styles.css"
      provides: "Fixed mobile menu styles and responsive utilities"
      contains: "full-width mobile menu, proper media queries"
    - path: "includes/header.html"
      provides: "Fixed hamburger button visibility"
      contains: "corrected responsive classes"
    - path: "about.html"
      provides: "Images with proper dimensions"
      contains: "picture elements with aspect-ratio"
  key_links:
    - from: "includes/header.html"
      to: "css/styles.css"
      via: "mobile-menu classes"
      pattern: "mobile-menu"
---

<objective>
Fix mobile responsiveness issues across the site to ensure proper display on all screen sizes.

Purpose: Improve mobile user experience by fixing menu positioning, hamburger button visibility, card overflow, and image layout shifts.
Output: Updated CSS and HTML files with corrected responsive behavior.
</objective>

<execution_context>
@/Users/maulik/.claude/get-shit-done/workflows/execute-plan.md
@/Users/maulik/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
The site currently has several mobile responsiveness issues:
1. Mobile menu is positioned with `right: 16px` instead of being full-width
2. Hamburger button has conflicting visibility classes (lg:hidden on parent, md:hidden on button)
3. Images in picture elements may cause CLS due to missing aspect-ratio or improper dimension handling
4. Cards may overflow on narrow screens due to fixed widths or insufficient responsive handling
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix mobile menu positioning and hamburger visibility</name>
  <files>css/styles.css, includes/header.html</files>
  <action>
    In css/styles.css:
    - Change `.mobile-menu` positioning from `right: 16px` to full width:
      - Set `left: 0` and `right: 0` instead of just `right: 16px`
      - Ensure `width: 100%` for mobile screens
      - Keep the white background and black border styling
    - Add responsive utility classes for proper breakpoint handling:
      - Add `.md\:hidden { display: none !important; }` for 768px+ breakpoint
      - Add `.lg\:hidden { display: none !important; }` for 1024px+ breakpoint
      - Add corresponding `.md\:block` and `.lg\:block` utilities if needed

    In includes/header.html:
    - Fix hamburger button visibility conflict:
      - Remove `block md:hidden` from the button element (line 25)
      - Keep parent div's `lg:hidden` class (line 24)
      - Ensure mobile menu div keeps `hidden md:hidden` for proper responsive behavior
    - The hamburger should be visible on mobile and tablet (< 1024px), hidden on desktop (1024px+)
  </action>
  <verify>Mobile menu spans full width on mobile, hamburger visible < 1024px</verify>
  <done>Mobile menu is full-width and hamburger button visibility is correct across breakpoints</done>
</task>

<task type="auto">
  <name>Task 2: Add explicit dimensions to prevent image layout shifts</name>
  <files>about.html, css/styles.css</files>
  <action>
    In about.html:
    - For each picture element with team photos:
      - Add explicit CSS to the picture element: `style="display:block; width:120px; height:120px;"`
      - Or add `aspect-ratio: 1/1` to maintain square ratio
      - Ensure the img elements inside keep their width="120" height="120" attributes

    In css/styles.css:
    - Add a utility class for responsive images:
      ```css
      .responsive-picture {
        display: block;
        aspect-ratio: 1/1;
      }
      .responsive-picture img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      ```
    - This prevents CLS by reserving space before image loads
  </action>
  <verify>Check that images don't cause layout shift on page load</verify>
  <done>Images have explicit dimensions preventing CLS, measured aspect-ratio preserved</done>
</task>

<task type="auto">
  <name>Task 3: Ensure cards don't overflow on narrow screens</name>
  <files>css/styles.css</files>
  <action>
    In css/styles.css:
    - Add overflow prevention for grid containers:
      ```css
      .grid {
        max-width: 100%;
        overflow-x: hidden;
      }
      ```
    - Ensure cards have flexible widths on mobile:
      ```css
      @media (max-width: 767px) {
        .grid > * {
          max-width: 100%;
          min-width: 0;
        }
      }
      ```
    - Add box-sizing to prevent border from causing overflow:
      ```css
      * {
        box-sizing: border-box;
      }
      ```
    - For any fixed-width elements, add responsive overrides for mobile
  </action>
  <verify>Test on 320px viewport width - no horizontal scroll should appear</verify>
  <done>Cards and grids properly constrained to viewport width on all screen sizes</done>
</task>

</tasks>

<verification>
Open the site on mobile device or browser dev tools at 320px width:
1. Click hamburger menu - should expand full width of screen
2. Resize from 320px to 1440px - hamburger should disappear at 1024px
3. Load about.html - no layout shift as images load
4. Check all pages at 320px width - no horizontal scrollbar
</verification>

<success_criteria>
- Mobile menu spans full viewport width (not positioned to right)
- Hamburger button visible below 1024px, hidden at/above 1024px
- No horizontal overflow on any page at 320px viewport
- Zero CLS from image loading (dimensions pre-allocated)
</success_criteria>

<output>
After completion, create `.planning/quick/260328-bjm-fix-mobile-responsiveness-issues-make-mo/260328-bjm-SUMMARY.md`
</output>