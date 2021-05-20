import { config } from '../../modules/config/cfg';

discord.on('MESSAGE_CREATE', async (message) => {
  let channelId = config.modules.automated.autopublisher.announcements;
  let channel = await discord.getGuildNewsChannel(channelId);
  if (message.channelId == channelId) {
    await channel.publishMessage(message.id);
  }
});

discord.on('MESSAGE_CREATE', async (message) => {
  let channelId = config.modules.automated.autopublisher.blacklist;
  let channel = await discord.getGuildNewsChannel(channelId);
  if (message.channelId == channelId) {
    await channel.publishMessage(message.id);
  }
});