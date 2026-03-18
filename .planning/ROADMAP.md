# AuthorKit.pro Visual Redesign Roadmap

**Project**: AuthorKit.pro Visual Redesign to Minimalist Monochrome
**Milestone**: v2.0 - Lighthouse Optimized, High-End Visual Design
**Started**: 2026-03-18

---

## Milestone: v2.0 - Minimalist Monochrome Redesign

**Goal**: Transform AuthorKit.pro into a high-end, Lighthouse-optimized marketing site with Minimalist Monochrome design while preserving all existing content and functionality.

**Success Criteria**:
- ✅ Lighthouse scores: Performance 95+, Accessibility 100, Best Practices 95+, SEO 95+
- ✅ **Mobile performance: < 2s page load on 3G, < 1s on 4G (critical priority)**
- ✅ Pure black/white design with brand colors as accents
- ✅ Typography-first aesthetic with generous white space
- ✅ Significantly improved mobile experience across all devices (iOS, Android)
- ✅ All existing functionality preserved
- ✅ Layouts and sections optimized for better UX flow

---

## Phase 1: Foundation & Design System

**Goal**: Establish the Minimalist Monochrome design system and update Tailwind configuration.

**Plans:** 3 plans

**Duration**: 2-3 days

Plans:
- [ ] 01-01-PLAN.md — Establish Lighthouse baseline metrics
- [ ] 01-02-PLAN.md — Create design system documentation
- [ ] 01-03-PLAN.md — Update Tailwind configuration

### Tasks:

1.1. **Measure Current Lighthouse Baseline**
- Run Lighthouse audits on key pages (homepage, features, pricing, docs)
- Document current scores (performance, accessibility, best practices, SEO)
- Identify specific performance bottlenecks
- Save baseline reports for comparison

1.2. **Create Design System Documentation**
- Define typography scale (Playfair Display headlines, Source Serif 4 body)
- Define spacing system (generous white space guidelines)
- Define component patterns (buttons, cards, navigation, forms)
- Document color usage (black/white primary, brand colors as accents)
- Create design tokens for Tailwind config

1.3. **Update Tailwind Configuration**
- Configure custom font families (Playfair Display, Source Serif 4)
- Configure spacing scale (increased from current)
- Configure zero border-radius globally
- Remove shadow utilities (shadows not used in design)
- Configure brand colors as accent colors only
- Set up purge/content configuration for minimal CSS payload

1.4. **Typography Setup**
- Add Google Fonts imports (Playfair Display, Source Serif 4)
- Configure font loading strategy (font-display: swap for performance)
- Preload critical fonts
- Set up fallback font stacks
- Define responsive typography scale

**Deliverables**:
- `DESIGN-SYSTEM.md` - Complete design system documentation
- Updated `tailwind.config.js` with monochrome design tokens
- Baseline Lighthouse reports in `.planning/lighthouse-baseline/`

**Success Criteria**:
- Design system fully documented with component examples
- Tailwind config ready for redesigned components
- Fonts loading with optimal performance
- Baseline Lighthouse scores recorded

---

## Phase 2: Core Component Redesign

**Goal**: Redesign all reusable components to Minimalist Monochrome aesthetic.

**Duration**: 3-4 days

### Tasks:

2.1. **Header & Navigation Redesign**
- Redesign `includes/header.php` with minimalist navigation
- Pure black logo area with generous padding
- Black text on white background
- Zero border-radius, no shadows
- Sticky header behavior (instant, no animation)
- Mobile hamburger menu (instant toggle, no slide animation)
- Desktop horizontal navigation with clean spacing

2.2. **Footer Redesign**
- Redesign `includes/footer.php` with clean layout
- Black border separator at top
- Organized link columns with generous spacing
- Copyright and social links
- Email signup form (if exists) with minimal styling

2.3. **Button Component Redesign**
- Primary button: Black background, white text
- Secondary button: White background, black text, black 2px border
- Accent button: Brand color background, white text
- Link button: Brand color text, underline on hover
- All buttons: Zero border-radius, no shadows
- Instant hover states (no transitions)
- Touch-friendly sizing (min 44x44px)

2.4. **Card Component Redesign**
- White background, thin black 1px border
- Zero border-radius, no shadows
- Generous internal padding (2x current)
- Clean typography hierarchy
- Minimal hover effects (border color change only)

2.5. **Form Component Redesign**
- Input fields: White background, black 1px border, zero border-radius
- Labels: Black text, clear hierarchy
- Focus states: Thicker border or brand color border
- Error states: Red text (accessible contrast)
- Success states: Green text (accessible contrast)
- Instant state changes (no animations)

**Deliverables**:
- Redesigned `includes/header.php`
- Redesigned `includes/footer.php`
- Updated CSS classes for all core components
- Component documentation with usage examples

**Success Criteria**:
- All components follow Minimalist Monochrome design
- WCAG AAA contrast ratios (21:1 for black on white)
- Zero border-radius and shadows throughout
- Components reusable across all pages

---

## Phase 3: Priority 1 Pages (Core User Journey)

**Goal**: Redesign the 4 most critical pages that drive conversion and usage.

