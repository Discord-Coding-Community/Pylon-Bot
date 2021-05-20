import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.commands.raw(
  {
    name: 'ping',
    aliases: ['echo', 'beep'],
    description: "Responds with the bot's ping.",
    filters: permissions.user
  },
  async (msg) => {
    const embed = new discord.Embed();
    const start = Date.now();
    const latency = new Date(msg.timestamp).getTime() - start;
    embed.setTitle(`**__PING__**`);
    embed.setDescription(`The ping is ${latency}ms`);
    embed.setThumbnail({
      url: config.images.loadingImage
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    await msg.reply({ embed: embed });
  }
);
