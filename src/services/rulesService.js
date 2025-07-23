const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const DiscordUtils = require('../utils/discordUtils');

/**
 * Service for handling rules-related functionality
 */
class RulesService {
  constructor(client) {
    this.client = client;
  }

  /**
   * Creates the rules embed
   * @param {string} rulesText - The rules text content
   * @returns {EmbedBuilder} The rules embed
   */
  createRulesEmbed(rulesText) {
    return new EmbedBuilder()
      .setTitle(config.rulesEmbedTitle)
      .setDescription(rulesText)
      .setColor(config.embedColor);
  }

  /**
   * Creates the accept button component
   * @returns {ActionRowBuilder} Action row with accept button
   */
  createAcceptButton() {
    const button = new ButtonBuilder()
      .setCustomId(config.acceptButtonId)
      .setLabel('✅ Accept')
      .setStyle(ButtonStyle.Success);

    return new ActionRowBuilder().addComponents(button);
  }

  /**
   * Checks if a rules message already exists in the channel
   * @param {TextChannel} channel - The channel to check
   * @returns {Promise<Message|null>} Existing message or null
   */
  async findExistingRulesMessage(channel) {
    try {
      const messages = await channel.messages.fetch({ limit: config.messageLimit });
      return messages.find(msg =>
        msg.author.id === this.client.user.id &&
        msg.embeds.length > 0 &&
        msg.embeds[0].title === config.rulesEmbedTitle
      ) || null;
    } catch (error) {
      logger.error('Failed to fetch messages from channel', {
        channelId: channel.id,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sends the rules message to the specified channel
   * @param {string} channelId - Channel ID to send rules to
   * @param {string} rulesText - Rules content
   * @returns {Promise<Message>} Sent message
   */
  async sendRulesMessage(channelId, rulesText) {
    try {
      const channel = await DiscordUtils.fetchChannel(this.client, channelId);
      
      if (!channel) {
        throw new Error(`Channel not found: ${channelId}`);
      }

      // Check bot permissions
      const requiredPermissions = ['SendMessages', 'EmbedLinks', 'UseExternalEmojis'];
      if (!DiscordUtils.botHasPermissions(channel, this.client, requiredPermissions)) {
        throw new Error('Bot missing required permissions in channel');
      }

      // Check if rules message already exists
      const existingMessage = await this.findExistingRulesMessage(channel);
      
      if (existingMessage) {
        logger.info('Rules message already exists, skipping send', {
          channelId: channel.id,
          messageId: existingMessage.id
        });
        return existingMessage;
      }

      const embed = this.createRulesEmbed(rulesText);
      const button = this.createAcceptButton();

      const message = await channel.send({
        embeds: [embed],
        components: [button],
      });

      logger.info('Rules message sent successfully', {
        channelId: channel.id,
        messageId: message.id
      });

      return message;
    } catch (error) {
      logger.error('Failed to send rules message', {
        channelId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handles rule acceptance by adding role to user
   * @param {Interaction} interaction - Button interaction
   * @returns {Promise<void>}
   */
  async handleRuleAcceptance(interaction) {
    try {
      await interaction.deferUpdate();

      const role = DiscordUtils.fetchRole(interaction.guild, config.roleComerID);

      if (!role) {
        logger.error('Role not found', { roleId: config.roleComerID });
        await interaction.followUp({ 
          content: '❌ Error: Role not found.', 
          ephemeral: true 
        });
        return;
      }

      // Check if user already has the role
      if (DiscordUtils.memberHasRole(interaction.member, role.id)) {
        await interaction.followUp({ 
          content: '✅ You already have the required role.', 
          ephemeral: true 
        });
        return;
      }

      const success = await DiscordUtils.addRoleToMember(interaction.member, role);
      
      if (success) {
        await interaction.followUp({ 
          content: '✅ Rules accepted! Welcome to the server.', 
          ephemeral: true 
        });
      } else {
        await interaction.followUp({ 
          content: '❌ Error: Unable to add role. Please contact an administrator.', 
          ephemeral: true 
        });
      }

    } catch (error) {
      logger.error('Failed to handle rule acceptance', {
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        error: error.message
      });

      try {
        await interaction.followUp({ 
          content: '❌ Error: Unable to add role. Please contact an administrator.', 
          ephemeral: true 
        });
      } catch (followUpError) {
        logger.error('Failed to send error follow-up', {
          error: followUpError.message
        });
      }
    }
  }
}

module.exports = RulesService;