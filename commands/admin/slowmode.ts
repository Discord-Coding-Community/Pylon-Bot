import { COMMAND_PREFIX, ADMIN_PERMS } from '../../config/configs';

const cmds: discord.command.CommandGroup = new discord.command.CommandGroup({
  defaultPrefix: COMMAND_PREFIX,
  filters: ADMIN_PERMS
});

import { CustomTimeStringToMS } from '../../modules/functions';

cmds.on(
  {
    name: 'slowmode',
    aliases: ['slow', 'smode', 'slow-mode'],
    description:
      'Apply slowmode to a channel\n\n**Format**: [prefix]slowmode [time: string] [channel: guildTextChannelOptional]\n**Examples**: ~slowmode 1m #bot-commands'
  },
  (args) => ({ time: args.string(), channel: args.guildTextChannelOptional() }),
  async (msg, { time, channel }) => {
    if (
      !(await discord.command.filters
        .canManageChannels(channel?.id ?? msg.channelId)
        .filter(msg))
    ) {
      await msg?.reply(`You don't have the permission for this command`);
      return;
    }

    const timeInMS: number = (CustomTimeStringToMS(time) ?? 0) / 1000;
    const settedTime: number = timeInMS > 21600 ? 21600 : timeInMS;

    const theChannel =
      channel === null
        ? ((await msg.getChannel()) as discord.GuildTextChannel)
        : channel;

    await theChannel.edit({ rateLimitPerUser: settedTime });

    await msg?.reply(
      `You set the slowmode for the channel <#${theChannel.id}> to ${(
        settedTime / 60
      ).toFixed(2)} minutes!`
    );
  }
);
