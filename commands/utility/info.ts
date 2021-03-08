let f = discord.command.filters;
const INFO_PERMS = f.and(f.canSendMessages());

const InfoCommands: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: INFO_PERMS
  }
);

const timeMap = new Map([
  ['decade', 1000 * 60 * 60 * 24 * 365 * 10],
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 31],
  ['week', 1000 * 60 * 60 * 24 * 7],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
  ['second', 1000],
  ['milisecond', 1]
]);
function getLongAgoFormat(ts: number, limiter: number) {
  let runcheck = ts + 0;
  let txt = new Map();
  for (var [k, v] of timeMap) {
    if (runcheck < v || txt.entries.length >= limiter) continue;
    let runs = Math.ceil(runcheck / v) + 1;
    for (var i = 0; i <= runs; i++) {
      if (runcheck < v) break;
      if (txt.has(k)) {
        txt.set(k, txt.get(k) + 1);
      } else {
        txt.set(k, 1);
      }
      runcheck -= v;
    }
  }
  let txtret = new Array();
  let runsc = 0;
  for (var [key, value] of txt) {
    if (runsc >= limiter) break;
    let cc = value > 1 ? key + 's' : key;
    txtret.push(value + ' ' + cc);
    runsc++;
  }
  return txtret.join(', ');
}

function pad(v: string, n: number, c = '0') {
  return String(v).length >= n
    ? String(v)
    : (String(c).repeat(n) + v).slice(-n);
}
function decomposeSnowflake(snowflake: string) {
  let binary = pad(BigInt(snowflake).toString(2), 64);
  const res = {
    timestamp: parseInt(binary.substring(0, 42), 2) + 1420070400000,
    workerID: parseInt(binary.substring(42, 47), 2),
    processID: parseInt(binary.substring(47, 52), 2),
    increment: parseInt(binary.substring(52, 64), 2),
    binary: binary
  };
  return res;
}

