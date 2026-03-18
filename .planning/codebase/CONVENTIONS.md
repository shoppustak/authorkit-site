# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- JavaScript files: lowercase with hyphens (e.g., `main.js`, `bookshelf-browse.js`, `footer-loader.js`)
- HTML files: lowercase with hyphens (e.g., `bookshelf-browse.html`, `privacy-policy.html`)
- CSS files: lowercase with hyphens (e.g., `input.css`, `styles.css`, `bookshelf.css`)
- Images: lowercase with hyphens (e.g., `logo-authorkit.svg`, `placeholder-book.jpg`)

**Functions:**
- Camel case for function names (e.g., `createBookCard()`, `formatGenreName()`, `getStarRating()`, `loadBooks()`)
- Descriptive verb-noun patterns for clarity (e.g., `createPageButton()`, `addAffiliateTag()`, `handleFormSubmit()`)
- Helper functions prefixed with action verbs: `get*`, `set*`, `format*`, `update*`, `render*`, `load*`, `create*`

**Variables:**
- Camel case for all variables and constants (e.g., `currentPage`, `currentGenre`, `amazonLink`, `mobileMenu`)
- All-caps with underscores for constant values (e.g., `AMAZON_AFFILIATE_TAG`)
- Module-level state variables follow camel case (e.g., `totalPages`, `currentSort`)
- Boolean variables use clear naming conventions (e.g., `hasHalfStar`, `isClickInside`, `isExpanded`)

**Types/Classes:**
- CSS classes use lowercase with hyphens (e.g., `book-card`, `book-cover-wrapper`, `btn-primary`, `btn-secondary`, `page-btn`, `genre-badge`)
- HTML IDs use lowercase with hyphens (e.g., `mobile-menu-button`, `search-input`, `sort-select`, `footer-placeholder`)
- CSS custom color variables use hyphens (e.g., `authorkit-orange`, `authorkit-blue`)

## Code Style

**Formatting:**
- No automated formatter configured (ESLint/Prettier absent)
- Consistent 4-space indentation observed across JavaScript and HTML files
- Single blank lines between function definitions
- Double blank lines between major sections in JavaScript files

**Linting:**
- No formal linting configuration (no `.eslintrc`, `.eslintrc.json`, or `.eslintrc.js`)
- Code quality enforced through manual review and conventions
- Browser console messages acceptable for logging and developer communication

## Import Organization

**Order:**
1. External library imports (`@supabase/supabase-js` imported in package.json)
2. Local script inclusions via HTML `<script>` tags
3. Module pattern IIFE wrappers for encapsulation (e.g., `footer-loader.js` uses IIFE with `'use strict'`)

**Path Aliases:**
- No path aliases configured
- Absolute root paths used for assets (e.g., `/css/styles.css`, `/images/favicon.svg`, `/api/bookshelf/books`)
- Relative paths for local includes (e.g., `includes/footer.html`)

**Script Loading:**
- External stylesheets loaded in `<head>` section
- JavaScript loaded via `<script>` tags at end of `<body>` or loaded dynamically
- Build output files use `.min.js` suffix for minified versions (e.g., `main.min.js`, `bookshelf.min.js`)

## Error Handling

**Patterns:**
- Try/catch blocks for async fetch operations (e.g., in `loadBooks()`, `addAffiliateTag()`, `loadFooter()`)
- Error messages logged to console with `console.error()` for debugging
- User-facing error messages displayed in DOM (e.g., `<p class="error">Failed to load books...</p>`)
- Graceful fallbacks for missing DOM elements: check element existence before manipulation
- Optional chaining and nullish coalescing not used; explicit null/undefined checks preferred

**Example pattern from `/Users/maulik/authorkit-site/js/bookshelf-browse.js`:**
```javascript
try {
    const response = await fetch(`/api/bookshelf/books?${params.toString()}`);
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to load books');
    }
    // ... success handling
} catch (error) {
    console.error('Failed to load books:', error);
    grid.innerHTML = '<p class="error">Failed to load books. Please try again later.</p>';
}
```

## Logging

**Framework:** Browser console (`console.log()`, `console.error()`, `console.warn()`)

**Patterns:**
- Development/informational logging uses `console.log()` with styled messages (see `main.js` line 215-217)
- Errors logged with `console.error()` including error object context
- Warnings logged with `console.warn()` for missing elements (e.g., footer placeholder not found)
- No production logging framework in use; simple console output
- Developer-facing messages styled with CSS (e.g., colored console output)

**Example from `/Users/maulik/authorkit-site/js/main.js`:**
```javascript
console.log('%cAuthorKit Website', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cBuilt with ❤️ for authors', 'font-size: 14px; color: #6b7280;');
```

## Comments

**When to Comment:**
- JSDoc-style comments for all functions with parameters and return types
- Inline comments for complex logic or non-obvious behavior
- Section comments for major features (prefixed with `//` on its own line)
- Placeholder comments for future implementation (e.g., "Placeholder for analytics tracking")

**JSDoc/TSDoc:**
- Functions include JSDoc block comments with `@param` and `@returns` tags
- Parameter types documented in JSDoc (e.g., `@param {Object}`, `@param {string}`, `@param {number}`)
- Return types documented in JSDoc (e.g., `@returns {HTMLElement}`, `@returns {string}`, `@returns {Function}`)
- No TypeScript; JSDoc used for type documentation in vanilla JavaScript

**Example from `/Users/maulik/authorkit-site/js/bookshelf.js`:**
```javascript
/**
 * Creates a book card element
 * @param {Object} book - Book data from API
 * @returns {HTMLElement} Book card element
 */
function createBookCard(book) {
    // implementation
}
```

## Function Design

**Size:**
- Most functions 20-50 lines
- Larger complex functions like `createBookCard()` (92 lines), `bookshelf-browse.js` modules up to 60 lines
- Single responsibility principle followed: functions do one thing
- Break down pagination logic into helper functions (`createPageButton()`, `renderPagination()`)

**Parameters:**
- Functions accept 1-2 parameters typically
- Complex data passed as objects (e.g., `{book}`, `{pagination}`)
- Variadic functions use `...args` spread operator (e.g., in debounce function)

**Return Values:**
- Functions return DOM elements (HTMLElement), strings, or objects
- Async functions return Promises
- Some functions are void (modify DOM or state directly)
- Helper functions return formatted data (strings, HTML elements)

**Example pattern for mutation vs. return:**
```javascript
// Mutation pattern - modifies DOM directly
function loadBooks() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '<div class="loading">Loading books...</div>';
    // ... loads and appends to grid
}

// Return pattern - creates and returns element
function createBookCard(book) {
    const card = document.createElement('div');
    // ... builds element
    return card;
}
```

## Module Design

**Exports:**
- No formal module system (no ES6 modules or CommonJS)
- Functions are globally available (defined at window scope)
- Module-level state variables persist across calls (e.g., `currentPage`, `currentGenre` in `bookshelf-browse.js`)

**Barrel Files:**
- Not applicable - no barrel file pattern used
- Single-file modules are the norm (one JavaScript file = one responsibility)
- Shared utilities included via separate script loads in HTML

**Encapsulation Pattern:**
- IIFE (Immediately Invoked Function Expression) used for encapsulation in `footer-loader.js`
- Variables and functions declared within IIFE have local scope
- Pattern: `(function() { 'use strict'; ... })();`

**Example from `/Users/maulik/authorkit-site/js/footer-loader.js`:**
```javascript
(function() {
    'use strict';

    async function loadFooter() {
        // local scope
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
```

---

*Convention analysis: 2026-03-18*
