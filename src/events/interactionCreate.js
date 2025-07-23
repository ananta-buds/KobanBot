const config = require('../config');
const logger = require('../utils/logger');
const RulesService = require('../services/rulesService');

/**
 * Handles interaction create events (buttons, slash commands, etc.)
 * @param {Client} client - Discord client instance
 * @param {Interaction} interaction - The interaction that was created
 */
async function handleInteractionCreate(client, interaction) {
  try {
    // Only handle button interactions for now
    if (!interaction.isButton()) {
      return;
    }

    logger.debug('Button interaction received', {
      customId: interaction.customId,
      userId: interaction.user.id,
      userTag: interaction.user.tag,
      guildId: interaction.guild?.id
    });

    // Handle rules acceptance button
    if (interaction.customId === config.acceptButtonId) {
      const rulesService = new RulesService(client);
      await rulesService.handleRuleAcceptance(interaction);
      return;
    }

    // Log unhandled button interactions
    logger.warn('Unhandled button interaction', {
      customId: interaction.customId,
      userId: interaction.user.id
    });

  } catch (error) {
    logger.error('Error handling interaction', {
      interactionId: interaction.id,
      customId: interaction.customId,
      userId: interaction.user.id,
      error: error.message
    });

    // Try to respond to the interaction if we haven't already
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: '❌ An error occurred while processing your request.', 
          ephemeral: true 
        });
      } else if (interaction.deferred) {
        await interaction.followUp({ 
          content: '❌ An error occurred while processing your request.', 
          ephemeral: true 
        });
      }
    } catch (responseError) {
      logger.error('Failed to send error response to interaction', {
        error: responseError.message
      });
    }
  }
}

module.exports = { handleInteractionCreate };