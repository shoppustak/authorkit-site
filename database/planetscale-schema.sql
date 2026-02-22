-- AuthorKit Bookshelf Database Schema for PlanetScale (MySQL)
-- Run this SQL in your PlanetScale dashboard to set up the database

-- ============================================================================
-- Table: bookshelf_sites
-- Stores sites that have opted into the Bookshelf
-- ============================================================================
CREATE TABLE bookshelf_sites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_url VARCHAR(500) NOT NULL UNIQUE,
  site_name VARCHAR(255),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,
  INDEX idx_sites_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: bookshelf_books
-- Stores book data synced from WordPress sites
-- ============================================================================
CREATE TABLE bookshelf_books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_url VARCHAR(500) NOT NULL,
  book_post_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  cover_thumbnail VARCHAR(1000),
  cover_medium VARCHAR(1000),
  cover_large VARCHAR(1000),
  cover_full VARCHAR(1000),
  author_name VARCHAR(255),
  author_bio TEXT,
  author_website VARCHAR(1000),
  author_twitter VARCHAR(1000),
  author_instagram VARCHAR(1000),
  purchase_amazon_in VARCHAR(1000),
  purchase_amazon_com VARCHAR(1000),
  purchase_other VARCHAR(1000),
  local_categories JSON,
  formats JSON,
  isbn VARCHAR(50),
  rating DECIMAL(3,1),
  review_count INT,
  publication_date DATE,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_site_book (site_url, book_post_id),
  INDEX idx_books_site_url (site_url),
  INDEX idx_books_publication_date (publication_date DESC),
  INDEX idx_books_synced_at (synced_at DESC),

  CONSTRAINT fk_books_site
    FOREIGN KEY (site_url)
    REFERENCES bookshelf_sites(site_url)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: bookshelf_book_genres
-- Junction table for many-to-many book-genre relationship
-- ============================================================================
CREATE TABLE bookshelf_book_genres (
  book_id INT NOT NULL,
  genre_slug VARCHAR(100) NOT NULL,

  PRIMARY KEY (book_id, genre_slug),
  INDEX idx_book_genres_genre_slug (genre_slug),

  CONSTRAINT fk_book_genres_book
    FOREIGN KEY (book_id)
    REFERENCES bookshelf_books(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: bookshelf_genre_requests
-- Logs requests for new genres from authors
-- ============================================================================
CREATE TABLE bookshelf_genre_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  site_url VARCHAR(500),
  genre_label VARCHAR(255),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_genre_requests_date (requested_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Sample Queries (for testing)
-- ============================================================================

-- Get all books with their genres
-- SELECT
--   b.id,
--   b.title,
--   b.author_name,
--   b.site_url,
--   GROUP_CONCAT(bg.genre_slug) as genres
-- FROM bookshelf_books b
-- LEFT JOIN bookshelf_book_genres bg ON b.id = bg.book_id
-- GROUP BY b.id
-- ORDER BY b.synced_at DESC
-- LIMIT 20;

-- Get books by genre
-- SELECT
--   b.id,
--   b.title,
--   b.author_name,
--   b.cover_medium
-- FROM bookshelf_books b
-- INNER JOIN bookshelf_book_genres bg ON b.id = bg.book_id
-- WHERE bg.genre_slug = 'fantasy'
-- ORDER BY b.publication_date DESC
-- LIMIT 20;

-- Get stats
-- SELECT
--   COUNT(DISTINCT b.id) as total_books,
--   COUNT(DISTINCT b.site_url) as total_authors,
--   COUNT(DISTINCT bg.genre_slug) as genres_used
-- FROM bookshelf_books b
-- LEFT JOIN bookshelf_book_genres bg ON b.id = bg.book_id;
