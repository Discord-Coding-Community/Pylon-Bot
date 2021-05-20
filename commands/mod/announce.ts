import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.commands.on(
  {
    name: 'announce',
    aliases: ['ann', 'a'],
    description: 'Send an announcement to the guild announcements channel',
    filters: permissions.mod
  },
  (args) => ({
    content: args.text()
  }),
  async (message, { content }) => {
    const guild = await discord.getGuild();
    const a = await discord.getGuildNewsChannel(
      config.modules.mod.commands.announce.channel
    );
    message.reply('Your Announcement has been sent');
    message.delete();
    const embed = new discord.Embed();
    embed.setTitle('**__ANNOUNCEMENT__**');
    embed.setDescription(`${content}`);
    embed.setThumbnail({
      url: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    embed.setFooter({
      text: guild.name,
      iconUrl: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    a?.sendMessage({ embed: embed });
  }
);
