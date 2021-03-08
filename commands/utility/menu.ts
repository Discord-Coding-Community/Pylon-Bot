let f = discord.command.filters;
const MENU_PERMS = f.and(f.canSendMessages());

var MSGID = '';
var AUTHORID = '';
var guildId = 'GUILD ID';

const MenuCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: MENU_PERMS
  }
);

MenuCommand.raw(
  {
    name: 'menu',
    aliases: ['help', 'h', 'Menu', 'Help', 'H'],
    description: 'Displays the Pylon Menu'
  },
  async (msg) => {
    const menu = new discord.Embed();
    await menu.setColor(0x3f888f);
    await menu.setTitle('Pylon Menu');
    await menu.setDescription(
      `Select an option.
1️⃣: Administration Commands
2️⃣: Moderatrion Commands
3️⃣: Social Commands
4️⃣: Utility Commands
5️⃣: Slash Commands
`
    );

    const thehelpmsg = await msg.reply(menu);

    await thehelpmsg.addReaction('1️⃣');
    await thehelpmsg.addReaction('2️⃣');
    await thehelpmsg.addReaction('3️⃣');
    await thehelpmsg.addReaction('4️⃣');
    await thehelpmsg.addReaction('5️⃣');
    await thehelpmsg.addReaction('❌');

    MSGID = thehelpmsg.id;
    AUTHORID = msg.author.id;
  }
);

discord.registerEventHandler('MESSAGE_REACTION_ADD', async (theReaction) => {
  const guild = await discord.getGuild(guildId);
  const theMsgChannel = await discord.getGuildTextChannel(
    theReaction.channelId
  );
  const theMsg = await theMsgChannel.getMessage(theReaction.messageId);

  if (
    theReaction.emoji.name == '1️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option1 = new discord.Embed();
    await option1.setColor(0x3f888f);
    await option1.setTitle('Administration Commands');
    await option1.setDescription(
      "`kick <@user>`: Kicks a user from the guild.\n`ban <@user>`: Bans a user from the guild.\n`banlist:` Displays the guild's ban list.\n`warn <@user> <reason>:` Warn a user for a specified reason.\n`get-warns <@user>:` Get warn info about a user.\n`delete-warn <@user>:` Delete all the cases from a user.\n\nFields marked with the `<>` flags are required.\nFileds marked with the `[]` flags are optional.\nDo not include the `<>` and/or `[]` flags in the command."
    );
    const theMsg2 = await theMsg.reply(option1);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '2️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option1 = new discord.Embed();
    await option1.setColor(0x3f888f);
    await option1.setTitle('Moderation Commands');
    await option1.setDescription(
      '`announce <message>`: Send a message to the guild announcements channel.\n`mute <@user> <time>`: Mute a user for a specified amount of time.\n`unmute <@user>`: Unmute a user.\n\nFields marked with the `<>` flags are required.\nFileds marked with the `[]` flags are optional.\nDo not include the `<>` and/or `[]` flags in the command.'
    );
    const theMsg2 = await theMsg.reply(option1);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }
  if (
    theReaction.emoji.name == '3️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option2 = new discord.Embed();
    await option2.setColor(0x3f888f);
    await option2.setTitle('Social Commands');
    await option2.setDescription(
      '`reddit <subreddit>`:\n`twitter sub <channel.mention> <twitter.handle>`: Add a Twitter Feed to a specified channel. *[Requires Administrator Rank]*\n`twitter unsub <channel.mention> <twitter.handle>`: Remove a Twitter feed from a specified channel. *[Requiures Administrator Rank]*\n`twitter list`: Display a list of all currently subscribes Twitter feeds.\n\nFields marked with the `<>` flags are required.\nFileds marked with the `[]` flags are optional.\nDo not include the `<>` and/or `[]` flags in the command.\n\n**Note**:\nTwitter commands require admin rank to use.'
    );
    const theMsg3 = await theMsg.reply(option2);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }
  if (
    theReaction.emoji.name == '4️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option2 = new discord.Embed();
    await option2.setColor(0x3f888f);
    await option2.setTitle('Twitter Commands');
    await option2.setDescription(
      "`menu`: Displays the Pylon Help Menu.\n`search <input>`: Search for something using the worlfram api.\n`ping`: Displays Pylon's latency.\n`info [user.mention]`: Displays a user's info.\n\nFields marked with the `<>` flags are required.\nFileds marked with the `[]` flags are optional.\nDo not include the `<>` and/or `[]` flags in the command.'"
    );
    const theMsg3 = await theMsg.reply(option2);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }
  if (
    theReaction.emoji.name == '5️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option2 = new discord.Embed();
    await option2.setColor(0x3f888f);
    await option2.setTitle('Slash Commands');
    await option2.setDescription(
      "`avatar [@user]:` Get a user\'s avatar.\n`search <query>`: Perform a search using the Wolframn API.\n\nFeilds marked with the `<>` flags are required.\nFields marked with the `[]` flags are optional.\nDo not include the `<>` and/or `[]` flags in the command.'"
    );
    const theMsg3 = await theMsg.reply(option2);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '❌' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option8 = new discord.Embed();
    await option8.setColor(0x3f888f);
    await option8.setTitle('**Canceled**');
    await option8.setDescription(`You canceled the command selection`);

    const theMsg4 = await theMsg.reply(option8);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
    setTimeout(() => theMsg4.delete(), 5000);
  }
});
