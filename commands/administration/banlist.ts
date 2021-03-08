const TITLE = '**__BANLIST__**';
let f = discord.command.filters;
const BANLIST_PERMS = f.and(f.canBanMembers());

const BanListCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: BANLIST_PERMS
  }
);
BanListCommand.raw(
  {
    name: 'banlist',
    aliases: ['bl', 'blist', 'bans', 'banned']
  },
  async (message) => {
    await message.delete();
    const guild = await message.getGuild();
    const banlist = await guild.getBans();
    var i;
    var text = '';
    for (i = 0; i < banlist.length; i++) {
      text +=
        `${banlist[i].user.toMention()} (ID: ${
          banlist[i].user.id
        })\n**BAN REASON**\n${banlist[i].reason}` + `\n\n`;
    }
    await message.reply(
      new discord.Embed({
        author: {
          name: message.author.getTag(),
          iconUrl: message.author.getAvatarUrl()
        },
        title: TITLE,
        color: 0xff0000,
        description: `${text}`,
        thumbnail: { url: guild.getIconUrl() },
        footer: { text: `ID: ${message.author.id}` },
        timestamp: new Date().toISOString()
      })
    );
  }
);
