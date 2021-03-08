let f = discord.command.filters;

const PFP_PERMS = f.and(f.canSendMessages());

let reactions = {
  prev: discord.decor.Emojis.ARROW_DOWN as string,
  next: discord.decor.Emojis.ARROW_UP as string
};

const PFP_COMMAND = new discord.command.CommandGroup({
  defaultPrefix: '~',
  filters: PFP_PERMS
});

PFP_COMMAND.on(
  {
    name: 'avatar',
    aliases: ['ava', 'pfp']
  } as AltCommandOptions,
  (ctx) => ({ p: ctx.userOptional() }),
  async (message, { p }) => {
    let em = new discord.Embed();
    if (!p) p = message.author;
    let av = p?.getAvatarUrl();
    em.setTitle(`${p?.username}'s avatar`)
      .setDescription(p?.toMention())
      .setImage({ url: av });
    const msg = await message.reply(em);
    await handler.createReactionHandler({
      message: msg,
      emojis: Object.values(reactions),
      selfReact: true,
      onMatch: async (_msgHandler, react) => {
        const gm = await msg.getChannel().then((c) => c.getMessage(msg.id));
        if (!gm) return;
        const e = gm.embeds[0];
        const img = (e.image?.url ?? '').split('?size=')[0] + '?size=';
        let size = e?.image?.width ?? 256;
        size = Math.floor(size / 32);

        if (react.emoji.name == reactions.next)
          if (size * 2 > 18)
            return setTimeout(() => message.reply('Too high!'), 5000);
          else {
            console.log(e.setImage({ url: `${img}${size * 64}` }));
            msg.deleteReaction(react.emoji.name, react.userId);
          }
        else if (react.emoji.name == reactions.prev)
          if (size / 2 < 1)
            return setTimeout(() => message.reply('Too low!'), 5000);
          else {
            console.log(e.setImage({ url: `${img}${(size / 2) * 32}` }));
            msg.deleteReaction(react.emoji.name, react.userId);
          }
        let embed: discord.Embed = JSON.parse(JSON.stringify(e));
        await msg.edit({ embed: embed });
      }
    });
  }
);