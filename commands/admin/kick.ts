import { COMMAND_PREFIX, ADMIN_PERMS, LOG_CHANNEL } from '../../config/configs';

const KickCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: COMMAND_PREFIX,
    filters: ADMIN_PERMS
  }
);

KickCommand.on(
  {
    name: 'kick',
    aliases: ['k']
  },
  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member }) => {
    const guild = await discord.getGuild();
    const channel = await discord.getGuildTextChannel(LOG_CHANNEL);

    const logger = new discord.Embed();
    logger.setTitle('**__USER KICKED__**');
    logger.setColor(0x00ff00),
      logger.setFooter({
        text: guild.name,
        iconUrl: `${guild.getIconUrl(discord.ImageType.PNG)}`
      });
    logger.setThumbnail({
      url: member.user.getAvatarUrl(discord.ImageType.PNG)
    });
    logger.addField({
      name: 'User Name',
      value: `${member.user.username}`,
      inline: false
    });
    logger.addField({
      name: 'User ID',
      value: `${member.user.id}`,
      inline: false
    });
    logger.setTimestamp(new Date().toISOString());
    if (guild) {
      await member.kick;
      if (guild && channel) {
        await message.addReaction('✅');
        channel?.sendMessage({
          content: '',
          embed: logger
        });
      }
    }
  }
);
