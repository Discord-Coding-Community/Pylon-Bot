import {
  COMMAND_PREFIX,
  MOD_PERMS,
  ANNOUNCEMENT_CHANNEL
} from '../../config/configs';

const NewsCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: COMMAND_PREFIX,
    filters: MOD_PERMS
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
    const guild = await discord.getGuild();
    const a = await discord.getGuildNewsChannel(ANNOUNCEMENT_CHANNEL);
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
