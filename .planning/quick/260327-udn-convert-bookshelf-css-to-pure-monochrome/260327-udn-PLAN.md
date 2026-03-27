---
phase: quick-260327-udn
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [css/bookshelf.css]
autonomous: true
requirements: []
user_setup: []
must_haves:
  truths:
    - "Bookshelf CSS uses only black and white colors"
    - "No border-radius, shadows, or transitions remain"
    - "Typography matches site design system"
  artifacts:
    - path: "css/bookshelf.css"
      provides: "Pure monochrome bookshelf styles"
      min_lines: 900
  key_links:
    - from: "css/bookshelf.css"
      to: "design system"
      via: "CSS variables"
      pattern: "--color-black|--color-white"
---

<objective>
Convert bookshelf.css to pure monochrome design matching the site's minimalist aesthetic

Purpose: Remove all grey colors, brand colors, decorative elements to achieve pure black/white minimalism
Output: Transformed bookshelf.css with monochrome design
</objective>

<execution_context>
@/Users/maulik/.claude/get-shit-done/workflows/execute-plan.md
@/Users/maulik/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@css/bookshelf.css
@css/styles.css (first 200 lines for design tokens reference)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Convert bookshelf.css to pure monochrome design</name>
  <files>css/bookshelf.css</files>
  <action>
    Transform bookshelf.css to pure monochrome:

    1. Replace color variables:
       - Remove all --gray-* variables
       - Remove --authorkit-navy, --authorkit-orange variables
       - Add monochrome variables from main design system:
         - --color-black: #000000
         - --color-white: #FFFFFF

    2. Update all color references:
       - --gray-50, --gray-100 → --color-white or rgba(0,0,0,0.03)
       - --gray-200, --border-color → rgba(0,0,0,0.1) for subtle borders
       - --gray-600 → rgba(0,0,0,0.6) for secondary text
       - --gray-900 → --color-black for primary text
       - --authorkit-navy → --color-black
       - --authorkit-orange → --color-black
       - Orange hover states → --color-black with thicker border

    3. Remove all decorative properties:
       - All border-radius: * → border-radius: 0
       - All box-shadow: * → box-shadow: none
       - All transition: * → transition: none (remove entirely)
       - All transform animations (translateY) → remove

    4. Update typography to match design system:
       - Replace font-family with design system values:
         - Headings: 'Playfair Display', serif
         - Body text: 'Source Serif 4', serif
       - Adjust font sizes for consistency with main site
       - Increase base body font to 18px for readability

    5. Simplify hover states:
       - Remove color transitions
       - Use border thickness changes (1px → 2px) for emphasis
       - Remove background color changes that use grays

    6. Clean up button styles:
       - Primary buttons: black background, white text
       - Secondary buttons: white background, black text, black border
       - Remove orange/navy color schemes entirely

    7. Update footer to pure monochrome:
       - Background: --color-black
       - Text: --color-white
       - Links: rgba(255,255,255,0.8)
       - Hover: --color-white with underline

    8. Simplify form inputs and controls:
       - Remove all accent colors
       - Use black borders and focus states
       - Remove checkbox accent-color property
  </action>
  <verify>
    <automated>grep -E "(gray-|authorkit-|border-radius:|box-shadow:|transition:)" css/bookshelf.css | wc -l</automated>
  </verify>
  <done>bookshelf.css contains zero references to gray variables, brand colors, border-radius (except 0), shadows, or transitions</done>
</task>

</tasks>

<verification>
- No gray color variables remain in the file
- No orange or navy brand colors exist
- All border-radius values are 0
- No box-shadow properties exist (or all are 'none')
- No transition properties remain
- Typography uses Playfair Display and Source Serif 4 fonts
</verification>

<success_criteria>
- bookshelf.css successfully converted to pure monochrome (black/white only)
- All decorative elements removed (no rounded corners, shadows, transitions)
- Typography matches the main site's minimalist design system
- File maintains all functionality with cleaner, more minimal aesthetic
</success_criteria>

<output>
After completion, create `.planning/quick/260327-udn-convert-bookshelf-css-to-pure-monochrome/260327-udn-SUMMARY.md`
</output>