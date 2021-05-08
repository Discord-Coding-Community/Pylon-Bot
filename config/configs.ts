// Variables
var f = discord.command.filters;

// Base Config
export const COMMAND_PREFIX = ' ';
export const GUILD_ID = ' ';

// Auto DeHoist Characters
export const AUTO_DEHOIST_CHARACTER_1 = '!';
export const AUTO_DEHOIST_CHARACTER_2 = "'";
export const AUTO_DEHOIST_CHARACTER_3 = '*';
export const AUTO_DEHOIST_CHARACTER_4 = '.';
export const AUTO_DEHOIST_CHARACTER_5 = ';';
export const AUTO_DEHOIST_CHARACTER_6 = ')';
export const AUTO_DEHOIST_CHARACTER_7 = '(';
export const AUTO_DEHOIST_CHARACTER_8 = '?';
export const AUTO_DEHOIST_CHARACTER_9 = '`';

// Images
export const PYLON_ICON =
  'https://avatars.githubusercontent.com/u/56440847?s=280&v=4';
export const TWITTER_ICON =
  'https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png';
export const PING_THUMBNAIL = 'https://emoji.gg/assets/emoji/8299_Loading.gif';

// API
export const WOLFRAM_API = ' ';
export const TWITTER_API = ' ';
export const TWITTER_BEARER = ' ';
export const PXLAPI_TOKEN = ' ';

// Channel IDs
export const LOG_CHANNEL = ' ';
export const ANNOUNCEMENT_CHANNEL = ' ';
export const MEMBER_COUNT_CHANNEL = ' ';
export const NEWS_CHANNEL = ' ';
export const JOIN_LEAVE_CHANNEL = ' ';

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

export const USER_PERMS = f.and(
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
  'MANAGE_EMOJIS',
  'REQUEST_TO_SPEAK',
  'MANAGE_THREADS',
  'USE_PUBLIC_THREADS',
  'USE_PRIVATE_THREADS',
  'USE_SLASH_COMMANDS'
];
