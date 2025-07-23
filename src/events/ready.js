const config = require('../config');
const logger = require('../utils/logger');
const RulesService = require('../services/rulesService');
const messages = require('../data/messages');

/**
 * Handles the 'ready' event when the bot successfully connects
 * @param {Client} client - Discord client instance
 */
async function handleReady(client) {
  try {
    logger.info(`Bot logged in as ${client.user.tag}`, {
      userId: client.user.id,
      serverCount: client.guilds.cache.size
    });

    const rulesService = new RulesService(client);
    
    // Send rules message to the configured channel
    await rulesService.sendRulesMessage(config.channelRulesId, messages.rules);
    
  } catch (error) {
    logger.error('Error during ready event handling', error);
    
    // In production, you might want to implement retry logic or alert administrators
    if (config.isProduction) {
      // Could add webhook notification, email alert, etc.
      process.exit(1);
    }
  }
}

module.exports = { handleReady };