**Duration**: 4-5 days

### Tasks:

3.1. **Homepage Redesign** (`index.html`)
- **Mobile-first design**: Design mobile layout first, then enhance for desktop
- Hero section: Large headline, generous white space, minimal CTA
- Features overview: Grid layout with icon + text cards (stacks on mobile)
- Social proof: Testimonials or user count (if exists)
- Final CTA: Clear call to action with accent color button
- Remove unnecessary decorations/animations
- Optimize images (WebP, lazy loading, mobile-specific sizes)
- Test on real mobile devices (iOS, Android) - verify < 2s load on 3G
- Rearrange sections if needed for better mobile UX flow

3.2. **Features Page Redesign** (`features.html`)
- Feature list: Clean list with icons/screenshots
- Generous spacing between feature sections
- Clear visual hierarchy with typography
- Screenshots/demos (if exists): Clean borders, no shadows
- Comparison table (if exists): Minimal table styling

3.3. **Pricing Page Redesign** (`pricing.html`)
- Pricing tiers: Card-based layout with clear hierarchy
- Feature comparison: Minimal table or list format
- CTA buttons: Prominent with accent colors
- FAQ section (if exists): Clean accordion or list
- Trust signals: Secure payment badges (if exists)

3.4. **Documentation Hub Redesign** (`docs.html`)
- Documentation navigation: Clean sidebar or top navigation
- Article list: Minimal list styling with clear hierarchy
- Search (if exists): Clean input with black border
- Breadcrumbs (if exists): Simple text links

**Deliverables**:
- Redesigned `index.html`
- Redesigned `features.html`
- Redesigned `pricing.html`
- Redesigned `docs.html`
- Optimized images for all 4 pages

**Success Criteria**:
- Pages follow Minimalist Monochrome design system
- Mobile experience significantly improved
- Clear visual hierarchy on all pages
- Fast page loads (< 2s mobile, < 1s desktop)

---

## Phase 4: Priority 2 Pages (Supporting Journey)

**Goal**: Redesign supporting pages for download, account, checkout, and support.

**Duration**: 3-4 days

### Tasks:

4.1. **Download Page Redesign** (`download.html`)
- Clear download CTA with accent button
- Version information in minimal table
- System requirements in clean list format
- Installation instructions with clear steps

4.2. **Account Page Redesign** (`account.html`)
- User info display: Clean card layout
- Account actions: Clear button list
- License information (if Pro): Minimal table
- Subscription management (if exists): Clean form

4.3. **Checkout Page Redesign** (`checkout.html`)
- Order summary: Clean card with line items
- Payment form: Minimal input styling
- Trust badges: Secure payment indicators
- Total and CTA: Prominent with accent color

4.4. **Support Page Redesign** (`support.html`)
- Contact form: Clean input fields
- FAQ: Accordion or list format
- Documentation links: Organized list
- Support channels: Clear contact options

**Deliverables**:
- Redesigned `download.html`
- Redesigned `account.html`
- Redesigned `checkout.html`
- Redesigned `support.html`

**Success Criteria**:
- Consistent design with Priority 1 pages
- Forms are accessible and easy to use
- Checkout flow is clear and trustworthy
- Support resources are easy to find

---

## Phase 5: Priority 3 Pages (Content & Legal)

**Goal**: Redesign remaining content pages for consistency.

**Duration**: 2-3 days

### Tasks:

5.1. **Content Pages Redesign**
- About page: Clean layout with team/company info
- Changelog page: Minimal version list with clean formatting
- Privacy Policy: Clean legal text with clear sections
- Terms of Use: Clean legal text with clear sections
- Refund Policy: Clean legal text with clear sections

5.2. **Remaining HTML Pages**
- Audit all remaining ~30 pages
- Apply design system consistently
- Update headers/footers to new design
- Ensure mobile responsiveness

**Deliverables**:
- All 40+ HTML pages redesigned and consistent

**Success Criteria**:
- 100% of site pages use new design system
- No visual inconsistencies across pages
- All pages mobile-responsive

---

## Phase 6: Performance Optimization

**Goal**: Achieve Lighthouse scores of 95+ across all metrics.

**Duration**: 2-3 days

### Tasks:

6.1. **CSS Optimization**
- Run Tailwind purge to remove unused classes
- Minimize CSS file size
- Combine and minify CSS files
- Implement critical CSS for above-the-fold content

6.2. **JavaScript Optimization**
- Audit JavaScript usage
- Remove unnecessary scripts
- Defer non-critical JavaScript
- Minify JavaScript files

6.3. **Image Optimization**
- Convert images to WebP format
- Implement lazy loading for below-fold images
- Add responsive image srcsets
- Optimize image compression

6.4. **Loading Performance**
- Eliminate render-blocking resources
- Implement resource hints (preload, prefetch, preconnect)
- Optimize font loading (font-display: swap)
- Minimize third-party scripts

6.5. **Mobile Performance Testing** (Critical)
- Test page load times on real iOS devices (3G, 4G, WiFi)
- Test page load times on real Android devices (3G, 4G, WiFi)
- Use Chrome DevTools throttling to simulate slow connections
- Measure Core Web Vitals specifically for mobile (LCP, FID, CLS)
- Verify < 2s page load on 3G, < 1s on 4G
- Optimize mobile-specific payloads if targets not met

