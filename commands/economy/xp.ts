import {
    PXLAPI_TOKEN,
    JOIN_LEAVE_CHANNEL,
    COMMAND_PREFIX,
    USER_PERMS
} from '../../config/configs';

const rankCommands = new discord.command.CommandGroup({
    defaultPrefix: COMMAND_PREFIX,
    filters: USER_PERMS
});

const xpToLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100));
const levelToXp = (level: number) => level ** 2 * 100;
const randomBetween = (min: number, max: number) =>
    Math.round(Math.random() * (max - min) + min);

const xpKV = new pylon.KVNamespace('xp');
const cooldownKV = new pylon.KVNamespace('xpCooldowns');

const sendRankCard = async (
    message: discord.Message,
    user: discord.User,
    xp: number,
    levelUp: boolean = false
) => {
    const code = `
  const image = new Image(512, 170);
  let avatar = await fetch(avatarURL).then(r => r.arrayBuffer()).then(b => decode(b, true));
  if(avatar instanceof GIF)
    avatar = avatar[0];
  if (avatar.width !== 128)
    avatar.resize(128, 128);
  avatar.cropCircle();
  const font = await fetch('https://raw.githubusercontent.com/PylonApps/xp/master/BalooExtraBold.ttf').then(r => r.arrayBuffer()).then(b => new Uint8Array(b));
  tag = await Image.renderText(font, 26, tag, 0xfafbfcff);
  if(tag.width > image.width - 158)
    tag = tag.resize(image.width - 188, Image.RESIZE_AUTO);
  const averageColor = avatar.averageColor();
  const f = (a,b) => {
    if (seed % (a ^ b) > (a ^ b) * 0.96) return averageColor << 8 | 0xff;
    return 0xff;
  };
  image.fill(f);
  const xp_text = await Image.renderText(font, 20, \`\${xp}/\${next} XP\`, 0xd6e0ffff);
  const level_text = await Image.renderText(font, 60, \`LEVEL \${level}\`, 0xfafbfcff);
  image.composite(avatar, 20, 20);
  image.composite(tag, 180, image.height / 6 - tag.height / 2);
  image.composite(level_text, 180, image.height / 2 - level_text.height / 2);
  image.composite(xp_text, image.width - 5 - xp_text.width, image.height - 35);
  image.drawBox(0, image.height - 4, Math.floor(xp / next * image.width), 4, 0xfbae40ff);
  image.drawBox(Math.floor((xp - prev) / (next - prev) * image.width), image.height - 4, image.width - Math.floor((xp - prev) / (next - prev) * image.width), 4, 0x6d6e71ff);
  
  return image.encode();
  `;

    return message.reply(async () => {
        const request = await fetch('https://api.pxlapi.dev/imagescript/1.2.5', {
            body: JSON.stringify({
                code,
                inject: {
                    avatarURL: user.getAvatarUrl(discord.ImageType.PNG),
                    tag: user.getTag(),
                    xp,
                    level: xpToLevel(xp),
                    next: levelToXp(xpToLevel(xp) + 1),
                    prev: levelToXp(xpToLevel(xp) - 1),
                    seed: (parseInt(user.id) % 1000) + 5
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Application ${PXLAPI_TOKEN}`
            },
            method: 'POST'
        });

        if (!request.ok)
            return message.reply(
                `:x: Something went wrong generating the rank card:\n${await request.text()}`
            );

        return {
            content: levelUp
                ? `**${message.author?.getTag()}** just leveled up!`
                : '',
            attachments: [{ name: 'rank.png', data: await request.arrayBuffer() }]
        } as discord.Message.IOutgoingMessageOptions;
    });
};

discord.on(discord.Event.MESSAGE_CREATE, async (message: discord.Message) => {
    if (!message.author || message.author.bot) return;
    if (await cooldownKV.get<boolean>(message.author.id)) return;
    await cooldownKV.put(message.author.id, true, {
        ttl: randomBetween(45000, 75000) // cooldown for gaining new xp: between 45 and 75 seconds
    });

    const oldXP = (await xpKV.get<number>(message.author.id)) || 0;
    const oldLevel = xpToLevel(oldXP);

    const newXP = oldXP + randomBetween(25, 35); // xp to add: between 25 and 35
    const newLevel = xpToLevel(newXP);

    await xpKV.put(message.author.id, newXP, { ttl: 1000 * 60 * 60 * 24 * 30 }); // xp will reset after 30 days of inactivity

    if (newLevel > 0 && newLevel > oldLevel)
        await sendRankCard(message, message.author, newXP, true);
});

rankCommands.on(
    { name: 'rank', aliases: ['level'], description: 'Rank card' },
    (args) => ({ user: args.userOptional() }),
    async (message, { user }) => {
        const target = user ?? message.author;

        const xp = (await xpKV.get<number>(target.id)) || 0;
        await sendRankCard(message, target, xp, false);
    }
);

rankCommands.on(
    {
        name: 'top',
        description: 'XP leaderboard'
    },
    () => ({}),
    async (message: discord.Message) => {
        return message.reply(async () => {
            const items = await xpKV.items();

            let top = await Promise.all(
                items
                    .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))
                    .slice(0, 10)
                    .map((entry) =>
                        discord.getUser(entry.key).then((user) => ({
                            value: entry.value,
                            tag: user?.getTag() || 'unknown#0000',
                            level: xpToLevel(entry.value as number),
                            next: levelToXp(xpToLevel(entry.value as number) + 1),
                            prev: levelToXp(xpToLevel(entry.value as number) - 1),
                            avatar:
                                user?.getAvatarUrl() ||
                                'https://cdn.discordapp.com/embed/avatars/1.png'
                        }))
                    )
            );

            const code = `
      top = JSON.parse(top);
      const image = new Image(700, 888);
      const avatars = await Promise.all(top.map(user => fetch(user.avatar).then(r => r.arrayBuffer()).then(async b => {
          let image = await decode(b, true);
          if(image instanceof GIF)
            image = image[0];
          return image;
      })));
      const g = (x, y) => Math.sin(x ^ y) / Math.cos(y ^ x) / seed;
      image.fill((x, y) => Image.rgbToColor(g(x, x), g(y, y), g(x, y)));
      avatars.forEach((avatar, index) => {
        if (avatar.width !== 64) avatar.resize(64, 64);
        avatar.cropCircle();
        image.composite(avatar, 20, 15 + (87 * index));
      });
      const font = await fetch('https://raw.githubusercontent.com/PylonApps/xp/master/BalooExtraBold.ttf').then(r => r.arrayBuffer()).then(r => new Uint8Array(r));
      for(let index = 0; index < top.length; index++) {
        const user = top[index];
        const tag = await Image.renderText(font, 32, user.tag, 0xfafbfcff);
        const level = await Image.renderText(font, 32, \`LVL \${user.level}\`, 0xfafbfcff);
        const xp = await Image.renderText(font, 21, \`\${user.value.toLocaleString()} XP\`, 0xd6e0ffff);
        if (tag.width > image.width - 35 - 40 - 64 - level.width) tag.resize(image.width - 35 - 40 - 64 - level.width, Image.RESIZE_AUTO);
        image.composite(tag, 20 + 64 + 15, 20 + (87 * index));
        image.composite(xp, image.width - 20 - xp.width, 58 + (87 * index));
        image.composite(level, image.width - 20 - level.width, 12 + (87 * index));
        image.drawBox(image.width - 20 - level.width, 55 + (87 * index),  Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 5, 0xF38020ff);
        image.drawBox(image.width - 20 - level.width + Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 55 + (87 * index), level.width - Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 5, 0x6d6e71ff);
      };
      
      return image.encode();
      `;

            const request = await fetch('https://api.pxlapi.dev/imagescript/1.2.5', {
                body: JSON.stringify({
                    code,
                    inject: {
                        seed: randomBetween(10, 50),
                        top: JSON.stringify(top)
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Application ${PXLAPI_TOKEN}`
                },
                method: 'POST'
            });

            if (!request.ok)
                return `:x: Something went wrong generating the rank card:\n${await request.text()}`;

            return {
                attachments: [{ name: 'top.png', data: await request.arrayBuffer() }]
            };
        });
    }
);
