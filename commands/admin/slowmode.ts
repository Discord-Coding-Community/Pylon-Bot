import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';
import { CustomTimeStringToMS } from '../../modules/functions';

config.commands.on(
  {
    name: 'slowmode',
    aliases: ['slow', 'smode', 'slow-mode', 'sm'],
    description:
      'Apply slowmode to a channel\n\n**Format**: [prefix]slowmode [time: string] [channel: guildTextChannelOptional]\n**Examples**: ~slowmode 1m #bot-commands',
    filters: permissions.admin
  },
  (args) => ({ time: args.string(), channel: args.guildTextChannelOptional() }),
  async (msg, { time, channel }) => {
    if (
      !(await discord.command.filters
        .canManageChannels(channel ? channel.id : msg.channelId)
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
      ).toFixed(2)} minute(s)!`
    );
  }
);
