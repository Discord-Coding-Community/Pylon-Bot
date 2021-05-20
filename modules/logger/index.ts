import config from '../config/cfg';
const messages = {
  time_units: {
    ti_full: {
      singular: {
        decade: 'decade',
        year: 'year',
        month: 'month',
        week: 'week',
        day: 'day',
        hour: 'hour',
        minute: 'minute',
        second: 'second',
        millisecond: 'millisecond'
      },
      plural: {
        decade: 'decades',
        year: 'years',
        month: 'months',
        week: 'weeks',
        day: 'days',
        hour: 'hours',
        minute: 'minutes',
        second: 'seconds',
        millisecond: 'milliseconds'
      }
    },
    ti_short: {
      decade: 'dec',
      year: 'y',
      month: 'mo',
      week: 'w',
      day: 'd',
      hour: 'h',
      minute: 'm',
      second: 's',
      millisecond: 'ms'
    },
    months: {
      mo_full: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      mo_short: {
        january: 'jan',
        february: 'feb',
        march: 'mar',
        april: 'apr',
        may: 'may',
        june: 'jun',
        july: 'jul',
        august: 'aug',
        september: 'sep',
        october: 'oct',
        november: 'nov',
        december: 'dec'
      }
    }
  },
  ranks: {
    guest: 'Guest',
    authorized: 'Authorized',
    moderator: 'Moderator',
    administrator: 'Administrator',
    owner: 'Owner',
    system: 'System'
  },
  config: {
    cant_download_file:
      "{USER_MENTION} I couldn't grab that file, is another bot deleting the file?",
    cant_delete_message:
      "{USER_MENTION} I Couldn't delete your message! You might want to delete it yourself.",
    incorrect_guild_id:
      '{USER_MENTION} Incorrect guild ID in your config!\n\nAre you uploading it to the right server?',
    updated_config: '{USER_MENTION} ✅ updated the config!',
    error_updating_config:
      '{USER_MENTION} Error whilst updating your config:\n{ERROR}\n',
    get_config:
      '{USER_MENTION} here you go!\n\n*This message will self-destruct in 15 seconds*',
    get_default_config:
      '{USER_MENTION} here you go!\n\n**WARNING**: This is the default config, you did not have a config previously saved!\n**It is HIGHLY RECOMMENDED to start from a empty config instead!**\n\n*This message will self-destruct in 15 seconds*',
    deleted_config:
      '{USER_MENTION} done!\n\nFeel free to request a new config by typing `.config.`'
  },
  logs: {
    '|REACTROLES': {
      ROLE_ADDED:
        '🛡️ {USERTAG} reacted with {EMOJI} to a message in <#{CHANNEL_ID}> **[**`{MESSAGE_ID}`**]** to get role <@&{ROLE_ID}>',
      ROLE_REMOVED:
        '🛡️ {USERTAG} reacted with {EMOJI} to a message in <#{CHANNEL_ID}> **[**`{MESSAGE_ID}`**]** to remove role <@&{ROLE_ID}>'
    },
    '|PERSIST': {
      SAVED: '💾 {USERTAG} backup data saved.',
      RESTORED: '💾 {USERTAG} backup data restored.'
    },
    '|INFRACTIONS': {
      KICK: '👢 {ACTORTAG} kicked {USERTAG}{REASON}',
      MUTE: '🔇 {ACTORTAG} muted {USERTAG}{REASON}',
      UNMUTE: '🔊 {ACTORTAG} unmuted {USERTAG}{REASON}',
      TEMPMUTE: '🔇 {ACTORTAG} temp-muted {USERTAG} for {DURATION}{REASON}',
      TEMPMUTE_EXPIRED: "⏰ {USERTAG} 's tempmute expired.",
      BAN: '🔨 {ACTORTAG} banned {USERTAG}{REASON}',
      UNBAN: '🌀 {ACTORTAG} unbanned {USERTAG}{REASON}',
      SOFTBAN:
        '🌀 {ACTORTAG} softbanned {USERTAG} (deleting {DELETE_DAYS} days of their messages){REASON}',
      TEMPBAN: '🔨 {ACTORTAG} temp-banned {USERTAG} for {DURATION}{REASON}',
      TEMPBAN_EXPIRED: "⏰ {USERTAG} 's tempban expired.",
      MASSBAN:
        '🔨🔨🔨 {ACTORTAG} mass-banned {BANNED_USER_COUNT} users **[**`{BANNED_USERS}`**]**{REASON}',
      EDITED:
        '✎ {ACTORTAG} edited infraction id `{INFRACTION_ID}` : **{TYPE}** : `{NEW_VALUE}`',
      DELETED: '❕ {ACTORTAG} deleted infraction id `{INFRACTION_ID}`'
    },
    '|CORE': {
      BLACKLISTED_USER_ACTION:
        '⛔ blacklisted user {USERTAG} tried to perform {ACTION}'
    },
    '|COMMANDS': {
      CHAT_COMMAND_USED:
        '🛠️ {USERTAG} used chat command in <#{CHANNEL_ID}> : `{COMMAND_NAME}`',
      SLASH_COMMAND_USED:
        '🛠️ {USERTAG} used slash command in <#{CHANNEL_ID}> : **/**`{COMMAND_NAME}`{ARGUMENTS}'
    },
    '|ADMIN': {
      CLEAN: '🗑️ {ACTORTAG} cleaned **{MESSAGES}** messages{CHANNEL}{USERTAG}',
      LOCKED_CHANNEL: '🔒 {ACTORTAG} locked <#{CHANNEL_ID}>{DURATION}{REASON}',
      UNLOCKED_CHANNEL: '🔓 {ACTORTAG} unlocked <#{CHANNEL_ID}>{REASON}',
      LOCKED_GUILD: '🔒 {ACTORTAG} locked the server{DURATION}{REASON}',
      UNLOCKED_GUILD: '🔓 {ACTORTAG} unlocked the server{REASON}',
      SLOWMODE:
        '🐌 {ACTORTAG} set slowmode on <#{CHANNEL_ID}> to **{SECONDS}s**{DURATION}{REASON}',
      TEMPROLE:
        '🛡️ {ACTORTAG} added role {ROLE_MENTION} to {USERTAG} for {DURATION}{REASON}',
      TEMPROLE_EXPIRED: "🛡️ {USERTAG}'s temprole {ROLE_MENTION} expired",
      ROLE_ADDED:
        '🛡️ {ACTORTAG} added role {ROLE_MENTION} to {USERTAG}{REASON}',
      ROLE_REMOVED:
        '🛡️ {ACTORTAG} removed role {ROLE_MENTION} from {USERTAG}{REASON}',
      NICKNAME: "🧧 {ACTORTAG} changed {USERTAG}'s nickname to `{NEW_NICK}`"
    },
    '|ANTISPAM': {
      ANTIRAID:
        '❕ Message Anti Raid triggered with `{FLAGS}` and action `{ACTION}` was automatically performed',
      ANTIRAID_VIOLATION:
        '❕ Message Anti Raid triggered with `{FLAGS}` and there were **{DELETED_MESSAGES}** messages deleted.',
      VIOLATION:
        '🧰 {USERTAG} violated anti-spam flags: `{FLAGS}` and had **{DELETED_MESSAGES}** messages deleted.'
    },
    '|CENSOR': {
      CENSORED_MESSAGE:
        '💬 {USERTAG} had their message **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}> censored: `{CENSOR_MESSAGE}`**[**:{CENSOR_TP}**]** ➜ `{CENSOR_TARGET}`',
      CENSORED_USERNAME:
        '💬 {USERTAG} had their name of `{OLD_NAME}` censored: `{CENSOR_MESSAGE}`**[**:{CENSOR_TP}**]** ➜ `{CENSOR_TARGET}`'
    },
    '|ANTIPING': {
      FAIL_MARK_MEMBER_NOT_FOUND:
        '{ACTORTAG} tried to mark anti-ping punishment of {USERTAG} as {ACTION} but {USERTAG} left the server',
      FAIL_MARK_UNMUTE:
        '{ACTORTAG} tried to mark anti-ping punishment of {USERTAG} as {ACTION} but failed to unmute',
      FAIL_MARK_ACTION:
        '{ACTORTAG} tried to mark anti-ping punishment of {USERTAG} as {ACTION} but I failed to {ACTION} them',
      MARK_SUCCESS:
        "{ACTORTAG} successfully marked {USERTAG} 's punishment in <#{CHANNEL_ID}> as {ACTION}",
      LEFT_BANNED:
        '{USERTAG} left the server with pending anti-ping punishments and was auto-banned',
      TRIGGERED: '{USERTAG} triggered anti-ping in <#{CHANNEL_ID}>',
      TRIGGERED_MUTE:
        '{USERTAG} triggered anti-ping in <#{CHANNEL_ID}> and was auto-muted'
    },

    CHANNEL_CREATE: {
      CHANNEL_CREATED:
        '🔧 new channel created: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      DM_CHANNEL_OPENED: '📑 Someone opened a dm channel with the bot'
    },
    CHANNEL_UPDATE: {
      NAME_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** name updated: `{OLD_NAME}` ➜ `{NEW_NAME}`',
      CATEGORY_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed category: {OLD_MENTION} ➜ {NEW_MENTION}',
      TYPE_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed type: `{OLD_TYPE}` ➜ `{NEW_TYPE}`',
      NSFW_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** nsfw status set to **{NEW_NSFW}**',
      TOPIC_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed topic: `{OLD_TOPIC}` ➜ `{NEW_TOPIC}`',
      SLOWMODE_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed slowmode: **{OLD_SLOWMODE}s** ➜ **{NEW_SLOWMODE}s**',
      BITRATE_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed bitrate: **{OLD_BITRATE}kbps** ➜ **{NEW_BITRATE}kbps**',
      USERLIMIT_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** changed user limit: **{OLD_LIMIT}** ➜ **{NEW_LIMIT}**',
      PERMS_SYNCED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** permissions synchronized with {PARENT_MENTION}',
      PERMS_CHANGED:
        '🔧 channel edited: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]** permissions changed: {CHANGES}'
    },
    CHANNEL_DELETE: {
      CHANNEL_DELETED:
        '🔧 channel deleted: {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**'
    },
    CHANNEL_PINS_UPDATE: {
      // link:
      // <>[→ Jump to message](https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID})
      MESSAGE_PINNED:
        '📌 pinned a message **[**||`{MESSAGE_ID}`||**]** by {USERTAG} in <#{CHANNEL_ID}>\nJump to Message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}',
      MESSAGE_UNPINNED:
        '📌 unpinned a message **[**||`{MESSAGE_ID}`||**]** by {USERTAG} in <#{CHANNEL_ID}>\nJump to Message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}'
    },
    GUILD_MEMBER_ADD: {
      BOT_ADDED: '<:bot:735780703945490542> {USERTAG} was added to the server',
      MEMBER_JOIN:
        '📥 {USERTAG} joined the server (account created {ACCOUNT_AGE} ago)'
    },
    GUILD_MEMBER_REMOVE: {
      MEMBER_LEFT:
        '📤 {USERTAG} left the server, they were here for {RESIDENCE_DURATION}'
    },
    GUILD_BAN_ADD: {
      MEMBER_BANNED: '🔨 {USERTAG} was banned from the server'
    },
    GUILD_BAN_REMOVE: {
      MEMBER_UNBANNED: '🌀 {USERTAG} was unbanned from the server'
    },
    GUILD_MEMBER_UPDATE: {
      NICK_ADDED: '🧧 {USERTAG} nickname added `{NEW_NICK}`',
      NICK_CHANGED:
        '🧧 {USERTAG} nickname changed from `{OLD_NICK}` to `{NEW_NICK}`',
      NICK_REMOVED: '🧧 {USERTAG} nickname removed of `{OLD_NICK}`',
      ROLES_ADDED: '🛡️ {USERTAG} role(s) added: {ADDED_ROLES}',
      ROLES_REMOVED: '🛡️ {USERTAG} role(s) removed: {REMOVED_ROLES}',
      ROLES_CHANGED: '🛡️ {USERTAG} roles changed: {CHANGED_ROLES}',
      AVATAR_ADDED: '🖼️ {USERTAG} added avatar:\n{URL}',
      AVATAR_REMOVED: '🖼️ {USERTAG} removed their avatar:\n{URL}',
      AVATAR_CHANGED: '🖼️ {USERTAG} changed their avatar:\n{URL}',
      USERNAME_CHANGED:
        '📃 {USERTAG} changed their username from `{OLD_USERNAME}` to `{NEW_USERNAME}`',
      DISCRIMINATOR_CHANGED:
        '📃 {USERTAG} changed their discriminator from `{OLD_DISCRIMINATOR}` to `{NEW_DISCRIMINATOR}`',
      BOOSTING_STARTED: '📈 {USERTAG} boosted the server',
      BOOSTING_STOPPED: '📉 {USERTAG} unboosted the server'
    },
    GUILD_CREATE: {
      RECONNECTED:
        '🛰️ {GUILD_NAME} **[**||`{GUILD_ID}`||**]** reconnected to gateway',
      NEW_GUILD: '🔮 {GUILD_NAME} **[**||`{GUILD_ID}`||**]** new guild added'
    },
    GUILD_INTEGRATIONS_UPDATE: {
      INTEGRATIONS_UPDATED:
        '💸 {GUILD_NAME} **[**||`{GUILD_ID}`||**]** integrations have updated'
    },
    GUILD_EMOJIS_UPDATE: {
      EDITED_EMOJIS:
        '🙂 Edited emoji {EMOJI_MENTION} **[**||`{EMOJI_ID}`||**]** changed: `{OLD_VALUE}`➡`{NEW_VALUE}`',
      ADDED_EMOJIS:
        '🙂 Added emoji {EMOJI_MENTION} **[**||`{EMOJI_ID}`||**]** to the server',
      REMOVED_EMOJIS:
        '🙂 Removed emoji {EMOJI_MENTION} **[**||`{EMOJI_ID}`||**]** from the server'
    },
    GUILD_UPDATE: {
      NAME_CHANGED: '🗺 server name changed from `{OLD_NAME}` to `{NEW_NAME}`',
      REGION_CHANGED:
        '🗺 server region changed from **{OLD_REGION}** to **{NEW_REGION}**',
      DESCRIPTION_CHANGED:
        '🗺 server description changed from `{OLD_DESC}` to `{NEW_DESC}`',
      DMN_CHANGED:
        '🗺 server default message notifications changed from **{OLD_DMN}** to **{NEW_DMN}**',
      EXPLICIT_FILTER_CHANGED:
        '🗺 server explicit content filter changed from **{OLD_FILTER}** to **{NEW_FILTER}**',
      VERIFICATION_LEVEL_CHANGED:
        '🗺 server verification level changed from **{OLD_LEVEL}** to **{NEW_LEVEL}**',
      BANNER_ADDED: '🗺 server banner added:\n{NEW_URL}',
      BANNER_REMOVED: '🗺 server banner removed:\n{OLD_URL}',
      BANNER_CHANGED: '🗺 server banner changed:\n{NEW_URL}',
      ICON_ADDED: '🗺 server icon added:\n{NEW_URL}',
      ICON_REMOVED: '🗺 server icon removed:\n{OLD_URL}',
      ICON_CHANGED: '🗺 server icon changed:\n{NEW_URL}',
      PRESENCES_CHANGED:
        '🗺 server max presences changed from **{OLD_PRES}** to **{NEW_PRES}**',
      MFA_LEVEL_CHANGED:
        '🗺 server 2fa requirement for moderation changed from **{OLD_LEVEL}** to **{NEW_LEVEL}**',
      OWNER_CHANGED:
        '🗺 server ownership changed from <@!{OLD_OWNER}> to <@!{NEW_OWNER}>',
      AFKCHANNEL_ADDED: '🗺 server voice afk channel set to <#{NEW_CHANNEL}>',
      AFKCHANNEL_REMOVED:
        '🗺 server voice afk channel removed: <#{OLD_CHANNEL}>',
      AFKCHANNEL_CHANGED:
        '🗺 server voice afk channel changed from <#{OLD_CHANNEL}> to <#{NEW_CHANNEL}>',
      AFKTIMEOUT_CHANGED:
        '🗺 server voice afk timeout changed from **{OLD_TIMEOUT}**s to **{NEW_TIMEOUT}**s',
      BOOST_TIER_CHANGED:
        '🗺 server boost tier changed from **{OLD_TIER}** to **{NEW_TIER}**',
      BOOST_SUBSCRIPTIONS_CHANGED:
        '🗺 server boost count changed from **{OLD_SUBS}** to **{NEW_SUBS}**',
      PREFERRED_LOCALE_CHANGED:
        '🗺 server preferred locale changed from `{OLD_LOCALE}` to `{NEW_LOCALE}`',
      SPLASH_ADDED: '🗺 server splash added:\n{NEW_URL}',
      SPLASH_REMOVED: '🗺 server splash removed:\n{OLD_URL}',
      SPLASH_CHANGED: '🗺 server splash changed:\n{NEW_URL}',
      SYSTEM_CHANNEL_ADDED: '🗺 server system channel added <#{NEW_CHANNEL}>',
      SYSTEM_CHANNEL_REMOVED:
        '🗺 server system channel removed <#{OLD_CHANNEL}>',
      SYSTEM_CHANNEL_CHANGED:
        '🗺 server system channel changed from <#{OLD_CHANNEL}> to <#{NEW_CHANNEL}>',
      VANITY_URL_ADDED: '🗺 server vanity url added `{NEW_VANITY}`',
      VANITY_URL_REMOVED: '🗺 server vanity url removed `{OLD_VANITY}`',
      VANITY_URL_CHANGED:
        '🗺 server vanity url changed from `{OLD_VANITY}` to `{NEW_VANITY}`',
      WIDGET_CHANGED:
        '🗺 server widget changed from **{OLD_WIDGET}** to **{NEW_WIDGET}**',
      WIDGET_CHANNEL_ADDED:
        '🗺 server widget channel changed to <#{NEW_CHANNEL}>',
      WIDGET_CHANNEL_REMOVED:
        '🗺 server widget channel removed from <#{OLD_CHANNEL}>',
      WIDGET_CHANNEL_CHANGED:
        '🗺 server widget channel changed from <#{OLD_CHANNEL}> to <#{NEW_CHANNEL}>',
      FEATURES_REMOVED: '🗺 server features removed: {REMOVED_FEATURES}',
      FEATURES_CHANGED: '🗺 server features changed: {CHANGED_FEATURES}',
      FEATURES_ADDED: '🗺 server features added: {ADDED_FEATURES}'
    },
    GUILD_ROLE_CREATE: {
      NEW_ROLE:
        '⚙️ new role created **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** '
    },
    GUILD_ROLE_UPDATE: {
      NAME_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** name was changed:  \n**•** __Before__: `{OLD_NAME}`\n**•** __After__:   `{NEW_NAME}`',
      COLOR_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** color was changed: `#{OLD_COLOR}` ➡️ `#{NEW_COLOR}`',
      HOIST_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** hoist state was changed to `{NEW_HOIST}` ',
      MENTIONABLE_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** mentionable state was changed to `{NEW_MENTIONABLE}` ',
      POSITION_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** position was changed: `{OLD_POSITION}` ➡️ `{NEW_POSITION}`',
      MANAGED_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** managed role status was changed to `{NEW_MANAGED}`',
      PERMS_ADDED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** permissions granted: {ADDED_PERMS}',
      PERMS_REMOVED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** permissions revoked: {REMOVED_PERMS}',
      PERMS_CHANGED:
        '⚙️ role **(**{ROLE_MENTION}**)** **[**||`{ROLE_ID}`||**]** permissions edited: {CHANGED_PERMS}'
    },
    GUILD_ROLE_DELETE: {
      REMOVED_ROLE:
        '⚙️ role `{ROLE_NAME}` **[**||`{ROLE_ID}`||**]** was deleted'
    },
    MESSAGE_UPDATE: {
      MESSAGE_CONTENT_UPDATED_GUILD:
        '✏️ {USERTAG} edited their message **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>: \n**•** __Before__: {CONTENT_BEFORE}\n**•** __After__:   {CONTENT_AFTER}\nJump to message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}',
      MESSAGE_CONTENT_UPDATED_DM:
        "✏️ {USERTAG} edited their message **[**||`{MESSAGE_ID}`||**]** in the bot's dms: \n**•** __Before__: {CONTENT_BEFORE}\n**•** __After__:   {CONTENT_AFTER}"
    },
    MESSAGE_DELETE: {
      MESSAGE_DELETED_DM:
        "🗑️ message by {USERTAG} **[**||`{MESSAGE_ID}`||**]** was deleted in the bot's dms: {CONTENT}",
      MESSAGE_DELETED_GUILD:
        '🗑️ {USERTAG} message deleted **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>: {CONTENT}',
      MESSAGE_DELETED_GUILD_WEBHOOK:
        '🗑️ Webhook message deleted **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>: {CONTENT}',
      MESSAGE_DELETED_DM_NO_CACHE:
        "🗑️ message **[**||`{MESSAGE_ID}`||**]** was deleted in the bot's dms (no data)",
      MESSAGE_DELETED_GUILD_NO_CACHE:
        '🗑️ message **[**||`{MESSAGE_ID}`||**]** was deleted in <#{CHANNEL_ID}> (no data)'
    },
    MESSAGE_DELETE_BULK: {
      MESSAGES_DELETED: '🗑️ {COUNT} messages were deleted in <#{CHANNEL_ID}>'
    },
    MESSAGE_REACTION_ADD: {
      ADD_REACTION:
        '🙂 {USERTAG} added reaction to message **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>: {EMOJI_MENTION}\nJump to Message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}'
    },
    MESSAGE_REACTION_REMOVE: {
      REMOVED_REACTION:
        '🙂 {USERTAG} removed reaction from message **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>: {EMOJI_MENTION}\nJump to Message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}'
    },
    MESSAGE_REACTION_REMOVE_ALL: {
      REMOVED_ALL_REACTIONS:
        '🙂 all reactions removed from message **[**||`{MESSAGE_ID}`||**]** in <#{CHANNEL_ID}>\nJump to Message: https://discord.com/channels/{GUILD_ID}/{CHANNEL_ID}/{MESSAGE_ID}'
    },
    USER_UPDATE: {
      USER_UPDATED: '⚙️ bot user was updated {USERTAG}'
    },
    VOICE_STATE_UPDATE: {
      SERVER_DEAFENED:
        '🔇 {USERTAG} was server deafened in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SERVER_UNDEAFENED:
        '🔊 {USERTAG} was server undeafened in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SERVER_MUTED:
        '🎤 {USERTAG} was server muted in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SERVER_UNMUTED:
        '🎤 {USERTAG} was server unmuted in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SELF_DEAFENED:
        '🔇 {USERTAG} deafened themselves in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SELF_UNDEAFENED:
        '🔊 {USERTAG} undeafened themselves in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SELF_MUTED:
        '🎤 {USERTAG} muted themselves in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      SELF_UNMUTED:
        '🎤 {USERTAG} unmuted themselves in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      START_STREAM:
        '🖥️ {USERTAG} started streaming in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      STOP_STREAM:
        '🖥️ {USERTAG} stopped streaming in {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      ENTERED_CHANNEL:
        '☎️ {USERTAG} joined {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      LEFT_CHANNEL:
        '☎️ {USERTAG} left {CHANNEL_MENTION} **[**||`{CHANNEL_ID}`||**]**',
      MOVED_CHANNEL:
        '➡️ {USERTAG} moved from {OLD_CHANNEL_MENTION} **[**||`{OLD_CHANNEL_ID}`||**]** to {NEW_CHANNEL_MENTION} **[**||`{NEW_CHANNEL_ID}`||**]**'
    },
    VOICE_SERVER_UPDATE: {
      CONNECTED: 'connected to voice @`{ENDPOINT}` with token ||`{TOKEN}`||'
    },
    TYPING_START: {
      START_TYPING_GUILD: '✍️ {USERTAG} started typing in <#{CHANNEL_ID}>',
      START_TYPING_DM: '✍️ {USERTAG} started typing in the bot DMs'
    },
    WEBHOOKS_UPDATE: {
      WEBHOOK_UPDATED: '🧾 webhook updated in <#{CHANNEL_ID}>'
    }
  }
};
export const enum CustomEmojis {
  CHANNEL_VOICE = '<:IconChannel_Voice:798624234732781580>',
  CHANNEL_NEWS = '<:IconChannel_News:798624238793261109>',
  CHANNEL_STORE = '<:IconChannel_Str:798624234745757727>',
  CHANNEL_TEXT = '<:IconChannel_Text:798624246905569323>',
  CHANNEL_CATEGORY = '<:IconChannel_Category:798624247122493450>',
  CHANNEL_TEXT_LOCKED = '<:IconChannel_TextLocked:798624234809196624>',
  CHANNEL_VOICE_LOCKED = '<:IconChannel_VoiceLocked:798624234397499394>',
  CHANNEL_TEXT_NSFW = '<:IconChannel_TextNSFW:798624234628579399>',

  GUI_TYPING = '<a:IconGui_Typing:798624244351107092>',
  GUI_OWNERCROWN = '<:IconGui_OwnerCrown:799657143719952415>',
  GUI_MEMBERS = '<:IconGui_Members:798624241868079104>',
  GUI_GIF = '<:IconGui_GIF:799642414431207496>',
  GUI_ADD_FILE = '<:IconGui_AddFile:799643046614007838>',
  GUI_INVITE = '<:IconGui_Invite:798624241347198987>',
  GUI_RICH_PRESENCE = '<:IconGui_RichPresence:798624241351655514>',
  GUI_SLOWMODE = '<:IconGui_Slowmode:798624247337058354>',
  GUI_SETTINGS = '<:IconGui_Settings:798624241402511420>',
  GUI_ADD_REACTION = '<:IconGui_AddReaction:798624236935053332>',
  GUI_ROLE = '<:IconGui_Role:816328284245196840>',

  BADGE_NITRO = '<:IconBadge_Nitro:798624232472051792>',
  BADGE_PARTNER = '<:IconBadge_Partner:798624238939406416>',
  BADGE_VERIFIED = '<:IconBadge_Verified:801248680476016671>',
  BADGE_BUG_HUNTER = '<:IconBadge_BugHunter:798624232338227261>',
  BADGE_BUG_HUNTER_2 = '<:IconBadge_BugHunterGold:799290353357684797>',
  BADGE_STAFF = '<:IconBadge_Staff:798624241595318272>',
  BADGE_EARLY_SUPPORTER = '<:IconBadge_EarlySupporter:798624232471920680>',
  BADGE_BOT_DEVELOPER = '<:IconBadge_BotDeveloper:798624232443478037>',
  BADGE_HYPESQUAD_BALANCE = '<:IconBadge_HypeSquadBalance:798624232409661451>',
  BADGE_HYPESQUAD_BRAVERY = '<:IconBadge_HypeSquadBravery:798624232425652244>',
  BADGE_HYPESQUAD_BRILLIANCE = '<:IconBadge_HypeSquadBrilliance:798624232552529920>',
  BADGE_HYPESQUAD_EVENTS = '<:IconBadge_HypeSquadEvents:798624232694087682>',
  BADGE_OLD_PARTNER = '<:IconBadge_OldPartner:798624234305093672>',
  BADGE_VERIFIED_BOT = '<:IconBadge_VerifiedBot:798624262533283865>',

  STATUS_DND = '<:IconStatus_Dnd:798624244669087805>',
  STATUS_IDLE = '<:IconStatus_Idle:798624247295246336>',
  STATUS_OFFLINE = '<:IconStatus_Offline:798624247546511370>',
  STATUS_ONLINE = '<:IconStatus_Online:798624246728228874>',

  BOT_HALLUCINATE = '<:Hallucinate:800092998590529557>',
  BOT_PYLON = '<:Pylon:818884051199983617>',

  ICON_GITHUB = '<:GitHub:805634226921013258>',

  TICK_GREEN = '<:yesTick:804175929995427861>',
  TICK_RED = '<:noTick:804175930028720178>',
  TICK_GRAY = '<:maybe:801847909795627048>'
}
module utils {
  export function diff<T>(current: T[], old: T[]) {
    return {
      added: current.filter((e) => !old.includes(e)),
      removed: old.filter((e) => !current.includes(e))
    };
  }
  const permissions = [
    'Create Instant Invite',
    'Kick Members',
    'Ban Members',
    'Administrator',
    'Manage Channels',
    'Manage Guild',
    'Add Reactions',
    'View Audit Log',
    'Priority Speaker',
    'Stream',
    'View Channel',
    'Send Messages',
    'Send TTS Messages',
    'Manage Messages',
    'Embed Links',
    'Attach Files',
    'Read Message History',
    'Mention Everyone',
    'Use External Emojis',
    'View Guild Analytics',
    'Connect',
    'Speak',
    'Mute Members',
    'Deafen Members',
    'Move Members',
    'Use Voice Activity Detection',
    'Change Nickname',
    'Manage Nicknames',
    'Manage Roles',
    'Manage Webhooks',
    'Manage Emojis'
  ];

