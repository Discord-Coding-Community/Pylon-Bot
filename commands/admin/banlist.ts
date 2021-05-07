import { COMMAND_PREFIX, ADMIN_PERMS } from '../../config/configs';

const BanListCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: COMMAND_PREFIX,
    filters: ADMIN_PERMS
  }
);
BanListCommand.raw(
  {
    name: 'banlist',
    aliases: ['bl', 'blist', 'bans', 'banned', 'banned-members', 'userbans'],
    description: 'Responds with a list of banned users.'
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
    const logger = new discord.Embed();
    logger.setTitle('**__BANNED USERS__**');
    logger.setColor(0xff0000);
    logger.setDescription(text);
    logger.setThumbnail({
      url: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    logger.setFooter({
      text: guild.name,
      iconUrl: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    logger.setTimestamp(new Date().toISOString());
    if (guild) {
      message.addReaction('✅');
      await message.reply({
        content: '',
        embed: logger
      });
    }
  }
);
