import {
    NEWS_CHANNEL_1,
    NEWS_CHANNEL_2,
    NEWS_CHANNEL_3,
    NEWS_CHANNEL_4
} from '../config/configs';

discord.on('MESSAGE_CREATE', async (message) => {
    let CHANNEL_ID_1 = NEWS_CHANNEL_1;
    let CHANNEL_1 = await discord.getGuildNewsChannel(CHANNEL_ID_1);
    if (message.channelId == CHANNEL_ID_1) {
        await CHANNEL_1.publishMessage(message.id);
    }
});

discord.on('MESSAGE_CREATE', async (message) => {
    let CHANNEL_ID_2 = NEWS_CHANNEL_2;
    let CHANNEL_2 = await discord.getGuildNewsChannel(CHANNEL_ID_2);
    if (message.channelId == CHANNEL_ID_2) {
        await CHANNEL_2.publishMessage(message.id);
    }
});

discord.on('MESSAGE_CREATE', async (message) => {
    let CHANNEL_ID_3 = NEWS_CHANNEL_3;
    let CHANNEL_3 = await discord.getGuildNewsChannel(CHANNEL_ID_3);
    if (message.channelId == CHANNEL_ID_3) {
        await CHANNEL_3.publishMessage(message.id);
    }
});

discord.on('MESSAGE_CREATE', async (message) => {
    let CHANNEL_ID_4 = NEWS_CHANNEL_4;
    let CHANNEL_4 = await discord.getGuildNewsChannel(CHANNEL_ID_4);
    if (message.channelId == CHANNEL_ID_4) {
        await CHANNEL_4.publishMessage(message.id);
    }
});