  export function bitfieldToArray(bitfield: number) {
    return permissions.filter((_, i) => {
      const current = 1 << i;
      return (bitfield & current) === current;
    });
  }
  export function capitalizeWords(s: string) {
    return s.replace(/(^| )./g, (e) => e.toUpperCase());
  }

  export function formatEnumKey(s: string) {
    return capitalizeWords(s.replace(/_/g, ' '));
  }
  export function formatEnum(s: string[]) {
    return s.map((e) => formatEnumKey(e));
  }
  export function arraysEqual(a: any[], b: any[]) {
    if (a instanceof Array && b instanceof Array) {
      if (a.length != b.length) return false;
      for (var i = 0; i < a.length; i++)
        if (!arraysEqual(a[i], b[i])) return false;
      return true;
    } else {
      return a == b;
    }
  }
  export namespace convert {
    export namespace dec {
      export function hex(s: number) {
        return s.toString(16);
      }
    }
  }
  export namespace Snowflake {
    export const Epoch = 1420070400000;
    export function pad(v: string, n: number, c = '0') {
      return String(v).length >= n
        ? String(v)
        : (String(c).repeat(n) + v).slice(-n);
    }
    export function decomposeSnowflake(snowflake: string) {
      const binary = pad(BigInt(snowflake).toString(2), 64);
      const res = {
        timestamp: parseInt(binary.substring(0, 42), 2) + Epoch,
        workerID: parseInt(binary.substring(42, 47), 2),
        processID: parseInt(binary.substring(47, 52), 2),
        increment: parseInt(binary.substring(52, 64), 2),
        binary
      };
      return res;
    }
  }
  export namespace timestamp {
    const timeMap = new Map([
      ['decade', 1000 * 60 * 60 * 24 * 365 * 10],
      ['year', 1000 * 60 * 60 * 24 * 365],
      ['month', 1000 * 60 * 60 * 24 * 31],
      ['week', 1000 * 60 * 60 * 24 * 7],
      ['day', 1000 * 60 * 60 * 24],
      ['hour', 1000 * 60 * 60],
      ['minute', 1000 * 60],
      ['second', 1000],
      ['millisecond', 1]
    ]);
    export function getLongAgo(
      ts: number,
      limiter: number,
      diffSinceNow: boolean = true,
      lowestUnit: string | undefined = undefined
    ) {
      if (diffSinceNow) ts = new Date(new Date().getTime() - ts).getTime();
      let runcheck = ts + 0;
      const txt = new Map();
      for (const [k, v] of timeMap) {
        if (runcheck < v || txt.entries.length >= limiter) {
          continue;
        }
        const runs = Math.ceil(runcheck / v) + 1;
        for (let i = 0; i <= runs; i += 1) {
          if (runcheck < v) {
            break;
          }
          if (txt.has(k)) {
            txt.set(k, txt.get(k) + 1);
          } else {
            txt.set(k, 1);
          }
          runcheck -= v;
        }
      }
      const txtret = [];
      let runsc = 0;
      let hitLowest = false;
      for (const [key, value] of txt) {
        if (runsc >= limiter || hitLowest === true) {
          break;
        }
        if (lowestUnit === key) hitLowest = true;
        let cc: string = value > 1 ? `${key}s` : key;
        cc = `${cc.substr(0, 1).toUpperCase()}${cc.substr(1).toLowerCase()}`;
        txtret.push(`${value} ${cc}`);
        runsc += 1;
      }
      return txtret.join(', ');
    }
    export function simpleGetLongAgo(ts: number) {
      return getLongAgo(ts, 2, undefined, undefined);
    }
    const shortTimeMap = new Map([
      ['dec', 1000 * 60 * 60 * 24 * 365 * 10],
      ['y', 1000 * 60 * 60 * 24 * 365],
      ['mo', 1000 * 60 * 60 * 24 * 31],
      ['w', 1000 * 60 * 60 * 24 * 7],
      ['d', 1000 * 60 * 60 * 24],
      ['h', 1000 * 60 * 60],
      ['m', 1000 * 60],
      ['s', 1000],
      ['ms', 1]
    ]);
    export function shortLongAgo(
      ts: number,
      limiter: number,
      diffSinceNow: boolean = true,
      lowestUnit: string | undefined = undefined
    ) {
      if (diffSinceNow) ts = new Date(new Date().getTime() - ts).getTime();
      let runcheck = ts + 0;
      const txt = new Map();
      for (const [k, v] of shortTimeMap) {
        if (runcheck < v || txt.entries.length >= limiter) {
          continue;
        }
        const runs = Math.ceil(runcheck / v) + 1;
        for (let i = 0; i <= runs; i += 1) {
          if (runcheck < v) {
            break;
          }
          if (txt.has(k)) {
            txt.set(k, txt.get(k) + 1);
          } else {
            txt.set(k, 1);
          }
          runcheck -= v;
        }
      }
      const txtret = [];
      let runsc = 0;
      let hitLowest = false;
      for (const [key, value] of txt) {
        if (runsc >= limiter || hitLowest === true) {
          break;
        }
        if (lowestUnit === key) hitLowest = true;
        let cc: string = value > 1 ? `${key}s` : key;
        txtret.push(`${value}${cc}`);
        runsc += 1;
      }
      return txtret.join('');
    }
    export function simpleShortGetLongAgo(ts: number) {
      return shortLongAgo(ts, 2, undefined, undefined);
    }
  }
  export async function getMessage(
    id: discord.Snowflake,
    channelId: discord.Snowflake
  ) {
    const c = await discord.getChannel(channelId);
    if (
      !(
        c instanceof discord.GuildNewsChannel ||
        c instanceof discord.GuildTextChannel
      )
    )
      return null;
    return await c.getMessage(id);
  }
  export async function logmsg(
    msg: string,
    eventName: string,
    timestamp: string | number | Date = new Date(),
    attachments?: discord.Message.IOutgoingMessageAttachment[]
  ) {
    const ch = (await utils.gc(config.modules.logging.channel))!;
    ch.sendMessage({
      content: `\`${
        config.modules.logging.showTimestamps ? gt(timestamp) : ''
      }\` ${
        config.modules.logging.showEventNames ? `(\`${eventName}\`)` : ''
      } ${msg}`,
      allowedMentions: {},
      attachments: attachments ?? []
    });
  }
  export function gt(s: string | number | Date = new Date()) {
    if (!(s instanceof Date)) s = new Date(s);
    return `[${new Date(s)
      .getHours()
      .toString()
      .padStart(2, '0')}:${new Date(s)
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${new Date(s)
      .getSeconds()
      .toString()
      .padStart(2, '0')}]`;
  }
  export function place(
    base: string,
    replacers: Map<string, any> | [string, any][]
  ) {
    for (const [key, value] of replacers) {
      base = base.split(key).join(value);
    }
    return base;
  }
  export function getChannelEmoji(c: discord.Channel) {
    const m = [
      CustomEmojis.CHANNEL_TEXT,
      CustomEmojis.CHANNEL_TEXT,
      CustomEmojis.CHANNEL_VOICE,
      CustomEmojis.CHANNEL_TEXT,
      CustomEmojis.CHANNEL_CATEGORY,
      CustomEmojis.CHANNEL_NEWS,
      CustomEmojis.CHANNEL_STORE
    ];
    return m[c.type];
  }
  const blacklist = ['\t', '\u200F', '\u008D', '\u202E', '\u202D', '\u0674'];
  const escapeGeneral = ['*', '_', '||', '`', '@everyone', '@here', '~~'];
  const escapeCodeblock = ['```'];
  const escapeQuote = ['`'];
  export function escapeString(
    string: string,
    inQuote: boolean = false,
    inBlock: boolean = false
  ) {
    // console.log('toUnicode', '\n', string, '\n=\n', toUnicode(string));
    blacklist.forEach((vl) => {
      string = string.split(vl.toLowerCase()).join('');
    });
    let escapeList: Array<string> = [];
    if (!inQuote && !inBlock) escapeList = escapeGeneral;
    else if (inQuote && !inBlock) escapeList = escapeQuote;
    else if (!inQuote && inBlock) escapeList = escapeCodeblock;

    escapeList.forEach((char) => {
      if (char === '@everyone' || char === '@here') {
        const escape = `${char.substr(0, 1)}\u200B${char.substr(1)}`;
        string = string.split(char).join(escape);
        return;
      }

      if (char === '`' || char === '```') string = string.split(char).join(`'`);
      else if (char === '```') string = string.split(char).join(`'''`);
      else {
        const escape = char
          .split('')
          .map((v) => `\\${v}`)
          .join('');
        string = string.split(char).join(escape);
      }
    });
    if (string.length === 0) string = '\u200c';
    return string;
  }

  export async function gc(id: discord.Snowflake) {
    const g = await discord.getGuild();
    return (await g.getChannel(id)) as discord.GuildTextChannel;
  }
}

export { config, messages, utils, CustomEmojis as emoji };
