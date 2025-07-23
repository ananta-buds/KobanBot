const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const config = require('./config');
const logger = require('./utils/logger');
const { setupErrorHandling } = require('./utils/errorHandler');
const { handleReady } = require('./events/ready');
const { handleInteractionCreate } = require('./events/interactionCreate');

/**
 * KuroukaiBot - Discord Rules Bot
 * A modular Discord bot for handling server rules and role assignment
 */
class KuroukaiBot {
  constructor() {
    this.client = null;
    this.setupErrorHandling();
  }

  /**
   * Sets up global error handling
   */
  setupErrorHandling() {
    setupErrorHandling();
  }

  /**
   * Creates and configures the Discord client
   * @returns {Client} Configured Discord client
   */
  createClient() {
    return new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
      ],
    });
  }

  /**
   * Sets up event listeners for the Discord client
   */
  setupEventListeners() {
    // Ready event - fired when bot connects successfully
    this.client.once(Events.ClientReady, () => {
      handleReady(this.client);
    });

    // Interaction create event - fired when users interact with bot components
    this.client.on(Events.InteractionCreate, (interaction) => {
      handleInteractionCreate(this.client, interaction);
    });

    // Error event - fired when client encounters an error
    this.client.on(Events.Error, (error) => {
      logger.error('Discord client error', error);
    });

    // Warning event - fired for client warnings
    this.client.on(Events.Warn, (warning) => {
      logger.warn('Discord client warning', { warning });
    });

    // Debug event - fired for debug information (only in development)
    if (config.isDevelopment) {
      this.client.on(Events.Debug, (info) => {
        logger.debug('Discord client debug', { info });
      });
    }
  }

  /**
   * Starts the bot
   */
  async start() {
    try {
      logger.info('Starting KuroukaiBot...', {
        nodeEnv: config.nodeEnv,
        logLevel: config.logLevel
      });

      // Validate configuration
      logger.info('Configuration validated successfully');

      // Create Discord client
      this.client = this.createClient();

      // Setup event listeners
      this.setupEventListeners();

      // Login to Discord
      await this.client.login(config.token);

    } catch (error) {
      logger.error('Failed to start bot', error);
      process.exit(1);
    }
  }

  /**
   * Stops the bot gracefully
   */
  async stop() {
    try {
      logger.info('Stopping KuroukaiBot...');
      
      if (this.client) {
        await this.client.destroy();
        this.client = null;
      }
      
      logger.info('Bot stopped successfully');
    } catch (error) {
      logger.error('Error stopping bot', error);
    }
  }
}

// Start the bot if this file is run directly
if (require.main === module) {
  const bot = new KuroukaiBot();
  bot.start();
}

module.exports = KuroukaiBot;