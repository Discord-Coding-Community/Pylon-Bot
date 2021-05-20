import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.commands.on(
  {
    name: 'ban',
    aliases: ['b', 'user-ban', 'banuser', 'banmember', 'ban-member'],
    description: 'Ban a specified user from the guild for a specified reason.',
    filters: permissions.admin
  },
  (args) => ({
    user: args.user(),
    reason: args.textOptional()
  }),
  async (message, { user, reason }) => {
    const guild = await discord.getGuild();
    const channel = await discord.getGuildTextChannel(
      config.modules.logging.channel
    );

    await guild.createBan(user, {
      deleteMessageDays: 7,
      reason: reason || undefined
    });

    const logger = new discord.Embed();
    logger.setTitle('**__User Banned__**');
    logger.setColor(0x00ff00);
    logger.setFooter({
      text: guild.name,
      iconUrl: `${guild.getIconUrl(discord.ImageType.PNG)}`
    });
    logger.setThumbnail({ url: user.getAvatarUrl(discord.ImageType.PNG) });
    logger.addField({
      name: 'User Name',
      value: `${user.username}`,
      inline: false
    });
    logger.addField({
      name: 'User ID',
      value: `${user.id}`,
      inline: false
    });
    logger.addField({
      name: 'Reason',
      value: `${reason}`,
      inline: false
    });
    logger.setTimestamp(new Date().toISOString());

    if (guild && channel) {
      await message.addReaction('✅');
      channel?.sendMessage({
        content: '',
        embed: logger
      });
    }
  }
);

