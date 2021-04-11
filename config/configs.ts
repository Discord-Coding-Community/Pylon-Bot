// Variables
var f = discord.command.filters;

// Base Config
export const command_prefix = '~';

// Images
export const PYLON_ICON =
  'https://cdn.discordapp.com/icons/558032771558408246/4a00504cd8e382e703d4d88ec209044a.png';

// Channel IDs
export const LOG_CHANNEL = ' ';
export const ANNOUNCEMENT_CHANNEL = ' ';
export const MEMBER_COUNT_CHANNEL = ' ';
export const NEWS_CHANNEL_1 = ' ';
export const NEWS_CHANNEL_2 = ' ';
export const NEWS_CHANNEL_3 = ' ';
export const NEWS_CHANNEL_4 = ' ';

// Role IDs
export const MUTE_ROLE = ' ';
export const ADMIN_ROLE = ' ';
export const MOD_ROLE = ' ';
export const SUPPORT_ROLE = ' ';
export const MEMBER_ROLE = ' ';

// Permissions
export const ADMIN_PERMS = f.and(
  f.canManageChannels(),
  f.canManageMessages(),
  f.canBanMembers(),
  f.canKickMembers(),
  f.canManageChannelWebhooks(),
  f.canViewAuditLog(),
  f.canViewGuildInsights()
);

export const MOD_PERMS = f.and(
  f.canManageMessages(),
  f.canManageGuild(),
  f.canPrioritySpeaker(),
  f.canMuteMembers(),
  f.canMoveMembers(),
  f.canMentionEveryone()
);

export const HELPER_PERMS = f.and(
  f.canManageMessages(),
  f.canMuteMembers(),
  f.canMoveMembers(),
  f.canMentionEveryone()
);

export const MEMBER_PERMS = f.and(
  f.canEmbedLinks(),
  f.canReadMessageHistory(),
  f.canAddReactions()
);

export const PERMISSIONS = [
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
  'MANAGE_EMOJIS'
];
