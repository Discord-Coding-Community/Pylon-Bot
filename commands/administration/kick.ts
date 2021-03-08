const LOGGING_CHANNEL = ' ';
const TITLE = '**__User Kicked__**';
let f = discord.command.filters;
const KICK_PERMS = f.and(f.canKickMembers());

const KickCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: KICK_PERMS
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
    const channel = await discord.getGuildTextChannel(LOGGING_CHANNEL);

    const logger = new discord.Embed();
    logger.setTitle(TITLE);
    logger.setColor(0x00ff00);
    logger.setFooter({
      text: guild.name
    });
    logger.setThumbnail({ url: member.user.getAvatarUrl() });
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
