var f = discord.command.filters;

export const permissions = {
  admin: f.and(
    f.canManageChannels(),
    f.canManageMessages(),
    f.canBanMembers(),
    f.canKickMembers(),
    f.canManageChannelWebhooks(),
    f.canViewAuditLog(),
    f.canViewGuildInsights()
  ),

  mod: f.and(
    f.canManageMessages(),
    f.canManageGuild(),
    f.canPrioritySpeaker(),
    f.canMuteMembers(),
    f.canMoveMembers(),
    f.canMentionEveryone()
  ),

  helper: f.and(
    f.canManageMessages(),
    f.canMuteMembers(),
    f.canMoveMembers(),
    f.canMentionEveryone()
  ),

  user: f.and(
    f.canEmbedLinks(),
    f.canReadMessageHistory(),
    f.canAddReactions()
  ),

  perms: [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_ANALYTICS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
    'REQUEST_TO_SPEAK',
    'MANAGE_THREADS',
    'USE_PUBLIC_THREADS',
    'USE_PRIVATE_THREADS',
    'USE_SLASH_COMMANDS'
  ]
};

export default permissions;
