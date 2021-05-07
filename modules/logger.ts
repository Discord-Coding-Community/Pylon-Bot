import { LOG_CHANNEL, PERMISSIONS } from '../config/configs';

export namespace RoleUtil {
  /**
   * Union type between Role and Snowflake
   */
  type roleFlake = discord.Role | discord.Snowflake;
  /**
   * Gets a user's highest role.
   * @param {discord.GuildMember} user
   */
  export async function getHighest(user: discord.GuildMember) {
    const guild = await discord.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null)
      .sort((a, b) => b!.position - a!.position)[0];
  }
  /**
   * Gets a user's hoist role (highest role that is hoisted)
   * @param {discord.GuildMember} user
   */
  export async function getHoist(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.hoist)
      .sort((a, b) => b!.position - a!.position)
      .reverse()[0];
  }
  /**
   * Gets a user's member list color (highest role with a color)
   * @param {discord.GuildMember} user
   */
  export async function getColor(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.color)
      .sort((a, b) => b!.position - a!.position)[0];
  }
  /**
   * Sets a users roles.
   * Note: This will remove all the users roles!
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function set(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: ids
    });
  }
  /**
   * Adds roles to a user.
   * @param {roleFlake[]} roles
   */
  export async function add(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: user.roles.concat(ids)
    });
  }
  /**
   * Removes roles from a user.
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function remove(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: user.roles.filter((e) => !ids.includes(e))
    });
  }
  /**
   * Get a user's roles.
   * @param {discord.GuildMember} user
   */
  export async function get(user: discord.GuildMember) {
    const guild = await discord.getGuild();
    const r = await Promise.all(user.roles.map((id) => guild.getRole(id)));
    return r
      .filter((e) => e !== null)
      .sort((a, b) => b!.position - a!.position);
  }
  /**
   * Removes **every** role from a user.
   */
  export async function clear(user: discord.GuildMember) {
    await user.edit({
      roles: []
    });
  }
  /**
   * Check if the user has any of the roles
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function has(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    return ids.every((i) => user.roles.includes(i));
  }
  /**
   * Check if the user does not have any of the roles
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function doesNotHave(
    user: discord.GuildMember,
    roles: roleFlake[]
  ) {
    return !has(user, roles);
  }
  /**
   * Returns an array of members that have this role.
   * @param {roleFlake} role
   */
  export async function members(role: roleFlake) {
    const id = role instanceof discord.Role ? role.id : role;
    const mem = [];
    const guild = await discord.getGuild();
    for await (const e of guild.iterMembers()) {
      if (e.roles.includes(id)) mem.push(e);
    }
    return mem;
  }
  /**
   * Returns a collective array of members that have any of the roles
   * @param {roleFlake[]} roles
   */
  export async function membersCollective(roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    const mem = [];
    const guild = await discord.getGuild();
    for (const r of ids) {
      for await (const e of guild.iterMembers()) {
        if (e.roles.includes(r)) mem.push(e);
      }
    }
    return mem;
  }
  /**
   * Returns the role for @everyone (same as the guild ID)
   */
  export async function everyone() {
    return (await discord.getGuild()).id;
  }
}

function bitfieldToArray(bitfield: number) {
  return PERMISSIONS.filter((_, i) => {
    const current = 1 << i;
    return (bitfield & current) === current;
  });
}

export function capitalizeWords(s: string) {
  return s.replace(/(^|[ ])./g, (e) => e.toUpperCase());
}

export function makePermissionDiff(
  newPermissions: number,
  oldPermissions: number
) {
  return {
    added: bitfieldToArray(newPermissions)
      .filter((e) => !bitfieldToArray(oldPermissions).includes(e))
      .map((e) => `+ ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`),
    removed: bitfieldToArray(oldPermissions)
      .filter((e) => !bitfieldToArray(newPermissions).includes(e))
      .map((e) => `- ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`)
  };
}

