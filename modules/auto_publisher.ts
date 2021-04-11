import {
  NEWS_CHANNEL_1,
  NEWS_CHANNEL_2,
  NEWS_CHANNEL_3,
  NEWS_CHANNEL_4
} from '../config/configs';

discord.on('MESSAGE_CREATE', async (message) => {
  let channel_id = NEWS_CHANNEL_1;
  let news_channel = await discord.getGuildNewsChannel(channel_id);
  if (message.channelId == channel_id) {
    await news_channel.publishMessage(message.id);
  }
});

discord.on('MESSAGE_CREATE', async (message) => {
  let channel_id = NEWS_CHANNEL_2;
  let news_channel = await discord.getGuildNewsChannel(channel_id);
  if (message.channelId == channel_id) {
    await news_channel.publishMessage(message.id);
  }
});

discord.on('MESSAGE_CREATE', async (message) => {
  let channel_id = NEWS_CHANNEL_3;
  let news_channel = await discord.getGuildNewsChannel(channel_id);
  if (message.channelId == channel_id) {
    await news_channel.publishMessage(message.id);
  }
});

discord.on('MESSAGE_CREATE', async (message) => {
  let channel_id = NEWS_CHANNEL_4;
  let news_channel = await discord.getGuildNewsChannel(channel_id);
  if (message.channelId == channel_id) {
    await news_channel.publishMessage(message.id);
  }
});
