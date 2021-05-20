import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.commands.raw(
  {
    name: 'banlist',
    aliases: ['bl', 'blist', 'bans', 'banned', 'banned-members', 'userbans'],
    description: 'Responds with a list of banned users.',
    filters: permissions.admin
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
    const embed = new discord.Embed();
    embed.setTitle('**__BANNED USERS__**');
    embed.setColor(0xff0000);
    embed.setDescription(text);
    embed.setThumbnail({
      url: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    embed.setFooter({
      text: guild.name,
      iconUrl: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    embed.setTimestamp(new Date().toISOString());
    if (guild) {
      message.addReaction('✅');
      await message.reply({
        content: '',
        embed: embed
      });
    }
  }
);
