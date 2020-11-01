const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix,
  filters: discord.command.filters.canBanMembers()
});

cmd.on(
  'ban',
  (args) => ({
    user: args.user(),
    reason: args.textOptional()
  }),
  async (message, { user, reason }) => {
    const guild = await message.getGuild();

    await guild.createBan(user, {
      deleteMessageDays: 7,
      reason: reason || undefined
    });

    const richEmbed = new discord.Embed();
    richEmbed.setTitle('User Banned');
    richEmbed.setColor(0x00ff00);
    richEmbed.setFooter({
      text: 'https://pylon.bot'
    });
    richEmbed.setThumbnail({ url: user.getAvatarUrl() });
    richEmbed.addField({
      name: 'User Name',
      value: `${user.username}`,
      inline: false
    });
    richEmbed.addField({
      name: 'User ID',
      value: `${user.id}`,
      inline: false
    });
    richEmbed.addField({
      name: 'Reason',
      value: `${reason}`,
      inline: false
    });
    richEmbed.setTimestamp(new Date().toISOString());
    await message.reply(richEmbed);
    await message.addReaction('✅');
  }
);