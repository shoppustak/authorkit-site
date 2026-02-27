/**
 * Environment variable validation utility
 * Validates required environment variables and provides helpful error messages
 */

/**
 * Required environment variables for different services
 */
const ENV_REQUIREMENTS = {
  // Supabase
  SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co'
  },
  SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anonymous/public API key',
    sensitive: true
  },

  // Lemon Squeezy
  LEMON_SQUEEZY_API_KEY: {
    required: true,
    description: 'Lemon Squeezy API key for license validation',
    sensitive: true
  },
  LEMON_SQUEEZY_WEBHOOK_SECRET: {
    required: true,
    description: 'Lemon Squeezy webhook signature secret',
    sensitive: true
  },

  // Security
  DOWNLOAD_TOKEN_SECRET: {
    required: true,
    description: 'Secret key for generating secure download tokens',
    sensitive: true,
    minLength: 32
  },

  // Optional but recommended
  NODE_ENV: {
    required: false,
    description: 'Node environment (development, production)',
    default: 'production',
    validValues: ['development', 'production', 'test']
  }
};

/**
 * Validation result
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether all required env vars are present
 * @property {Array<string>} errors - List of validation errors
 * @property {Array<string>} warnings - List of warnings
 */

/**
 * Validate environment variables
 *
 * @param {Array<string>} [requiredVars] - Specific vars to validate (validates all if not provided)
 * @returns {ValidationResult}
 */
export function validateEnv(requiredVars = null) {
  const errors = [];
  const warnings = [];

  // Determine which vars to validate
  const varsToCheck = requiredVars || Object.keys(ENV_REQUIREMENTS);

  for (const varName of varsToCheck) {
    const requirements = ENV_REQUIREMENTS[varName];

    if (!requirements) {
      warnings.push(`Unknown environment variable: ${varName}`);
      continue;
    }

    const value = process.env[varName];

    // Check if required
    if (requirements.required && !value) {
      errors.push(
        `Missing required environment variable: ${varName}\n` +
        `  Description: ${requirements.description}\n` +
        (requirements.example ? `  Example: ${requirements.example}` : '')
      );
      continue;
    }

    // Skip further validation if not set and not required
    if (!value) {
      continue;
    }

    // Validate length if specified
    if (requirements.minLength && value.length < requirements.minLength) {
      errors.push(
        `Environment variable ${varName} is too short\n` +
        `  Minimum length: ${requirements.minLength} characters\n` +
        `  Current length: ${value.length} characters`
      );
    }

    // Validate against allowed values
    if (requirements.validValues && !requirements.validValues.includes(value)) {
      errors.push(
        `Invalid value for ${varName}: "${value}"\n` +
        `  Valid values: ${requirements.validValues.join(', ')}`
      );
    }

    // Check for default/placeholder values
    if (value.includes('change-this') || value === 'your-key-here') {
      errors.push(
        `Environment variable ${varName} appears to be a placeholder value\n` +
        `  Please set a real value for: ${requirements.description}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate and throw error if validation fails
 * Use this at the start of critical API endpoints
 *
 * @param {Array<string>} [requiredVars] - Specific vars to validate
 * @throws {Error} If validation fails
 */
export function requireEnv(requiredVars) {
  const result = validateEnv(requiredVars);

  if (!result.valid) {
    const errorMessage = [
      'Environment variable validation failed:',
      '',
      ...result.errors,
      '',
      'Please check your .env file or Vercel environment variables.'
    ].join('\n');

    throw new Error(errorMessage);
  }

  // Log warnings in development
  if (process.env.NODE_ENV !== 'production' && result.warnings.length > 0) {
    console.warn('[ENV] Warnings:', result.warnings);
  }
}

/**
 * Get environment variable with fallback
 *
 * @param {string} varName - Environment variable name
 * @param {string} [defaultValue] - Default value if not set
 * @returns {string}
 */
export function getEnv(varName, defaultValue = null) {
  const value = process.env[varName];

  if (!value && defaultValue === null) {
    const requirement = ENV_REQUIREMENTS[varName];
    if (requirement?.required) {
      throw new Error(
        `Required environment variable ${varName} is not set\n` +
        `Description: ${requirement.description}`
      );
    }
  }

  return value || defaultValue;
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Validate environment on module load (optional - can be disabled)
 * Only validates in development to catch issues early
 */
if (process.env.VALIDATE_ENV_ON_LOAD === 'true' && !isProduction()) {
  const result = validateEnv();

  if (!result.valid) {
    console.error('[ENV] Environment validation failed:');
    result.errors.forEach(err => console.error(`  ${err}`));
  }

  if (result.warnings.length > 0) {
    console.warn('[ENV] Environment warnings:');
    result.warnings.forEach(warn => console.warn(`  ${warn}`));
  }
}