InfoCommands.raw(
  {
    name: 'guild',
    aliases: ['g'],
    description: 'Displays the guild info'
  },
  async (message) => {
    let edmsg = message.reply('<a:loading:735794724480483409>');
    let embed = new discord.Embed();
    const guild = await message.getGuild();
    if (guild === null) throw new Error('guild not found');
    let icon = guild.getIconUrl();
    if (icon === null) icon = '';
    embed.setAuthor({
      name: guild.name,
      iconUrl: 'https://cdn.discordapp.com/emojis/735781410509684786.png?v=1'
    });
    let dtCreation = new Date(decomposeSnowflake(guild.id).timestamp);
    let diff = new Date(new Date().getTime() - dtCreation.getTime()).getTime();
    let tdiff = getLongAgoFormat(diff, 2);
    if (icon !== null) embed.setThumbnail({ url: icon });
    let desc = '';
    const formattedDtCreation = `${dtCreation.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`; /* @ ${dtCreation.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short'
  })}`;*/

    let preferredLocale =
      typeof guild.preferredLocale === 'string' &&
      guild.features.includes(discord.Guild.Feature.DISCOVERABLE)
        ? `\n  󠇰**Preferred Locale**: \`${guild.preferredLocale}\`\n`
        : '';
    let boosts =
      guild.premiumSubscriptionCount > 0
        ? `\n<:booster3:735780703773655102>**Boosts**: ${guild.premiumSubscriptionCount}\n`
        : '';
    let boostTier =
      guild.premiumTier !== null
        ? `\n  󠇰**Boost Tier**: ${guild.premiumTier}\n`
        : '';
    let systemChannel =
      guild.systemChannelId !== null
        ? `\n  󠇰**System Channel**: <#${guild.systemChannelId}>\n`
        : '';
    let vanityUrl =
      guild.vanityUrlCode !== null
        ? `\n  󠇰**Vanity Url**: \`${guild.vanityUrlCode}\``
        : '';
    let description =
      guild.description !== null
        ? `\n  󠇰**Description**: \`${guild.description}\``
        : '';
    let widgetChannel =
      guild.widgetChannelId !== null
        ? `<#${guild.widgetChannelId}>`
        : 'No channel';
    let widget =
      guild.widgetEnabled === true
        ? '\n  󠇰**Widget**: ' +
          discord.decor.Emojis.WHITE_CHECK_MARK +
          ` ( ${widgetChannel} )`
        : '';
    let features =
      guild.features.length > 0 ? guild.features.join(', ') : 'None';

    desc += `  **❯ **Information
<:rich_presence:735781410509684786>**ID**: \`${guild.id}\`
  󠇰**Created**: ${tdiff} ago **[**\`${formattedDtCreation}\`**]**
<:owner:735780703903547443>**Owner**: <@!${guild.ownerId}>
<:voice:735780703928844319>**Voice Region**: \`${guild.region}\`
  󠇰**Features**: \`${features}\`
  󠇰**Max Presences**: ${guild.maxPresences}${boosts}${boostTier}${widget}${description}${preferredLocale}${vanityUrl}${systemChannel}`;

    let chanStats = new Array();
    let counts: any = {
      text: 0,
      category: 0,
      voice: 0,
      news: 0,
      store: 0
    };
    let channels = await guild.getChannels();
    channels.forEach(function(ch) {
      if (ch.type === discord.GuildChannel.Type.GUILD_TEXT) counts.text++;
      if (ch.type === discord.GuildChannel.Type.GUILD_VOICE) counts.voice++;
      if (ch.type === discord.GuildChannel.Type.GUILD_STORE) counts.store++;
      if (ch.type === discord.GuildChannel.Type.GUILD_CATEGORY)
        counts.category++;
      if (ch.type === discord.GuildChannel.Type.GUILD_NEWS) counts.news++;
    });
    for (var k in counts) {
      let obj = counts[k];
      let emj = '';
      if (k === 'text') emj = '<:channel:735780703983239218> ';
      if (k === 'voice') emj = '<:voice:735780703928844319> ';
      if (k === 'store') emj = '<:store:735780704130170880> ';
      if (k === 'news') emj = '<:news:735780703530385470> ';
      if (k === 'category') emj = '<:rich_presence:735781410509684786> ';

      if (obj > 0)
        chanStats.push(
          '\n ' +
            emj +
            '**' +
            k.substr(0, 1).toUpperCase() +
            k.substr(1) +
            '**: **' +
            obj +
            '**'
        );
    }
    desc += '\n\n**❯ **Channels ⎯ ' + channels.length + chanStats.join('');
    const roles = await guild.getRoles();
    const emojis = await guild.getEmojis();

    desc += `
 
 
**❯ **Other Counts
 <:settings:735782884836638732> **Roles**: ${roles.length}
 <:emoji_ghost:735782884862066789> **Emojis**: ${emojis.length}`;
    let memberCounts: any = {
      human: 0,
      bot: 0,
      presences: {
        streaming: 0,
        game: 0,
        listening: 0,
        watching: 0,
        online: 0,
        dnd: 0,
        idle: 0,
        offline: 0
      }
    };
    for await (const member of guild.iterMembers()) {
      let usr = member.user;
      if (!usr.bot) {
        memberCounts.human++;
      } else {
        memberCounts.bot++;
        continue;
      }
      let pres = await member.getPresence();
      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.STREAMING;
        })
      )
        memberCounts.presences.streaming++;

      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.LISTENING;
        })
      )
        memberCounts.presences.listening++;

      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.GAME;
        })
      )
        memberCounts.presences.game++;
      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.WATCHING;
        })
      )
        memberCounts.presences.watching++;

      memberCounts.presences[pres.status]++;
    }
    let prestext = ``;
    let nolb = false;
    for (let key in memberCounts.presences) {
      let obj = memberCounts.presences[key];
      let emj = '';
      if (key === 'streaming') emj = '<:streaming:735793095597228034>';
      if (key === 'game') emj = discord.decor.Emojis.VIDEO_GAME;
      if (key === 'watching') emj = '<:watching:735793898051469354>';
      if (key === 'listening') emj = '<:spotify:735788337897406535>';
      if (key === 'online') emj = '<:status_online:735780704167919636>';
      if (key === 'dnd') emj = '<:status_busy:735780703983239168>';
      if (key === 'idle') emj = '<:status_away:735780703710478407>';
      if (key === 'offline') emj = '<:status_offline:735780703802753076>';

      if (obj > 0) {
        if (
          key !== 'streaming' &&
          key !== 'listening' &&
          key !== 'watching' &&
          key !== 'game' &&
          !prestext.includes('**⎯⎯⎯⎯⎯**') &&
          !nolb
        ) {
          if (prestext.length === 0) {
            nolb = true;
          } else {
            prestext += '\n**⎯⎯⎯⎯⎯**'; // add linebreak
          }
        }
        prestext += `\n ${emj} **-** ${obj}`;
      }
    }
    let bottxt = `\n <:bot:735780703945490542> **-** ${memberCounts.bot}
**⎯⎯⎯⎯⎯**`;
    if (memberCounts.bot <= 0) bottxt = '';
    desc += `
 
 
**❯ **Members ⎯ ${guild.memberCount}${bottxt}${prestext}`;
    embed.setDescription(desc);
    let editer = await edmsg;
    await editer.edit({ content: '', embed: embed });
  }
);