6.6. **Accessibility Audit**
- Run axe DevTools on all pages
- Fix any accessibility issues
- Verify WCAG AAA compliance
- Test with screen readers

**Deliverables**:
- Optimized CSS (minimal file size)
- Optimized JavaScript (deferred/minified)
- Optimized images (WebP, lazy loading)
- Final Lighthouse reports for all key pages

**Success Criteria**:
- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+
- Mobile page load: < 2 seconds
- Desktop page load: < 1 second

---

## Phase 7: Testing & Quality Assurance

**Goal**: Verify all functionality works and design is consistent.

**Duration**: 2-3 days

### Tasks:

7.1. **Functionality Testing**
- Test all PHP includes (header, footer)
- Test LemonSqueezy payment integration
- Test bookshelf database features
- Test all forms (contact, support, checkout)
- Test all interactive elements (navigation, dropdowns, etc.)

7.2. **Cross-Browser Testing**
- Test on Chrome (latest)
- Test on Firefox (latest)
- Test on Safari (latest)
- Test on Edge (latest)
- Document any browser-specific issues

7.3. **Responsive Testing**
- Test on mobile devices (iOS, Android)
- Test on tablet devices
- Test on desktop (various screen sizes)
- Verify all breakpoints work correctly

7.4. **Visual Consistency Review**
- Review all 40+ pages for design consistency
- Check typography hierarchy on all pages
- Verify color usage (black/white + brand accents)
- Ensure no decorations (border-radius, shadows) slipped through

7.5. **Performance Testing**
- Run Lighthouse audits on all key pages
- Test on slow 3G network (mobile)
- Test on fast WiFi (desktop)
- Measure Core Web Vitals (LCP, FID, CLS)

**Deliverables**:
- Testing checklist with all items verified
- Bug list (if any issues found)
- Final Lighthouse reports
- Cross-browser compatibility report

**Success Criteria**:
- All functionality works as before redesign
- Design is consistent across all pages
- All browsers display correctly
- Lighthouse goals achieved

---

## Phase 8: Launch & Documentation

**Goal**: Deploy redesign to production and document changes.

**Duration**: 1 day

### Tasks:

8.1. **Pre-Launch Checklist**
- Backup current production site
- Review all Lighthouse reports
- Verify all links work
- Test checkout and payment flow one final time
- Review mobile experience on real devices

8.2. **Deployment**
- Deploy to Vercel
- Verify deployment successful
- Test production site functionality
- Monitor for any errors

8.3. **Documentation**
- Document design system for future updates
- Create style guide for maintaining consistency
- Document Tailwind configuration
- Document performance optimization techniques used

8.4. **Post-Launch Monitoring**
- Monitor Lighthouse scores (should remain 95+)
- Monitor for any user-reported issues
- Track page load times
- Track mobile vs desktop performance

**Deliverables**:
- Redesigned site live at authorkit.pro
- `DESIGN-SYSTEM.md` documentation
- `STYLE-GUIDE.md` for future maintenance
- Post-launch monitoring report (first week)

**Success Criteria**:
- Site successfully deployed to production
- No breaking functionality
- Lighthouse scores maintained at 95+
- Documentation complete for future maintenance

---

## Summary

**Total Duration**: ~20-25 days

**Phase Breakdown**:
1. Foundation & Design System: 2-3 days
2. Core Component Redesign: 3-4 days
3. Priority 1 Pages: 4-5 days
4. Priority 2 Pages: 3-4 days
5. Priority 3 Pages: 2-3 days
6. Performance Optimization: 2-3 days
7. Testing & QA: 2-3 days
8. Launch & Documentation: 1 day

**Key Milestones**:
- ✅ Day 3: Design system established
- ✅ Day 7: Core components redesigned
- ✅ Day 12: Priority 1 pages complete
- ✅ Day 16: All pages redesigned
- ✅ Day 19: Lighthouse goals achieved
- ✅ Day 22: Testing complete
- ✅ Day 23: Site launched

**Dependencies**:
- Phase 2 depends on Phase 1 (design system must be established first)
- Phases 3-5 depend on Phase 2 (components must be redesigned first)
- Phase 6 depends on Phases 3-5 (pages must exist before optimization)
- Phase 7 depends on Phase 6 (need optimized site for final testing)
- Phase 8 depends on Phase 7 (need QA approval before launch)

**Risk Mitigation**:
- Early Lighthouse baseline in Phase 1 ensures we know starting point
- Component-first approach (Phase 2) ensures consistency in later phases
- Performance optimization as dedicated phase ensures goals are met
- Comprehensive testing phase catches issues before launch

**Success Definition**:
Project is successful when:
1. All 40+ pages follow Minimalist Monochrome design
2. Lighthouse scores: Performance 95+, Accessibility 100, Best Practices 95+, SEO 95+
3. Mobile experience significantly improved
4. All existing functionality preserved
5. Brand colors integrated as accents
6. Site feels "high-end yet simple and polished"