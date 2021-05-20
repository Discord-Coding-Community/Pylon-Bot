import { config } from '../config/cfg';
import { messages, utils, emoji } from '.';

export const channelCreate = async (channel: discord.Channel.AnyChannel) => {
  if (!config.modules.logging.scopes.channelCreate) return;
  if (channel instanceof discord.DmChannel)
    return utils.logmsg(
      messages.logs.CHANNEL_CREATE.DM_CHANNEL_OPENED,
      'DM Channel Opened'
    );
  utils.logmsg(
    utils.place(messages.logs.CHANNEL_CREATE.CHANNEL_CREATED, [
      [
        '{CHANNEL_MENTION}',
        `${utils.getChannelEmoji(channel)}\`${utils.escapeString(
          channel.name
        )}\``
      ],
      ['{CHANNEL_ID}', channel.id]
    ]),
    'Channel Create'
  );
};
export const channelDelete = async (channel: discord.Channel.AnyChannel) => {
  if (!config.modules.logging.scopes.channelDelete) return;
  if (channel instanceof discord.DmChannel)
    return utils.logmsg(
      messages.logs.CHANNEL_DELETE.CHANNEL_DELETED,
      'DM Channel Deleted'
    );
  utils.logmsg(
    utils.place(messages.logs.CHANNEL_DELETE.CHANNEL_DELETED, [
      [
        '{CHANNEL_MENTION}',
        `${utils.getChannelEmoji(channel)}\`${utils.escapeString(
          channel.name
        )}\``
      ],
      ['{CHANNEL_ID}', channel.id]
    ]),
    'Channel Delete'
  );
};
export const channelPinsUpdate = async (
  event: discord.Event.IChannelPinsUpdate
) => {
  if (!config.modules.logging.scopes.channelPinsUpdate) return;
  var target;
  for await (const item of (await discord.getGuild()).iterAuditLogs({
    limit: 1
  })) {
    if (
      (item.actionType == discord.AuditLogEntry.ActionType.MESSAGE_PIN ||
        item.actionType == discord.AuditLogEntry.ActionType.MESSAGE_UNPIN) &&
      item.options.channelId == event.channelId
    )
      target = item;
  }
  if (!target) return;
  const m = await utils.getMessage(target.options.messageId, event.channelId);
  if (!m) return;
  const used = m.pinned
    ? messages.logs.CHANNEL_PINS_UPDATE.MESSAGE_PINNED
    : messages.logs.CHANNEL_PINS_UPDATE.MESSAGE_UNPINNED;
  utils.logmsg(
    utils.place(used, [
      ['{MESSAGE_ID}', m.id],
      ['{USERTAG}', m.author.toMention()],
      ['{CHANNEL_ID}', m.channelId],
      ['{GUILD_ID}', event.guildId]
    ]),
    'Channel Pins Update'
  );
};
export const channelUpdate = async (
  c: discord.Channel.AnyChannel,
  oc: discord.Channel.AnyChannel
) => {
  if (!config.modules.logging.scopes.channelUpdate) return;
  if (
    oc instanceof discord.DmChannel ||
    c instanceof discord.DmChannel ||
    c == oc ||
    c.id !== oc.id
  )
    return;
  const msgs = [];
  if (
    c instanceof discord.GuildVoiceChannel &&
    oc instanceof discord.GuildVoiceChannel &&
    c.bitrate !== oc.bitrate
  )
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.BITRATE_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_BITRATE}', oc.bitrate / 1000],
        ['{NEW_BITRATE}', c.bitrate / 1000]
      ])
    );
  if (c.parentId !== oc.parentId)
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.CATEGORY_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        [
          '{OLD_MENTION}',
          `${emoji.CHANNEL_CATEGORY}\`${utils.escapeString(
            oc.parentId
              ? (await discord.getGuildCategory(oc.parentId))!.name
              : 'None'
          )}\``
        ],
        [
          '{NEW_MENTION}',
          `${emoji.CHANNEL_CATEGORY}\`${utils.escapeString(
            c.parentId
              ? (await discord.getGuildCategory(c.parentId))!.name
              : 'None'
          )}\``
        ]
      ])
    );
  if (c.name !== oc.name)
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.NAME_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_NAME}', utils.escapeString(oc.name)],
        ['{NEW_NAME}', utils.escapeString(c.name)]
      ])
    );
  if (
    c instanceof discord.GuildTextChannel &&
    oc instanceof discord.GuildTextChannel &&
    c.rateLimitPerUser !== oc.rateLimitPerUser
  )
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.SLOWMODE_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_SLOWMODE}', utils.escapeString(`${oc.rateLimitPerUser ?? 0}`)],
        ['{NEW_SLOWMODE}', utils.escapeString(`${c.rateLimitPerUser ?? 0}`)]
      ])
    );
  if (
    (c instanceof discord.GuildTextChannel ||
      c instanceof discord.GuildNewsChannel) &&
    (oc instanceof discord.GuildTextChannel ||
      oc instanceof discord.GuildNewsChannel) &&
    c.nsfw !== oc.nsfw
  )
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.NSFW_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_NSFW}', utils.escapeString(`${oc.nsfw}`)],
        ['{NEW_NSFW}', utils.escapeString(`${c.nsfw}`)]
      ])
    );
  if (
    (c instanceof discord.GuildTextChannel ||
      c instanceof discord.GuildNewsChannel) &&
    (oc instanceof discord.GuildTextChannel ||
      oc instanceof discord.GuildNewsChannel) &&
    c.topic !== oc.topic
  )
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.TOPIC_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_TOPIC}', utils.escapeString(`${oc.topic ?? 'None'}`)],
        ['{NEW_TOPIC}', utils.escapeString(`${c.topic ?? 'None'}`)]
      ])
    );
  const typeKeys = [
    'Text Channel',
    'DM',
    'Voice Channel',
    'Group DM',
    'Category',
    'Announcement Channel',
    'Store Channel'
  ];
  if (c.type !== oc.type)
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.TYPE_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_TYPE}', utils.escapeString(`${typeKeys[oc.type] ?? 'Unknown'}`)],
        ['{NEW_TYPE}', utils.escapeString(`${typeKeys[c.type] ?? 'Unknown'}`)]
      ])
    );
  if (
    c instanceof discord.GuildVoiceChannel &&
    oc instanceof discord.GuildVoiceChannel &&
    c.userLimit !== oc.userLimit
  )
    msgs.push(
      utils.place(messages.logs.CHANNEL_UPDATE.USERLIMIT_CHANGED, [
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c)}\`${utils.escapeString(c.name)}\``
        ],
        ['{CHANNEL_ID}', c.id],
        ['{OLD_LIMIT}', oc.userLimit],
        ['{NEW_LIMIT}', c.userLimit]
      ])
    );
  msgs.forEach((m) => utils.logmsg(m, 'Channel Update'));
};
export const guildBanAdd = async (
  user: Pick<discord.GuildBan, 'guildId' | 'user' | 'getGuild' | 'delete'>
) => {
  if (!config.modules.logging.scopes.guildBanAdd) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_BAN_ADD.MEMBER_BANNED, [
      ['{USERTAG}', user.user.toMention()]
    ]),
    'Guild Ban Add'
  );
};
export const guildBanRemove = async (
  user: Pick<discord.GuildBan, 'guildId' | 'user' | 'getGuild' | 'delete'>
) => {
  if (!config.modules.logging.scopes.guildBanRemove) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_BAN_REMOVE.MEMBER_UNBANNED, [
      ['{USERTAG}', user.user.toMention()]
    ]),
    'Guild Ban Remove'
  );
};
export const guildCreate = async (guild: discord.Guild) => {
  if (!config.modules.logging.scopes.guildCreate) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_CREATE.RECONNECTED, [
      ['{GUILD_NAME}', guild.name],
      ['{GUILD_ID}', guild.id]
    ]),
    'Guild Create'
  );
};
export const guildEmojisUpdate = async (
  currentEmojis: discord.Event.IGuildEmojisUpdate,
  oldEmojis: discord.Event.IGuildEmojisUpdate
) => {
  if (!config.modules.logging.scopes.guildEmojisUpdate) return;
  const g = await discord.getGuild();
  const diff = utils.diff(
    currentEmojis.emojis.map((e) => e.id),
    oldEmojis.emojis.map((e) => e.id)
  );
  if (diff.added.length) {
    const em = await g.getEmoji(diff.added[0]!);
    utils.logmsg(
      utils.place(messages.logs.GUILD_EMOJIS_UPDATE.ADDED_EMOJIS, [
        ['{EMOJI_MENTION}', em!.toMention()],
        ['{EMOJI_ID}', em!.id]
      ]),
      'Guild Emojis Update'
    );
  }
  if (diff.removed.length) {
    const em = await g.getEmoji(diff.removed[0]!);
    utils.logmsg(
      utils.place(messages.logs.GUILD_EMOJIS_UPDATE.REMOVED_EMOJIS, [
        ['{EMOJI_MENTION}', em!.toMention()],
        ['{EMOJI_ID}', em!.id]
      ]),
      'Guild Emojis Update'
    );
  }
  if (!diff.added.length && !diff.removed.length) {
    const em = currentEmojis.emojis.find(
      (e) => e.name !== oldEmojis.emojis.find((m) => m.id == e.id)!.name
    );
    if (!em) return;
    const oldEm = oldEmojis.emojis.find((e) => e.id == em.id);
    if (!oldEm) return;

    utils.logmsg(
      utils.place(messages.logs.GUILD_EMOJIS_UPDATE.EDITED_EMOJIS, [
        ['{EMOJI_MENTION}', em.toMention()],
        ['{EMOJI_ID}', em.id],
        ['{OLD_VALUE}', oldEm.name],
        ['{NEW_VALUE}', em.name]
      ]),
      'Guild Emojis Update'
    );
  }
};
export const guildIntegrationsUpdate = async (
  event: discord.Event.IGuildIntegrationsUpdate
) => {
  if (!config.modules.logging.scopes.guildIntegrationsUpdate) return;
  const guild = await discord.getGuild(event.guildId);
  if (guild === null) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_INTEGRATIONS_UPDATE.INTEGRATIONS_UPDATED, [
      ['{GUILD_NAME}', guild.name],
      ['{GUILD_ID}', guild.id]
    ]),
    'Guild Integrations Update'
  );
};
export const guildMemberAdd = async (member: discord.GuildMember) => {
  if (!config.modules.logging.scopes.guildMemberAdd) return;
  utils.logmsg(
    utils.place(
      member.user.bot
        ? messages.logs.GUILD_MEMBER_ADD.BOT_ADDED
        : messages.logs.GUILD_MEMBER_ADD.MEMBER_JOIN,
      [
        ['{USERTAG}', member.user.toMention()],
        [
          '{ACCOUNT_AGE}',
          utils.timestamp.simpleGetLongAgo(
            utils.Snowflake.decomposeSnowflake(member.user.id).timestamp
          )
        ]
      ]
    ),
    'Guild Member Add'
  );
};
export const guildMemberRemove = async (
  event: discord.Event.IGuildMemberRemove,
  member: discord.GuildMember
) => {
  if (!config.modules.logging.scopes.guildMemberRemove) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_MEMBER_REMOVE.MEMBER_LEFT, [
      ['{USERTAG}', event.user.toMention()],
      [
        '{RESIDENCE_DURATION}',
        utils.timestamp.simpleGetLongAgo(+new Date(member.joinedAt))
      ]
    ]),
    'Guild Member Remove'
  );
};
export const guildMemberUpdate = async (
  member: discord.GuildMember,
  oldMember: discord.GuildMember
) => {
  if (!config.modules.logging.scopes.guildMemberUpdate) return;
  if (member == oldMember) return;
  const u: [string, any] = ['{USERTAG}', member.user.toMention()];
  const guild = await discord.getGuild();
  if (member.user.avatar !== oldMember.user.avatar) {
    if (member.user.avatar && !oldMember.user.avatar)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.AVATAR_ADDED, [
          u,
          ['{URL}', member.user.getAvatarUrl()]
        ]),
        'Guild Member Update'
      );

    if (!member.user.avatar && oldMember.user.avatar)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.AVATAR_REMOVED, [
          u,
          ['{URL}', member.user.getAvatarUrl()]
        ]),
        'Guild Member Update'
      );
    if (member.user.avatar && oldMember.user.avatar)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.AVATAR_CHANGED, [
          u,
          ['{URL}', member.user.getAvatarUrl()]
        ]),
        'Guild Member Update'
      );
  }
  if (member.premiumSince !== oldMember.premiumSince)
    utils.logmsg(
      utils.place(
        member.premiumSince
          ? messages.logs.GUILD_MEMBER_UPDATE.BOOSTING_STARTED
          : messages.logs.GUILD_MEMBER_UPDATE.BOOSTING_STOPPED,
        [u]
      ),
      'Guild Member Update'
    );
  if (member.user.discriminator !== oldMember.user.discriminator)
    utils.logmsg(
      utils.place(messages.logs.GUILD_MEMBER_UPDATE.DISCRIMINATOR_CHANGED, [
        u,
        ['{OLD_DISCRIMINATOR}', oldMember.user.discriminator],
        ['{NEW_DISCRIMINATOR}', member.user.discriminator]
      ]),
      'Guild Member Update'
    );
  if (member.nick !== oldMember.nick) {
    if (member.nick && !oldMember.nick)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.NICK_ADDED, [
          u,
          ['{NEW_NICK}', utils.escapeString(member.nick)]
        ]),
        'Guild Member Update'
      );
    if (!member.nick && oldMember.nick)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.NICK_REMOVED, [
          u,
          ['{OLD_NICK}', utils.escapeString(oldMember.nick)]
        ]),
        'Guild Member Update'
      );
    if (member.nick && oldMember.nick)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.NICK_CHANGED, [
          u,
          ['{OLD_NICK}', utils.escapeString(oldMember.nick)],
          ['{NEW_NICK}', utils.escapeString(member.nick)]
        ]),
        'Guild Member Update'
      );
  }
  if (!utils.arraysEqual(member.roles, oldMember.roles)) {
    const roleDiff = utils.diff(member.roles, oldMember.roles);
    if (roleDiff.added.length && !roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.ROLES_ADDED, [
          u,
          ['{ADDED_ROLES}', roleDiff.added.map((e) => `<@&${e}>`).join(' ')]
        ]),
        'Guild Member Update'
      );
    if (!roleDiff.added.length && roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.ROLES_REMOVED, [
          u,
          ['{REMOVED_ROLES}', roleDiff.removed.map((e) => `<@&${e}>`).join(' ')]
        ]),
        'Guild Member Update'
      );
    if (roleDiff.added.length && roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_MEMBER_UPDATE.ROLES_CHANGED, [
          u,
          [
            '{CHANGED_ROLES}',
            roleDiff.added
              .map(async (e) => `+ ${(await guild.getRole(e))!.id}`)
              .concat(
                roleDiff.removed.map(
                  async (e) => `- ${(await guild.getRole(e))!.id}`
                )
              )
          ]
        ]),
        'Guild Member Update'
      );
  }
  if (member.user.username !== oldMember.user.username)
    utils.logmsg(
      utils.place(messages.logs.GUILD_MEMBER_UPDATE.USERNAME_CHANGED, [
        u,
        ['{OLD_USERNAME}', oldMember.user.username],
        ['{NEW_USERNAME}', member.user.username]
      ]),
      'Guild Member Update'
    );
};
export const guildRoleCreate = async (
  event: discord.Event.IGuildRoleCreate
) => {
  if (!config.modules.logging.scopes.guildRoleCreate) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_ROLE_CREATE.NEW_ROLE, [
      ['{ROLE_MENTION}', event.role.toMention()],
      ['{ROLE_ID}', event.role.id]
    ]),
    'Guild Role Create'
  );
};
export const guildRoleDelete = async (
  event: discord.Event.IGuildRoleDelete,
  oldRole: discord.Role
) => {
  if (!config.modules.logging.scopes.guildRoleDelete) return;
  utils.logmsg(
    utils.place(messages.logs.GUILD_ROLE_DELETE.REMOVED_ROLE, [
      ['{ROLE_NAME}', utils.escapeString(oldRole.name)],
      ['{ROLE_ID}', event.roleId]
    ]),
    'Guild Role Delete'
  );
};
export const guildRoleUpdate = async (
  event: discord.Event.IGuildRoleUpdate,
  oldRole: discord.Role
) => {
  if (!config.modules.logging.scopes.guildRoleUpdate) return;
  if (event.role == oldRole) return;
  const guild = await discord.getGuild();
  const mention: [string, any] = ['{ROLE_MENTION}', event.role.toMention()];
  const id: [string, any] = ['{ROLE_ID}', event.role.id];
  if (event.role.color !== oldRole.color)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.COLOR_CHANGED, [
        mention,
        id,
        ['{OLD_COLOR}', utils.convert.dec.hex(oldRole.color)],
        ['{NEW_COLOR}', utils.convert.dec.hex(event.role.color)]
      ]),
      'Guild Role Update'
    );
  if (event.role.hoist !== oldRole.hoist)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.HOIST_CHANGED, [
        mention,
        id,
        ['{NEW_HOIST}', event.role.hoist]
      ]),
      'Guild Role Update'
    );
  if (event.role.managed !== oldRole.managed)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.MANAGED_CHANGED, [
        mention,
        id,
        ['{NEW_MANAGED}', event.role.managed]
      ]),
      'Guild Role Update'
    );
  if (event.role.mentionable !== oldRole.mentionable)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.MENTIONABLE_CHANGED, [
        mention,
        id,
        ['{NEW_MENTIONABLE}', event.role.mentionable]
      ]),
      'Guild Role Update'
    );
  if (event.role.name !== oldRole.name)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.NAME_CHANGED, [
        mention,
        id,
        ['{OLD_NAME}', oldRole.name],
        ['{NEW_NAME}', event.role.name]
      ]),
      'Guild Role Update'
    );

  if (
    !utils.arraysEqual(
      utils.bitfieldToArray(event.role.permissions),
      utils.bitfieldToArray(oldRole.permissions)
    )
  ) {
    const roleDiff = utils.diff(
      utils.bitfieldToArray(event.role.permissions),
      utils.bitfieldToArray(oldRole.permissions)
    );
    if (roleDiff.added.length && !roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_ROLE_UPDATE.PERMS_ADDED, [
          mention,
          id,
          ['{ADDED_PERMS}', roleDiff.added.map((e) => `\`${e}\``).join(' ')]
        ]),
        'Guild Role Update'
      );
    if (!roleDiff.added.length && roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_ROLE_UPDATE.PERMS_REMOVED, [
          mention,
          id,
          ['{REMOVED_PERMS}', roleDiff.removed.map((e) => `\`${e}\``).join(' ')]
        ]),
        'Guild Role Update'
      );

    if (roleDiff.added.length && roleDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_ROLE_UPDATE.PERMS_CHANGED, [
          mention,
          id,
          [
            '{CHANGED_PERMS}',
            `\`\`\`diff
${roleDiff.added
  .map((e) => `+ ${e}`)
  .concat(roleDiff.removed.map((e) => `- ${e}`))
  .join('\n') ?? 'Could not resolve perms'}\`\`\``
          ]
        ]),
        'Guild Member Update'
      );
  }

  if (event.role.position !== oldRole.position)
    utils.logmsg(
      utils.place(messages.logs.GUILD_ROLE_UPDATE.POSITION_CHANGED, [
        mention,
        id,
        ['{OLD_POSITION}', oldRole.position],
        ['{NEW_POSITION}', event.role.position]
      ]),
      'Guild Role Update'
    );
};
export const guildUpdate = async (
  guild: discord.Guild,
  oldGuild: discord.Guild
) => {
  if (!config.modules.logging.scopes.guildUpdate) return;
  /**
   * afkchannel is bugged
   *   if (guild.afkChannelId !== oldGuild.afkChannelId) {
   *     if (guild.afkChannelId && !oldGuild.afkChannelId)
   *       utils.logmsg(
   *         utils.place(messages.logs.GUILD_UPDATE.AFKCHANNEL_ADDED, [
   *           ['{NEW_CHANNEL}', guild.afkChannelId]
   *         ]),
   *         'Guild Update'
   *       );
   *     if (!guild.afkChannelId && oldGuild.afkChannelId)
   *       utils.logmsg(
   *         utils.place(messages.logs.GUILD_UPDATE.AFKCHANNEL_REMOVED, [
   *           ['{OLD_CHANNEL}', oldGuild.afkChannelId]
   *         ]),
   *         'Guild Update'
   *       );
   *     if (guild.afkChannelId && oldGuild.afkChannelId)
   *       utils.logmsg(
   *         utils.place(messages.logs.GUILD_UPDATE.AFKCHANNEL_CHANGED, [
   *           ['{OLD_CHANNEL}', oldGuild.afkChannelId],
   *           ['{NEW_CHANNEL}', guild.afkChannelId]
   *         ]),
   *         'Guild Update'
   *       );
   *   }
   */
  if (guild.banner !== oldGuild.banner) {
    if (guild.banner && !oldGuild.banner)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.BANNER_ADDED, [
          ['{NEW_URL}', guild.getBannerUrl()]
        ]),
        'Guild Update'
      );
    if (!guild.banner && oldGuild.banner)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.BANNER_REMOVED, [
          ['{OLD_URL}', oldGuild.getBannerUrl()]
        ]),
        'Guild Update'
      );
    if (guild.banner && oldGuild.banner)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.BANNER_CHANGED, [
          ['{NEW_URL}', guild.getBannerUrl()]
        ]),
        'Guild Update'
      );
  }
  if (guild.premiumSubscriptionCount !== oldGuild.premiumSubscriptionCount)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.BOOST_SUBSCRIPTIONS_CHANGED, [
        ['{OLD_SUBS}', oldGuild.premiumSubscriptionCount],
        ['{NEW_SUBS}', guild.premiumSubscriptionCount]
      ]),
      'Guild Update'
    );
  if (guild.premiumTier !== oldGuild.premiumTier)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.BOOST_TIER_CHANGED, [
        ['{OLD_TIER}', oldGuild.premiumTier],
        ['{NEW_TIER}', guild.premiumTier]
      ]),
      'Guild Update'
    );
  if (guild.description !== oldGuild.description)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.DESCRIPTION_CHANGED, [
        ['{OLD_DESC}', utils.escapeString(oldGuild.description ?? '<unset>')],
        ['{NEW_DESC}', utils.escapeString(guild.description ?? '<unset>')]
      ]),
      'Guild Update'
    );
  const dmnKeys = ['All Messages', 'Only Mentions'];
  if (
    guild.defaultMessageNotifications !== oldGuild.defaultMessageNotifications
  )
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.DMN_CHANGED, [
        ['{OLD_DMN}', dmnKeys[oldGuild.defaultMessageNotifications]],
        ['{NEW_DMN}', dmnKeys[guild.defaultMessageNotifications]]
      ]),
      'Guild Update'
    );
  const explicitFilterKeys = [
    'Disabled',
    'Members Without Roles',
    'All Members'
  ];
  if (guild.explicitContentFilter !== oldGuild.explicitContentFilter)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.EXPLICIT_FILTER_CHANGED, [
        ['{OLD_FILTER}', explicitFilterKeys[oldGuild.explicitContentFilter]],
        ['{NEW_FILTER}', explicitFilterKeys[guild.explicitContentFilter]]
      ]),
      'Guild Update'
    );
  if (!utils.arraysEqual(guild.features, oldGuild.features)) {
    const featureDiff = utils.diff(
      utils.formatEnum(guild.features),
      utils.formatEnum(oldGuild.features)
    );
    if (featureDiff.added.length && !featureDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.FEATURES_ADDED, [
          [
            '{ADDED_FEATURES}',
            featureDiff.added.map((e) => `\`${e}\``).join(' ')
          ]
        ]),
        'Guild Role Update'
      );
    if (!featureDiff.added.length && featureDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.FEATURES_REMOVED, [
          [
            '{REMOVED_FEATURES}',
            featureDiff.removed.map((e) => `\`${e}\``).join(' ')
          ]
        ]),
        'Guild Role Update'
      );
    if (featureDiff.added.length && featureDiff.removed.length)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.FEATURES_CHANGED, [
          [
            '{CHANGED_FEATURES}',
            `\`\`\`diff
${featureDiff.added
  .map((e) => `+ ${e}`)
  .concat(featureDiff.removed.map((e) => `- ${e}`))
  .join('\n') ?? 'Could not resolve features'}\`\`\``
          ]
        ]),
        'Guild Member Update'
      );
  }
  if (guild.icon !== oldGuild.icon) {
    if (guild.icon && !oldGuild.icon)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.ICON_ADDED, [
          ['{NEW_URL}', guild.getIconUrl()]
        ]),
        'Guild Update'
      );
    if (!guild.icon && oldGuild.icon)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.ICON_REMOVED, [
          ['{OLD_URL}', oldGuild.getIconUrl()]
        ]),
        'Guild Update'
      );
    if (guild.icon && oldGuild.icon)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.ICON_CHANGED, [
          ['{NEW_URL}', guild.getIconUrl()]
        ]),
        'Guild Update'
      );
  }
  const mfaKeys = ['None', 'Elevated'];
  if (guild.mfaLevel !== oldGuild.mfaLevel)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.MFA_LEVEL_CHANGED, [
        ['{OLD_LEVEL}', mfaKeys[oldGuild.mfaLevel]],
        ['{NEW_LEVEL}', mfaKeys[guild.mfaLevel]]
      ]),
      'Guild Update'
    );
  if (guild.name !== oldGuild.name)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.NAME_CHANGED, [
        ['{OLD_NAME}', utils.escapeString(oldGuild.name)],
        ['{NEW_NAME}', utils.escapeString(guild.name)]
      ]),
      'Guild Update'
    );
  if (guild.ownerId !== oldGuild.ownerId)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.OWNER_CHANGED, [
        ['{OLD_OWNER}', oldGuild.ownerId],
        ['{NEW_OWNER}', guild.ownerId]
      ]),
      'Guild Update'
    );
  if (guild.preferredLocale !== oldGuild.preferredLocale)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.PREFERRED_LOCALE_CHANGED, [
        ['{OLD_LOCALE}', oldGuild.preferredLocale],
        ['{NEW_LOCALE}', guild.preferredLocale]
      ]),
      'Guild Update'
    );
  if (guild.region !== oldGuild.region)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.REGION_CHANGED, [
        ['{OLD_REGION}', oldGuild.region],
        ['{NEW_REGION}', guild.region]
      ]),
      'Guild Update'
    );
  if (guild.splash !== oldGuild.splash) {
    if (guild.splash && !oldGuild.splash)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SPLASH_ADDED, [
          ['{NEW_URL}', guild.getSplashUrl()]
        ]),
        'Guild Update'
      );
    if (!guild.splash && oldGuild.splash)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SPLASH_REMOVED, [
          ['{OLD_URL}', oldGuild.getSplashUrl()]
        ]),
        'Guild Update'
      );
    if (guild.splash && oldGuild.splash)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SPLASH_CHANGED, [
          ['{NEW_URL}', guild.getSplashUrl()]
        ]),
        'Guild Update'
      );
  }
  if (guild.systemChannelId !== oldGuild.systemChannelId) {
    if (guild.systemChannelId && !oldGuild.systemChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SYSTEM_CHANNEL_ADDED, [
          ['{NEW_CHANNEL}', guild.systemChannelId]
        ]),
        'Guild Update'
      );
    if (!guild.systemChannelId && oldGuild.systemChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SYSTEM_CHANNEL_REMOVED, [
          ['{OLD_CHANNEL}', oldGuild.systemChannelId]
        ]),
        'Guild Update'
      );
    if (guild.systemChannelId && oldGuild.systemChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.SYSTEM_CHANNEL_CHANGED, [
          ['{OLD_CHANNEL}', oldGuild.systemChannelId],
          ['{NEW_CHANNEL}', guild.systemChannelId]
        ]),
        'Guild Update'
      );
  }
  if (guild.vanityUrlCode !== oldGuild.vanityUrlCode) {
    if (guild.vanityUrlCode && !oldGuild.vanityUrlCode)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.VANITY_URL_ADDED, [
          ['{NEW_VANITY}', guild.vanityUrlCode]
        ]),
        'Guild Update'
      );
    if (!guild.vanityUrlCode && oldGuild.vanityUrlCode)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.VANITY_URL_REMOVED, [
          ['{OLD_VANITY}', oldGuild.vanityUrlCode]
        ]),
        'Guild Update'
      );
    if (guild.vanityUrlCode && oldGuild.vanityUrlCode)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.VANITY_URL_CHANGED, [
          ['{OLD_VANITY}', oldGuild.vanityUrlCode],
          ['{NEW_VANITY}', guild.vanityUrlCode]
        ]),
        'Guild Update'
      );
  }
  const verificationKeys = ['None', 'Low', 'Medium', 'High', 'Very High'];
  if (guild.verificationLevel !== oldGuild.verificationLevel)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.VERIFICATION_LEVEL_CHANGED, [
        ['{OLD_LEVEL}', verificationKeys[oldGuild.verificationLevel]],
        ['{NEW_LEVEL}', verificationKeys[guild.verificationLevel]]
      ]),
      'Guild Update'
    );
  if (guild.widgetEnabled !== oldGuild.widgetEnabled)
    utils.logmsg(
      utils.place(messages.logs.GUILD_UPDATE.WIDGET_CHANGED, [
        ['{OLD_WIDGET}', oldGuild.widgetEnabled ? 'enabled' : 'disabled'],
        ['{NEW_WIDGET}', guild.widgetEnabled ? 'enabled' : 'disabled']
      ]),
      'Guild Update'
    );
  if (guild.widgetChannelId !== oldGuild.widgetChannelId) {
    if (guild.widgetChannelId && !oldGuild.widgetChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.WIDGET_CHANNEL_ADDED, [
          ['{NEW_CHANNEL}', guild.widgetChannelId]
        ]),
        'Guild Update'
      );
    if (!guild.widgetChannelId && oldGuild.widgetChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.WIDGET_CHANNEL_REMOVED, [
          ['{OLD_CHANNEL}', oldGuild.widgetChannelId]
        ]),
        'Guild Update'
      );
    if (guild.widgetChannelId && oldGuild.widgetChannelId)
      utils.logmsg(
        utils.place(messages.logs.GUILD_UPDATE.WIDGET_CHANNEL_CHANGED, [
          ['{OLD_CHANNEL}', oldGuild.widgetChannelId],
          ['{NEW_CHANNEL}', guild.widgetChannelId]
        ]),
        'Guild Update'
      );
  }
};
export const messageDelete = async (
  event: discord.Event.IMessageDelete,
  oldMessage: discord.Message | discord.GuildMemberMessage | null
) => {
  if (!config.modules.logging.scopes.messageDelete) return;
  if (!oldMessage) return;
  const user: [string, any] = ['{USERTAG}', oldMessage.author.toMention()];
  const id: [string, any] = ['{MESSAGE_ID}', event.id];
  const content: [string, any] = [
    '{CONTENT}',
    oldMessage.content.length > 200
      ? `\`\`\`\n${utils.escapeString(
          oldMessage.content,
          undefined,
          true
        )}\`\`\``
      : `\`${utils.escapeString(oldMessage.content)}\``
  ];
  if (!event.guildId)
    return utils.logmsg(
      utils.place(messages.logs.MESSAGE_DELETE.MESSAGE_DELETED_DM, [
        user,
        id,
        content
      ]),
      'Message Delete'
    );
  if (oldMessage.member)
    return utils.logmsg(
      utils.place(messages.logs.MESSAGE_DELETE.MESSAGE_DELETED_GUILD, [
        user,
        id,
        content,
        ['{CHANNEL_ID}', event.channelId]
      ]),
      'Message Delete'
    );
  else
    return utils.logmsg(
      utils.place(messages.logs.MESSAGE_DELETE.MESSAGE_DELETED_GUILD_WEBHOOK, [
        id,
        content,
        ['{CHANNEL_ID}', event.channelId]
      ]),
      'Message Delete'
    );
};
export const messageDeleteBulk = async (
  event: discord.Event.IMessageDeleteBulk
) => {
  if (!config.modules.logging.scopes.messageDeleteBulk) return;
  utils.logmsg(
    utils.place(messages.logs.MESSAGE_DELETE_BULK.MESSAGES_DELETED, [
      ['{COUNT}', event.ids.length],
      ['{CHANNEL_ID}', event.channelId]
    ]),
    'Message Delete Bulk'
  );
};
export const messageReactionAdd = async (
  event: discord.Event.IMessageReactionAdd
) => {
  if (!config.modules.logging.scopes.messageReactionAdd) return;
  if (!event.member) return;
  utils.logmsg(
    utils.place(messages.logs.MESSAGE_REACTION_ADD.ADD_REACTION, [
      ['{USERTAG}', event.member.toMention()],
      ['{MESSAGE_ID}', event.messageId],
      ['{CHANNEL_ID}', event.channelId],
      [
        '{EMOJI_MENTION}',
        event.emoji.id
          ? `${event.emoji
              .toMention!()}\nEmoji: https://cdn.discordapp.com/emojis/${
              event.emoji.id
            }.${event.emoji.animated ? 'gif' : 'png'}`
          : event.emoji.name
      ],
      ['{GUILD_ID}', event.guildId]
    ]),
    'Message Reaction Add'
  );
};
export const messageReactionRemove = async (
  event: discord.Event.IMessageReactionRemove
) => {
  if (!config.modules.logging.scopes.messageReactionRemove) return;
  if (!event.member) return;
  utils.logmsg(
    utils.place(messages.logs.MESSAGE_REACTION_REMOVE.REMOVED_REACTION, [
      ['{USERTAG}', event.member.toMention()],
      ['{MESSAGE_ID}', event.messageId],
      ['{CHANNEL_ID}', event.channelId],
      [
        '{EMOJI_MENTION}',
        event.emoji.id
          ? `${event.emoji
              .toMention!()}\nEmoji: https://cdn.discordapp.com/emojis/${
              event.emoji.id
            }.${event.emoji.animated ? 'gif' : 'png'}`
          : event.emoji.name
      ],
      ['{GUILD_ID}', event.guildId]
    ]),
    'Message Reaction Add'
  );
};
export const messageReactionRemoveAll = async (
  event: discord.Event.IMessageReactionRemoveAll
) => {
  if (!config.modules.logging.scopes.messageReactionRemoveAll) return;
  if (!event) return;
  utils.logmsg(
    utils.place(
      messages.logs.MESSAGE_REACTION_REMOVE_ALL.REMOVED_ALL_REACTIONS,
      [
        ['{MESSAGE_ID}', event.messageId],
        ['{CHANNEL_ID}', event.channelId],
        ['{GUILD_ID}', event.guildId]
      ]
    ),
    'Message Reaction Add'
  );
};
export const messageUpdate = async (
  message: discord.Message.AnyMessage,
  oldMessage: discord.Message | discord.GuildMemberMessage | null
) => {
  if (!config.modules.logging.scopes.messageUpdate) return;
  if (!oldMessage) return;
  if (message.content == oldMessage.content) return;
  if (message.member)
    return utils.logmsg(
      utils.place(messages.logs.MESSAGE_UPDATE.MESSAGE_CONTENT_UPDATED_GUILD, [
        ['{USERTAG}', message.author.toMention()],
        ['{MESSAGE_ID}', message.id],
        ['{CHANNEL_ID}', message.channelId],
        [
          '{CONTENT_BEFORE}',
          oldMessage.content.length > 200
            ? `\`\`\`\n${utils.escapeString(
                oldMessage.content,
                undefined,
                true
              )}\`\`\``
            : `\`${utils.escapeString(oldMessage.content)}\``
        ],
        [
          '{CONTENT_AFTER}',
          message.content.length > 200
            ? `\`\`\`\n${utils.escapeString(
                message.content,
                undefined,
                true
              )}\`\`\``
            : `\`${utils.escapeString(message.content)}\``
        ],
        ['{GUILD_ID}', message.guildId]
      ]),
      'Message Update'
    );
  else
    return utils.logmsg(
      utils.place(messages.logs.MESSAGE_UPDATE.MESSAGE_CONTENT_UPDATED_DM, [
        ['{USERTAG}', message.author.toMention()],
        ['{MESSAGE_ID}', message.id],
        [
          '{CONTENT_BEFORE}',
          oldMessage.content.length > 200
            ? `\`\`\`\n${utils.escapeString(
                oldMessage.content,
                undefined,
                true
              )}\`\`\``
            : `\`${utils.escapeString(oldMessage.content)}\``
        ],
        [
          '{CONTENT_AFTER}',
          message.content.length > 200
            ? `\`\`\`\n${utils.escapeString(
                message.content,
                undefined,
                true
              )}\`\`\``
            : `\`${utils.escapeString(message.content)}\``
        ]
      ]),
      'Message Update'
    );
};
export const typingStart = async (event: discord.Event.ITypingStart) => {
  if (!config.modules.logging.scopes.typingStart) return;
  if (config.modules.logging.channel == event.channelId) return;
  if (event.member)
    return utils.logmsg(
      utils.place(messages.logs.TYPING_START.START_TYPING_GUILD, [
        ['{USERTAG}', event.member.toMention()],
        ['{CHANNEL_ID}', event.channelId]
      ]),
      'Typing Start'
    );

  return utils.logmsg(
    utils.place(messages.logs.TYPING_START.START_TYPING_DM, [
      ['{USERTAG}', (await discord.getUser(event.userId))!.toMention()]
    ]),
    'Typing Start'
  );
};
export const userUpdate = async (event: discord.User) => {
  if (!config.modules.logging.scopes.userUpdate) return;
  utils.logmsg(
    utils.place(messages.logs.USER_UPDATE.USER_UPDATED, [
      ['{USERTAG}', event.toMention()]
    ]),
    'User Update'
  );
};
export const voiceServerUpdate = async (
  event: discord.Event.IVoiceServerUpdate
) => {
  if (!config.modules.logging.scopes.voiceServerUpdate) return;
  utils.logmsg(
    utils.place(messages.logs.VOICE_SERVER_UPDATE.CONNECTED, [
      ['{ENDPOINT}', event.endpoint],
      ['{TOKEN}', event.token]
    ]),
    'Voice Server Update'
  );
};
export const voiceStateUpdate = async (
  voiceState: discord.VoiceState,
  oldVoiceState: discord.VoiceState
) => {
  if (!config.modules.logging.scopes.voiceStateUpdate) return;
  if (voiceState == oldVoiceState) return;
  const c = await discord.getGuildVoiceChannel(voiceState.channelId ?? '1');
  const oc = await discord.getGuildVoiceChannel(oldVoiceState.channelId ?? '1');
  if (voiceState.channelId !== oldVoiceState.channelId) {
    if (voiceState.channelId && !oldVoiceState.channelId)
      utils.logmsg(
        utils.place(messages.logs.VOICE_STATE_UPDATE.ENTERED_CHANNEL, [
          ['{USERTAG}', voiceState.member.toMention()],
          [
            '{CHANNEL_MENTION}',
            `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
          ],
          ['{CHANNEL_ID}', voiceState.channelId]
        ]),
        'Voice State Update'
      );
    if (!voiceState.channelId && oldVoiceState.channelId)
      utils.logmsg(
        utils.place(messages.logs.VOICE_STATE_UPDATE.LEFT_CHANNEL, [
          ['{USERTAG}', voiceState.member.toMention()],
          [
            '{CHANNEL_MENTION}',
            `${utils.getChannelEmoji(oc!)}\`${utils.escapeString(oc!.name)}\``
          ],
          ['{CHANNEL_ID}', oldVoiceState.channelId]
        ]),
        'Voice State Update'
      );
    if (voiceState.channelId && oldVoiceState.channelId)
      utils.logmsg(
        utils.place(messages.logs.VOICE_STATE_UPDATE.MOVED_CHANNEL, [
          ['{USERTAG}', voiceState.member.toMention()],
          [
            '{OLD_CHANNEL_MENTION}',
            `${utils.getChannelEmoji(oc!)}\`${utils.escapeString(oc!.name)}\``
          ],
          ['{OLD_CHANNEL_ID}', voiceState.channelId],

          [
            '{NEW_CHANNEL_MENTION}',
            `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
          ],
          ['{NEW_CHANNEL_ID}', voiceState.channelId]
        ]),
        'Voice State Update'
      );
  }
  if (voiceState.selfDeaf && !oldVoiceState.selfDeaf)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SELF_DEAFENED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (!voiceState.selfDeaf && oldVoiceState.selfDeaf)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SELF_UNDEAFENED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (voiceState.selfMute && !oldVoiceState.selfMute)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SELF_MUTED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (!voiceState.selfMute && oldVoiceState.selfMute)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SELF_UNMUTED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (voiceState.deaf && !oldVoiceState.deaf)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SERVER_DEAFENED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (!voiceState.deaf && oldVoiceState.deaf)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SERVER_UNDEAFENED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (voiceState.mute && !oldVoiceState.mute)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SERVER_MUTED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (!voiceState.mute && oldVoiceState.mute)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.SERVER_UNMUTED, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (voiceState.selfStream && !oldVoiceState.selfStream)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.START_STREAM, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
  if (!voiceState.selfStream && oldVoiceState.selfStream)
    utils.logmsg(
      utils.place(messages.logs.VOICE_STATE_UPDATE.STOP_STREAM, [
        ['{USERTAG}', voiceState.member.toMention()],
        [
          '{CHANNEL_MENTION}',
          `${utils.getChannelEmoji(c!)}\`${utils.escapeString(c!.name)}\``
        ],
        ['{CHANNEL_ID}', voiceState.channelId]
      ]),
      'Voice State Update'
    );
};
export const webhooksUpdate = async (event: discord.Event.IWebhooksUpdate) => {
  if (!config.modules.logging.scopes.webhooksUpdate) return;
  utils.logmsg(
    utils.place(messages.logs.WEBHOOKS_UPDATE.WEBHOOK_UPDATED, [
      ['{CHANNEL_ID}', event.channelId]
    ]),
    'Webhooks Update'
  );
};
discord.on(discord.Event.CHANNEL_CREATE, channelCreate);
discord.on(discord.Event.CHANNEL_DELETE, channelDelete);
discord.on(discord.Event.CHANNEL_UPDATE, channelUpdate);
discord.on(discord.Event.CHANNEL_PINS_UPDATE, channelPinsUpdate);
discord.on(discord.Event.GUILD_BAN_ADD, guildBanAdd);
discord.on(discord.Event.GUILD_BAN_REMOVE, guildBanRemove);
discord.on(discord.Event.GUILD_CREATE, guildCreate);
discord.on(discord.Event.GUILD_EMOJIS_UPDATE, guildEmojisUpdate);
discord.on(discord.Event.GUILD_INTEGRATIONS_UPDATE, guildIntegrationsUpdate);
discord.on(discord.Event.GUILD_MEMBER_ADD, guildMemberAdd);
discord.on(discord.Event.GUILD_MEMBER_REMOVE, guildMemberRemove);
discord.on(discord.Event.GUILD_MEMBER_UPDATE, guildMemberUpdate);
discord.on(discord.Event.GUILD_ROLE_CREATE, guildRoleCreate);
discord.on(discord.Event.GUILD_ROLE_DELETE, guildRoleDelete);
discord.on(discord.Event.GUILD_ROLE_UPDATE, guildRoleUpdate);
discord.on(discord.Event.GUILD_UPDATE, guildUpdate);
discord.on(discord.Event.MESSAGE_DELETE, messageDelete);
discord.on(discord.Event.MESSAGE_DELETE_BULK, messageDeleteBulk);
discord.on(discord.Event.MESSAGE_REACTION_ADD, messageReactionAdd);
discord.on(discord.Event.MESSAGE_REACTION_REMOVE, messageReactionRemove);
discord.on(discord.Event.MESSAGE_REACTION_REMOVE_ALL, messageReactionRemoveAll);
discord.on(discord.Event.MESSAGE_UPDATE, messageUpdate);
discord.on(discord.Event.TYPING_START, typingStart);
discord.on(discord.Event.USER_UPDATE, userUpdate);
discord.on(discord.Event.VOICE_SERVER_UPDATE, voiceServerUpdate);
discord.on(discord.Event.VOICE_STATE_UPDATE, voiceStateUpdate);
discord.on(discord.Event.WEBHOOKS_UPDATE, webhooksUpdate);
