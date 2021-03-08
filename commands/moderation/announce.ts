const NEWS_CHANNEL = ' ';
const TITLE = '**__ANNOUNCEMENT__**';
const GUILD_ICON =
  'https://cdn.discordapp.com/icons/558032771558408246/4a00504cd8e382e703d4d88ec209044a.png';
let f = discord.command.filters;
const NEWS_PERMS = f.and(
  f.canMuteMembers(),
  f.canManageMessages(),
  f.canManageRoles()
);

const NewsCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: NEWS_PERMS
  }
);
NewsCommand.on(
  {
    name: 'announce',
    aliases: ['ann', 'a']
  },
  (args) => ({
    content: args.text()
  }),
  async (message, { content }) => {
    const a = await discord.getGuildNewsChannel(NEWS_CHANNEL);
    message.reply('Your Announcement has been sent');
    message.delete();
    const embed = new discord.Embed();
    embed.setTitle(TITLE);
    embed.setDescription(`${content}`);
    embed.setThumbnail({
      url: GUILD_ICON
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    a?.sendMessage({ embed: embed });
  }
);
