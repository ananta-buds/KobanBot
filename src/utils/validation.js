/**
 * Validation utilities for common operations
 */
class ValidationUtils {
  /**
   * Validates a Discord snowflake ID
   * @param {string} id - The ID to validate
   * @returns {boolean} Whether the ID is valid
   */
  static isValidSnowflake(id) {
    return typeof id === 'string' && /^\d{17,19}$/.test(id);
  }

  /**
   * Validates a Discord token format
   * @param {string} token - The token to validate
   * @returns {boolean} Whether the token format is valid
   */
  static isValidDiscordToken(token) {
    return typeof token === 'string' && token.length > 50 && token.includes('.');
  }

  /**
   * Validates an email format
   * @param {string} email - The email to validate
   * @returns {boolean} Whether the email format is valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
  }

  /**
   * Validates a URL format
   * @param {string} url - The URL to validate
   * @returns {boolean} Whether the URL format is valid
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitizes a string for safe logging
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeForLog(str) {
    if (typeof str !== 'string') return str;
    
    // Remove potential tokens and sensitive data
    return str.replace(/[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}/g, '[TOKEN]')
              .replace(/\d{17,19}/g, '[ID]');
  }

  /**
   * Validates that a value is not empty
   * @param {any} value - Value to check
   * @returns {boolean} Whether the value is not empty
   */
  static isNotEmpty(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }
}

module.exports = ValidationUtils;