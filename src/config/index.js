require('dotenv').config();
const ValidationUtils = require('../utils/validation');

/**
 * Configuration manager for the Discord bot
 * 
 * This class handles all environment variables and provides:
 * - Validation of required environment variables
 * - Type checking for Discord IDs and tokens
 * - Centralized access to configuration values
 * - Environment-specific settings
 * 
 * Security features:
 * - Validates Discord token format
 * - Validates Discord snowflake IDs (channel/role IDs)
 * - Throws descriptive errors for missing or invalid configuration
 */
class Config {
  constructor() {
    this.validateEnvironment();
  }

  /**
   * Validates that all required environment variables are present
   * @throws {Error} If required environment variables are missing
   */
  validateEnvironment() {
    const required = ['DISCORD_TOKEN', 'CHANNEL_RULES_ID', 'ROLE_COMER_ID'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate Discord token format
    if (!ValidationUtils.isValidDiscordToken(process.env.DISCORD_TOKEN)) {
      throw new Error('Invalid Discord token format');
    }

    // Validate snowflake IDs (Discord IDs are 64-bit integers)
    if (!ValidationUtils.isValidSnowflake(process.env.CHANNEL_RULES_ID)) {
      throw new Error('Invalid CHANNEL_RULES_ID format');
    }

    if (!ValidationUtils.isValidSnowflake(process.env.ROLE_COMER_ID)) {
      throw new Error('Invalid ROLE_COMER_ID format');
    }
  }

  // Bot Configuration
  get token() {
    return process.env.DISCORD_TOKEN;
  }

  get channelRulesId() {
    return process.env.CHANNEL_RULES_ID;
  }

  get roleComerID() {
    return process.env.ROLE_COMER_ID;
  }

  // Application Configuration
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  }

  get logLevel() {
    return process.env.LOG_LEVEL || 'info';
  }

  get isDevelopment() {
    return this.nodeEnv === 'development';
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }

  // Bot Settings
  get embedColor() {
    return '#00ff00';
  }

  get rulesEmbedTitle() {
    return '📜 Server Rules';
  }

  get acceptButtonId() {
    return 'accept_rules';
  }

  get messageLimit() {
    return 50;
  }
}

module.exports = new Config();