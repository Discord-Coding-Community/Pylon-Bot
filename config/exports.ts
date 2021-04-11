let f = discord.command.filters;

export const db = '../../modules/db/database';

export const command_prefix = '~';

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