InfoCommands.on(
  {
    name: 'info',
    aliases: ['i', 'user'],
    description: 'Displays the user info of a specified user'
  },
  (ctx) => ({ user: ctx.userOptional() }),
  async (msg, { user }) => {
    const loadingMsg = await msg.reply({
      allowedMentions: {},
      content: '<a:loading:735794724480483409>'
    });
    if (user === null) {
      user = msg.author;
    }
    const emb = new discord.Embed();
    emb.setAuthor({ name: user.getTag(), iconUrl: user.getAvatarUrl() });
    let desc = `**❯ ${user.bot === false ? 'User' : 'Bot'} Information**
        <:rich_presence:735781410509684786> 󠇰**ID**: \`${user.id}\`
        ${discord.decor.Emojis.LINK} **Profile**: ${user.toMention()}`;
    const dtCreation = new Date(decomposeSnowflake(user.id).timestamp);
    const tdiff = getLongAgoFormat(Date.now() - dtCreation.getTime(), 2);
    const formattedDtCreation = `${dtCreation.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
    desc += `\n ${discord.decor.Emojis.CALENDAR_SPIRAL} **Created**: ${tdiff} ago **[**\`${formattedDtCreation}\`**]**`;
    const guild = await msg.getGuild();
    const member = await guild.getMember(user.id);
    if (member !== null) {
      // presences
      const presence = await member.getPresence();
      const statuses = presence.activities.map((pres) => {
        const key = pres.type;
        let emj = '';
        if (pres.type === discord.Presence.ActivityType.STREAMING) {
          emj = '<:streaming:735793095597228034>';
        }
        if (pres.type === discord.Presence.ActivityType.GAME) {
          emj = discord.decor.Emojis.VIDEO_GAME;
        }
        if (pres.type === discord.Presence.ActivityType.WATCHING) {
          emj = '<:watching:735793898051469354>';
        }
        if (pres.type === discord.Presence.ActivityType.LISTENING) {
          emj = '<:spotify:735788337897406535>';
        }
        if (pres.type === discord.Presence.ActivityType.CUSTOM) {
          let emjMention = '';
          if (pres.emoji !== null) {
            emjMention =
              pres.emoji.id === null
                ? pres.emoji.name
                : `<${pres.emoji.animated === true ? 'a' : ''}:${
                    pres.emoji.name
                  }:${pres.emoji.id}>`;
          } else {
            emjMention = discord.decor.Emojis.NOTEPAD_SPIRAL;
          }
          return `${emjMention}${
            pres.state !== null ? ` \`${pres.state}\`` : ''
          } (Custom Status)`;
        }

        return `${emj}${pres.name.length > 0 ? ` \`${pres.name}\`` : ''}`;
      });
      let emjStatus = '';
      if (presence.status === 'online') {
        emjStatus = '<:status_online:735780704167919636>';
      }
      if (presence.status === 'dnd') {
        emjStatus = '<:status_busy:735780703983239168>';
      }
      if (presence.status === 'idle') {
        emjStatus = '<:status_away:735780703710478407>';
      }
      if (presence.status === 'offline') {
        emjStatus = '<:status_offline:735780703802753076>';
      }
      desc += `\n ${emjStatus} **Status**: ${presence.status
        .substr(0, 1)
        .toUpperCase()}${presence.status.substr(1).toLowerCase()}`;
      if (statuses.length > 0) {
        desc += `\n  ${statuses.join('\n  ')}󠇰`;
      }

      const roles = member.roles.map((rl) => `<@&${rl}>`).join(' ');
      desc += '\n\n**❯ Member Information**';
      const dtJoin = new Date(member.joinedAt);
      const tdiffjoin = getLongAgoFormat(Date.now() - dtJoin.getTime(), 2);
      const formattedDtJoin = `${dtJoin.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
      desc += `\n ${discord.decor.Emojis.INBOX_TRAY} **Joined**: ${tdiffjoin} ago **[**\`${formattedDtJoin}\`**]**`;
      if (member.nick && member.nick !== null && member.nick.length > 0) {
        desc += `\n ${discord.decor.Emojis.NOTEPAD_SPIRAL} 󠇰**Nickname**: \`${member.nick}\``;
      }
      if (member.premiumSince !== null) {
        const boostDt = new Date(member.premiumSince);
        const tdiffboost = getLongAgoFormat(Date.now() - boostDt.getTime(), 2);
        const formattedDtBoost = `${boostDt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`;
        desc += `\n <:booster:735780703912067160> **Boosting since**: ${tdiffboost} ago **[**\`${formattedDtBoost}\`**]**`;
      }
      if (member.roles.length > 0) {
        desc += `\n ${discord.decor.Emojis.SHIELD} **Roles** (${member.roles.length}): ${roles}`;
      }
    }

    emb.setDescription(desc);
    await loadingMsg.edit({ content: '', embed: emb });
  }
);
