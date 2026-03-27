---
phase: quick-260327-otf
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [docs/SPACING-GUIDELINES.md, css/styles.css, pricing.html, includes/header.html, js/main.js]
autonomous: true
requirements: [DESIGN-01]
must_haves:
  truths:
    - "Button sizes are restricted to small and medium only"
    - "No green colors appear anywhere in the site"
    - "No grey text colors used (only black text)"
    - "No thick or multiple borders (except single card borders)"
    - "Body text is larger with better line height for readability"
    - "Hamburger menu works properly on mobile"
  artifacts:
    - path: "docs/SPACING-GUIDELINES.md"
      provides: "Updated button size restrictions"
      contains: "Button Size Guidelines"
    - path: "css/styles.css"
      provides: "Typography and design refinements"
      min_lines: 1200
  key_links:
    - from: "css/styles.css"
      to: "all HTML pages"
      via: "stylesheet link"
---

<objective>
Implement comprehensive site-wide design refinements to create a cleaner, more readable experience with consistent monochrome aesthetic.

Purpose: Enhance visual consistency, improve readability, and remove inconsistent color/border elements
Output: Refined CSS, updated guidelines, fixed responsive layout
</objective>

<execution_context>
@/Users/maulik/.claude/get-shit-done/workflows/execute-plan.md
@/Users/maulik/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/maulik/authorkit-site/.planning/STATE.md
@/Users/maulik/authorkit-site/docs/SPACING-GUIDELINES.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update design guidelines and CSS refinements</name>
  <files>docs/SPACING-GUIDELINES.md, css/styles.css</files>
  <action>
    1. Update SPACING-GUIDELINES.md to add Button Size Guidelines section:
       - Restrict to only small (px-4 py-2) and medium (px-6 py-3) sizes
       - Document that large buttons (px-8 py-4, px-10 py-5, px-12 py-6) are not allowed
       - Add implementation examples for both inline styles and Tailwind classes

    2. Update css/styles.css body typography for better readability:
       - Change body font-size from 17px to 18px (matching Medium.com)
       - Increase line-height from inherit to 1.65 for better readability
       - Update mobile body font-size from 17px to 18px for consistency
       - Keep paragraph mobile size at 1.0625rem (17px) for good mobile balance

    3. Remove any green color utility classes if they exist in styles.css
       - Search for any .text-green, .bg-green classes and remove them
       - Keep only monochrome colors (black, white, and #f4f2ea cream)
  </action>
  <verify>
    <automated>grep -c "Button Size Guidelines" docs/SPACING-GUIDELINES.md && grep "font-size: 18px" css/styles.css</automated>
  </verify>
  <done>Guidelines updated with button restrictions, body text increased to 18px with 1.65 line-height</done>
</task>

<task type="auto">
  <name>Task 2: Fix color and border issues in HTML files</name>
  <files>pricing.html</files>
  <action>
    1. In pricing.html, replace all green color classes:
       - Change all "text-green-500" to "text-black font-bold" (for Unlimited/All books entries)
       - Keep the checkmark styling consistent but monochrome

    2. Replace all grey text colors with black:
       - Change "text-gray-500" to "text-black" (for "Up to 10", "Up to 3" entries)
       - Change "text-gray-700" to "text-black" for table headers and cells
       - Change "text-gray-900" to "text-black" for headings

    3. Fix thick/multiple borders:
       - Change "border-2" to "border" (1px) on pricing cards
       - Remove "border-3" class, replace with "border"
       - Change "border-t-2" to "border-t" on the black CTA section
       - Keep single borders on cards but ensure they're all 1px
  </action>
  <verify>
    <automated>! grep -q "text-green\|text-gray" pricing.html && ! grep -q "border-[23]" pricing.html</automated>
  </verify>
  <done>All green and grey colors replaced with black, thick borders reduced to 1px</done>
</task>

<task type="auto">
  <name>Task 3: Fix hamburger menu and responsive layout</name>
  <files>includes/header.html, js/main.js</files>
  <action>
    1. Update includes/header.html hamburger button styling:
       - Ensure the button has proper styling: class="mobile-menu-button block md:hidden p-2"
       - Add explicit width/height to the SVG icon: width="24" height="24"
       - Ensure mobile menu has proper responsive classes: "mobile-menu hidden md:hidden"

    2. Update js/main.js to fix responsive breakpoint:
       - Change the resize event breakpoint from 768 to 1024 (matching md: breakpoint)
       - Ensure mobile menu properly toggles visibility
       - Add a check to ensure menu button is visible on mobile

    3. Add CSS for mobile menu button visibility if needed:
       - Ensure .mobile-menu-button has display: block on mobile
       - Hidden on desktop with proper media query
  </action>
  <verify>
    <automated>grep -q "width=\"24\" height=\"24\"" includes/header.html && grep -q "window.innerWidth >= 1024" js/main.js</automated>
  </verify>
  <done>Hamburger menu properly styled and functional, responsive breakpoints aligned</done>
</task>

</tasks>

<verification>
- Button size guidelines documented and enforced
- Body text increased to 18px with 1.65 line-height for better readability
- All green colors removed from pricing table
- All grey text colors replaced with black
- Thick borders (2px, 3px) reduced to 1px
- Hamburger menu visible and functional on mobile
- Responsive layout working correctly
</verification>

<success_criteria>
- SPACING-GUIDELINES.md contains button size restrictions
- Body font-size is 18px with line-height 1.65
- No green or grey text colors in pricing.html
- All borders are 1px (no border-2 or border-3)
- Hamburger menu works on mobile devices
</success_criteria>

<output>
After completion, create `.planning/quick/260327-otf-implement-site-wide-design-refinements-r/260327-otf-SUMMARY.md`
</output>