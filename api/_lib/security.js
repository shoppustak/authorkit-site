/**
 * Security Utilities for AuthorKit API
 * Provides CORS, rate limiting, validation, and security headers
 */

import crypto from 'crypto';

/**
 * Allowed origins for CORS
 * WordPress sites will be validated via license key, not CORS
 */
const ALLOWED_ORIGINS = [
  'https://authorkit.pro',
  'https://www.authorkit.pro',
  // Add localhost for development only
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8000'
  ] : [])
];

/**
 * Set CORS headers with origin validation
 */
export function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  // For WordPress AJAX requests, we need to be more permissive
  // but we validate the license key in the request body instead
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For WordPress sites, allow but rely on license validation
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

/**
 * Set security headers
 */
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'"
  );
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis or Vercel Edge Config
 */
const rateLimitStore = new Map();

export function rateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Clean up old entries
  if (rateLimitStore.size > 10000) {
    const cutoff = now - windowMs;
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < cutoff) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    };
  }

  // Increment counter
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Validate and sanitize input
 */
export function validateInput(data, schema) {
  const errors = [];
  const sanitized = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Required field check
    if (rules.required && (!value || value.trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation for optional empty fields
    if (!value) {
      sanitized[field] = rules.default || null;
      continue;
    }

    // Type validation
    if (rules.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
        continue;
      }

      // Length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be less than ${rules.maxLength} characters`);
        continue;
      }

      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
        continue;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} has invalid format`);
        continue;
      }

      // Sanitize
      sanitized[field] = value.trim();
    }

    if (rules.type === 'url') {
      try {
        // Basic URL sanitization
        const cleaned = value
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '')
          .toLowerCase()
          .trim();

        if (cleaned.length === 0 || cleaned.length > 255) {
          errors.push(`${field} must be a valid URL`);
          continue;
        }

        sanitized[field] = cleaned;
      } catch (e) {
        errors.push(`${field} must be a valid URL`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized
  };
}

/**
 * Generate secure JWT-like token for downloads
 * Uses HMAC-SHA256 for signing
 */
export function generateSecureToken(payload, expiresIn = 3600) {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || 'change-this-in-production';
  const expiresAt = Date.now() + (expiresIn * 1000);

  const data = {
    ...payload,
    exp: expiresAt
  };

  const dataString = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex');

  // Create token: base64(data).signature
  const token = Buffer.from(dataString).toString('base64') + '.' + signature;

  return token;
}

/**
 * Verify secure token
 */
export function verifySecureToken(token) {
  try {
    const secret = process.env.DOWNLOAD_TOKEN_SECRET || 'change-this-in-production';
    const [dataB64, signature] = token.split('.');

    if (!dataB64 || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    const dataString = Buffer.from(dataB64, 'base64').toString('utf-8');
    const data = JSON.parse(dataString);

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(dataString)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' };
    }

    // Check expiration
    if (data.exp && Date.now() > data.exp) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: 'Token verification failed' };
  }
}

/**
 * Hash sensitive data (for logging without exposing)
 */
export function hashSensitiveData(data) {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Sanitize error messages for production
 */
export function sanitizeError(error, isDevelopment = false) {
  if (isDevelopment) {
    return {
      message: error.message,
      stack: error.stack
    };
  }

  // Generic message for production
  return {
    message: 'An error occurred. Please try again or contact support.'
  };
}

/**
 * Log security events
 */
export function logSecurityEvent(event, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };

  console.log('[SECURITY]', JSON.stringify(logEntry));

  // In production, send to external logging service
  // Example: Sentry, LogDNA, Datadog, etc.
}
