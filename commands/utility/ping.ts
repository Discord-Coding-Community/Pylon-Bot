let f = discord.command.filters;
const PING_PERMS = f.and(f.canSendMessages());

const PingCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: PING_PERMS
  }
);

PingCommand.raw(
  {
    name: 'ping',
    aliases: ['echo', 'beep'],
    description: "Responds with the bot's ping."
  },
  async (msg) => {
    const embed = new discord.Embed();
    const start = Date.now();
    const latency = new Date(msg.timestamp).getTime() - start;
    embed.setTitle(`**__PING__**`);
    embed.setDescription(`The ping is ${latency}ms`);
    embed.setThumbnail({
      url: 'https://emoji.gg/assets/emoji/8299_Loading.gif'
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    await msg.reply({ embed: embed });
  }
);