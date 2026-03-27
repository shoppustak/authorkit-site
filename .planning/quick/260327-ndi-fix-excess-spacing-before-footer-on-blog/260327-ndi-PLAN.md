---
phase: quick
plan: 260327-ndi
type: execute
wave: 1
depends_on: []
files_modified:
  - blog.html
  - about.html
  - account.html
  - changelog.html
  - checkout.html
  - download.html
  - features.html
  - index.html
  - privacy-policy.html
  - refund-policy.html
  - support.html
  - terms-of-use.html
  - docs/SPACING-GUIDELINES.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "All sections have consistent 64px vertical padding"
    - "No excessive whitespace before footer on any page"
    - "Spacing guidelines documented for future consistency"
  artifacts:
    - path: "docs/SPACING-GUIDELINES.md"
      provides: "Spacing standards documentation"
      min_lines: 30
  key_links:
    - from: "All HTML pages"
      to: "64px vertical padding"
      via: "inline styles or CSS"
      pattern: "padding: 64px"
---

<objective>
Fix excessive spacing before footer on blog.html and other pages by standardizing section padding to 64px vertical, and create SPACING-GUIDELINES.md to prevent future inconsistencies.

Purpose: Achieve visual consistency and reduce excessive whitespace between sections
Output: Updated HTML files with standardized spacing, spacing guidelines document
</objective>

<execution_context>
@/Users/maulik/.claude/get-shit-done/workflows/execute-plan.md
@/Users/maulik/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
The AuthorKit site currently has inconsistent section padding, with some pages using 96px vertical padding which creates excessive whitespace, particularly before the footer. The pricing page has been identified as having optimal "delicate" spacing using 64px vertical padding (py-16 in Tailwind terms).

Current issues:
- blog.html uses `padding: 96px 32px` for sections
- Other pages have similar excessive padding
- No documented spacing standards
- Inconsistent padding creates visual imbalance
</context>

<tasks>

<task type="auto">
  <name>Task 1: Standardize section padding across all HTML pages</name>
  <files>blog.html, about.html, account.html, changelog.html, checkout.html, download.html, features.html, index.html, privacy-policy.html, refund-policy.html, support.html, terms-of-use.html</files>
  <action>
    Update all HTML pages to use consistent 64px vertical padding for sections:

    1. For blog.html:
       - Change `padding: 96px 32px;` to `padding: 64px 32px;` in the section style rule
       - Change `.hero { padding: 96px 32px; }` to `.hero { padding: 64px 32px; }`
       - Keep mobile responsive rule at `padding: 64px 16px;` (already correct)

    2. For all other HTML pages with inline section styles:
       - Find all instances of `padding: 96px` and change to `padding: 64px`
       - Find all instances of `padding: 128px` and change to `padding: 64px`
       - Find all Tailwind classes `py-24` (96px) and change to `py-16` (64px)
       - Find all Tailwind classes `py-32` (128px) and change to `py-16` (64px)
       - Keep horizontal padding unchanged (32px desktop, 16px mobile)

    3. Ensure consistency:
       - Hero sections: 64px vertical padding
       - Content sections: 64px vertical padding
       - Final section before footer: 64px vertical padding
       - Exception: Small utility sections can use py-10 (40px) or py-12 (48px)
  </action>
  <verify>
    <automated>grep -E "padding:\s*(96|128)px" *.html | wc -l</automated>
  </verify>
  <done>All HTML pages use 64px vertical padding for main sections, no 96px or 128px padding remains</done>
</task>

<task type="auto">
  <name>Task 2: Create spacing guidelines documentation</name>
  <files>docs/SPACING-GUIDELINES.md</files>
  <action>
    Create a comprehensive spacing guidelines document at docs/SPACING-GUIDELINES.md with:

    1. Document header with title and purpose
    2. Core spacing principles:
       - Base unit: 8px (matches design system)
       - Standard section padding: 64px vertical (8 × 8)
       - Mobile section padding: 64px vertical (maintains consistency)
       - Horizontal padding: 32px desktop, 16px mobile

    3. Section-specific guidelines:
       - Hero sections: 64px vertical padding
       - Content sections: 64px vertical padding
       - Card/component internal padding: 32px
       - Small utility sections: 40px or 48px vertical

    4. Spacing scale reference:
       - 8px (base unit)
       - 16px (2× base)
       - 24px (3× base)
       - 32px (4× base) - component padding
       - 48px (6× base) - small sections
       - 64px (8× base) - standard sections

    5. Anti-patterns to avoid:
       - Using 96px or 128px section padding (creates excessive whitespace)
       - Inconsistent padding between similar sections
       - Different padding on mobile vs desktop (keep vertical consistent)

    6. Implementation examples showing correct inline styles and Tailwind classes
  </action>
  <verify>
    <automated>test -f docs/SPACING-GUIDELINES.md && wc -l docs/SPACING-GUIDELINES.md</automated>
  </verify>
  <done>SPACING-GUIDELINES.md exists with comprehensive spacing standards and examples</done>
</task>

</tasks>

<verification>
1. Run grep to confirm no 96px or 128px padding remains in HTML files
2. Visually inspect blog.html to confirm spacing looks balanced
3. Check that footer appears at appropriate distance from content
4. Verify SPACING-GUIDELINES.md provides clear, actionable guidance
</verification>

<success_criteria>
- All HTML pages use standardized 64px vertical section padding
- No excessive whitespace before footer on any page
- Spacing guidelines document created with clear standards
- Visual consistency achieved across all pages
</success_criteria>

<output>
After completion, create `.planning/quick/260327-ndi-fix-excess-spacing-before-footer-on-blog/260327-ndi-SUMMARY.md`
</output>