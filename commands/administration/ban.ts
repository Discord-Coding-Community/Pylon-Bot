const LOGGING_CHANNEL = ' ';
const TITLE = '**__User Banned__**';
let f = discord.command.filters;
const BAN_PERMS = f.and(f.canBanMembers());

const BanCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: BAN_PERMS
  }
);

BanCommand.on(
  {
    name: 'ban',
    aliases: ['b']
  },
  (args) => ({
    user: args.user(),
    reason: args.textOptional()
  }),
  async (message, { user, reason }) => {
    const guild = await discord.getGuild();
    const channel = await discord.getGuildTextChannel(LOGGING_CHANNEL);

    await guild.createBan(user, {
      deleteMessageDays: 7,
      reason: reason || undefined
    });

    const logger = new discord.Embed();
    logger.setTitle(TITLE);
    logger.setColor(0x00ff00);
    logger.setFooter({
      text: guild.name
    });
    logger.setThumbnail({ url: user.getAvatarUrl() });
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