discord.on('GUILD_ROLE_UPDATE', async (event, old) => {
  const messages = [];
  const ch = (await discord.getGuildTextChannel(LOG_CHANNEL))!;
  const timestamp = `\`[${new Date()
    .toLocaleTimeString()
    .replace(/[^\d:]/g, '')}]\``;
  const formattedID = `**[**||\`${event.role.id}\`||**]**`;

  if (event.role.permissions !== old.permissions) {
    const diff = makePermissionDiff(event.role.permissions, old.permissions);

    const diffBlock = `\`\`\`diff
${diff.added.length ? diff.added.join('\n') : ''}${diff.removed.length ? '\n' + diff.removed.join('\n') : ''
      }󠁡
\`\`\``;
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name} ${formattedID} permissions edited: ${diffBlock}`
    );
  }

  if (event.role.position !== old.position) {
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name} ${formattedID} position was changed: \`${old.position}\` ${discord.decor.Emojis.ARROW_RIGHT} \`${event.role.position}\``
    );
  }

  if (event.role.hoist !== old.hoist) {
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name
      } ${formattedID} hoist state was changed to \`${capitalizeWords(
        `${event.role.hoist}`
      )}\``
    );
  }

  if (event.role.mentionable !== old.mentionable) {
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name
      } ${formattedID} mentionable state was changed to \`${capitalizeWords(
        `${event.role.mentionable}`
      )}\``
    );
  }

  if (event.role.managed !== old.managed) {
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name
      } ${formattedID} managed role status was changed to \`${capitalizeWords(
        `${event.role.managed}`
      )}\``
    );
  }

  if (event.role.color !== old.color) {
    const oldColor = old.color.toString(16);
    const newColor = event.role.color.toString(16);
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name} ${formattedID} color was changed: \`#${oldColor}\` ➡️ \`${newColor}\``
    );
  }

  if (event.role.name !== old.name) {
    messages.push(
      `${timestamp} ${discord.decor.Emojis.GEAR} (\`Guild Role Update\`) ${event.role.name} ${formattedID} name was changed:  \n**•** __Before__: \`${old.name}\`\n**•** __After__:   \`${event.role.name}\``
    );
  }
  await ch.sendMessage(
    messages.length ? messages.join('\n') : 'An unknown role change happened.'
  );
});

