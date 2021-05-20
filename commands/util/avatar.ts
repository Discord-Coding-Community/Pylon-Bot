import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.commands.on(
  {
    name: 'avatar',
    aliases: ['ava', 'pfp'],
    description: "Display's a user's avatar",
    filters: permissions.user
  } as AltCommandOptions,
  (ctx) => ({ p: ctx.userOptional() }),
  async (message, { p }) => {
    let embed = new discord.Embed();
    if (!p) p = message.author;
    let IMAGE = p?.getAvatarUrl();
    embed
      .setTitle(`${p?.username}'s avatar`)
      .setImage({ url: IMAGE })
      .setFooter({ text: 'Pylon.bot', iconUrl: config.images.pylonIcon })
      .setTimestamp(new Date().toISOString());
    const msg = await message.reply(embed);
  }
);
