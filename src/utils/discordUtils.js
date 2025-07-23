const logger = require('./logger');

/**
 * Discord-specific utility functions
 */
class DiscordUtils {
  /**
   * Safely fetches a Discord channel with error handling
   * @param {Client} client - Discord client
   * @param {string} channelId - Channel ID to fetch
   * @returns {Promise<Channel|null>} Channel or null if not found
   */
  static async fetchChannel(client, channelId) {
    try {
      const channel = await client.channels.fetch(channelId);
      return channel;
    } catch (error) {
      logger.error('Failed to fetch channel', {
        channelId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Safely fetches a Discord role with error handling
   * @param {Guild} guild - Discord guild
   * @param {string} roleId - Role ID to fetch
   * @returns {Role|null} Role or null if not found
   */
  static fetchRole(guild, roleId) {
    try {
      return guild.roles.cache.get(roleId) || null;
    } catch (error) {
      logger.error('Failed to fetch role', {
        roleId,
        guildId: guild.id,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Safely adds a role to a member with error handling
   * @param {GuildMember} member - Guild member
   * @param {Role} role - Role to add
   * @returns {Promise<boolean>} Success status
   */
  static async addRoleToMember(member, role) {
    try {
      await member.roles.add(role);
      logger.info('Role added to member', {
        userId: member.id,
        userTag: member.user.tag,
        roleId: role.id,
        roleName: role.name
      });
      return true;
    } catch (error) {
      logger.error('Failed to add role to member', {
        userId: member.id,
        userTag: member.user.tag,
        roleId: role.id,
        roleName: role.name,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Checks if a member already has a specific role
   * @param {GuildMember} member - Guild member
   * @param {string} roleId - Role ID to check
   * @returns {boolean} Whether member has the role
   */
  static memberHasRole(member, roleId) {
    return member.roles.cache.has(roleId);
  }

  /**
   * Formats a Discord user mention
   * @param {string} userId - User ID
   * @returns {string} Formatted mention
   */
  static formatUserMention(userId) {
    return `<@${userId}>`;
  }

  /**
   * Formats a Discord role mention
   * @param {string} roleId - Role ID
   * @returns {string} Formatted mention
   */
  static formatRoleMention(roleId) {
    return `<@&${roleId}>`;
  }

  /**
   * Formats a Discord channel mention
   * @param {string} channelId - Channel ID
   * @returns {string} Formatted mention
   */
  static formatChannelMention(channelId) {
    return `<#${channelId}>`;
  }

  /**
   * Gets display name for a user (nickname or username)
   * @param {GuildMember} member - Guild member
   * @returns {string} Display name
   */
  static getDisplayName(member) {
    return member.displayName || member.user.username;
  }

  /**
   * Checks if bot has required permissions in a channel
   * @param {Channel} channel - Discord channel
   * @param {Client} client - Discord client
   * @param {Array<string>} permissions - Required permissions
   * @returns {boolean} Whether bot has all permissions
   */
  static botHasPermissions(channel, client, permissions) {
    if (!channel.guild) return true; // DM channel
    
    const botMember = channel.guild.members.cache.get(client.user.id);
    if (!botMember) return false;

    const botPermissions = channel.permissionsFor(botMember);
    return permissions.every(permission => botPermissions.has(permission));
  }
}

module.exports = DiscordUtils;