discord.on(discord.Event.GUILD_UPDATE, async (current, old) => {
  // for if multiple changes happen in one event
  const messages: string[] = [];
  if (current.name !== old.name)
    messages.push(
      `server name changed from \`${old.name}\` to \`${current.name}\``
    );

  if (current.region !== old.region)
    messages.push(
      `server region changed from **${old.region}** to **${current.region}**`
    );

  if (current.description !== old.description)
    messages.push(
      `server description changed from \`${old.description}\` to \`${current.description}\``
    );
  const dmnKeys = ['All Messages', 'Only Mentions'];
  if (current.defaultMessageNotifications !== old.defaultMessageNotifications)
    messages.push(
      `server default message notifications changed from **${dmnKeys[old.defaultMessageNotifications]
      }** to **${dmnKeys[current.defaultMessageNotifications]}**`
    );
  const nsfwLevelKeys = ['Disabled', 'Members Without Roles', 'All Members'];
  if (current.explicitContentFilter !== old.explicitContentFilter)
    messages.push(
      `server explicit content filter changed from **${nsfwLevelKeys[old.explicitContentFilter]
      }** to **${nsfwLevelKeys[current.explicitContentFilter]}**`
    );
  const verificationLevelKeys = ['None', 'Low', 'Medium', 'High', 'Very High'];
  if (current.verificationLevel !== old.verificationLevel)
    messages.push(
      `server verification level changed from **${verificationLevelKeys[old.verificationLevel]
      }** to **${verificationLevelKeys[current.verificationLevel]}**`
    );

  if (current.maxPresences !== old.maxPresences)
    messages.push(
      `server max presences changed from **${old.maxPresences}** to **${current.maxPresences}**`
    );
  const mfaLevelKeys = ['None', 'Elevated'];
  if (current.mfaLevel !== old.mfaLevel)
    messages.push(
      `server 2fa requirement for moderation changed from **${mfaLevelKeys[old.mfaLevel]
      }** to **${mfaLevelKeys[current.mfaLevel]}**`
    );
  if (current.ownerId !== old.ownerId)
    messages.push(
      `server ownership changed from <@!${old.ownerId}> to <@!${current.ownerId}>`
    );
  if (current.afkChannelId !== old.afkChannelId) {
    messages.push(
      getChangeType(
        `server afk channel`,
        old.afkChannelId ? `<#${old.afkChannelId}>` : undefined,
        current.afkChannelId ? `<#${current.afkChannelId}>` : undefined
      )
    );
  }

  if (current.afkTimeout !== old.afkTimeout)
    messages.push(
      `server voice afk timeout changed from **${old.afkTimeout}**s to **${current.afkTimeout}**s`
    );
  if (current.premiumTier !== old.premiumTier)
    messages.push(
      `server boost tier changed from **${old.premiumTier}** to **${current.premiumTier}**`
    );
  if (current.premiumSubscriptionCount !== old.premiumSubscriptionCount)
    messages.push(
      `server boost count changed from **${old.premiumSubscriptionCount}** to **${current.premiumSubscriptionCount}**`
    );
  if (current.systemChannelId !== old.systemChannelId)
    messages.push(
      getChangeType(
        `server system channel`,
        old.systemChannelId ? `<#${old.systemChannelId}>` : undefined,
        current.systemChannelId ? `<#${current.systemChannelId}>` : undefined
      )
    );
  if (current.vanityUrlCode !== old.vanityUrlCode)
    messages.push(
      getChangeType(
        `server vanity url`,
        old.vanityUrlCode,
        current.vanityUrlCode
      )
    );
  if (current.widgetEnabled !== old.widgetEnabled)
    messages.push(
      `server widget changed from **${old.widgetEnabled}** to **${current.widgetEnabled}**`
    );
  if (current.widgetChannelId !== old.widgetChannelId)
    messages.push(
      getChangeType(
        `server widget channel`,
        old.widgetChannelId ? `<#${old.widgetChannelId}>` : undefined,
        current.widgetChannelId ? `<#${current.widgetChannelId}>` : undefined
      )
    );
  // shittily check if arrays arent equal
  if (current.features.sort().toString() !== old.features.sort().toString()) {
    const diff = makeArrayDiff(current.features, old.features);
    const diffBlock = `\`\`\`diff
${diff.added.join('\n')}
${diff.removed.join('\n')}
\`\`\``;
    messages.push(`server features changed: ${diffBlock}`);
  }

  const ch = await discord.getGuildTextChannel(LOG_CHANNEL);
  if (!ch) throw new Error('invalid logging channel id');
  const timestamp = `\`[${new Date()
    .toLocaleTimeString()
    .replace(/[^\d:]/g, '')}]\``;
  ch.sendMessage(
    messages
      .map(
        (e) =>
          `${timestamp} ${discord.decor.Emojis.MAP} (\`Guild Update\`) ${e}`
      )
      .join('\n')
  );
});
function getChangeType(itemName: string, oldVal: any, newVal: any) {
  if (!oldVal && newVal) return `${itemName} added: ${newVal}`;
  if (oldVal && !newVal) return `${itemName} removed: ${oldVal}`;
  if (oldVal && newVal)
    return `${itemName} changed from ${oldVal} to ${newVal}`;
  return `${itemName} was not changed`;
}
export function makeArrayDiff(current: any[], old: any[]) {
  return {
    added: current.filter((e) => !old.includes(e)).map((e) => `+ ${e}`),
    removed: old.filter((e) => !current.includes(e)).map((e) => `- ${e}`)
  };
}