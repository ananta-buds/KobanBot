const config = require('../config');

/**
 * Simple logging utility with different levels
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.currentLevel = this.levels[config.logLevel] || this.levels.info;
  }

  /**
   * Gets formatted timestamp
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Formats log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  /**
   * Logs at error level
   * @param {string} message - Log message
   * @param {Object|Error} meta - Additional metadata or error object
   */
  error(message, meta = {}) {
    if (this.currentLevel >= this.levels.error) {
      if (meta instanceof Error) {
        console.error(this.formatMessage('error', message), meta);
      } else {
        console.error(this.formatMessage('error', message, meta));
      }
    }
  }

  /**
   * Logs at warn level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    if (this.currentLevel >= this.levels.warn) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  /**
   * Logs at info level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    if (this.currentLevel >= this.levels.info) {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  /**
   * Logs at debug level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    if (this.currentLevel >= this.levels.debug) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }
}

module.exports = new Logger();