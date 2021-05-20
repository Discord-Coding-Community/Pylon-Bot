import { config } from '../../modules/config/cfg';

enum Type {
  JOIN,
  LEAVE
}

const joinLeaveImage = async (
  type: Type,
  member: discord.GuildMember | discord.Event.IGuildMemberRemove
) => {
  const channel = await discord.getGuildTextChannel(
    config.modules.automated.onJoin.channel
  );
  if (!channel) throw new Error('Invalid channel');

  const code = `
      let avatar = await fetch(avatarURL).then(r => r.arrayBuffer()).then(r => decode(r, true));
      if(avatar instanceof GIF)
        avatar = avatar[0];
      const font = await fetch('https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf').then(r => r.arrayBuffer()).then(r => new Uint8Array(r));
      const avgAvatarColor = avatar.averageColor();
      const image = new Image(1024, 256);
      image.fill(avgAvatarColor);
      image.lightness(0.75);
      let border = new Image(image.width, image.height);
      border.fill((x, y) => {
        const alpha = Math.max(
          (Math.max(x, border.width - x) / border.width) ** 10,
          (Math.max(y, border.height - y) / border.height) ** 5,
        );
        return avgAvatarColor & 0xffffff00 | alpha * 0xff;
      });
      border.lightness(0.25);
      image.composite(border, 0, 0);
      avatar.resize(image.height * 0.75, Image.RESIZE_AUTO);
      avatar.cropCircle();
      image.composite(avatar, image.width * 0.05, image.height / 8);
      const message = \`\${tag} just \${join ? 'joined' : 'left'}!\`;
      const text = await Image.renderText(font, 1280 / message.length, message, avgAvatarColor > 0xaaaaaaff ? 0x000000ff : 0xffffffff);
      image.composite(text, image.width * 0.1 + image.height * 0.75, image.height / 2 - text.height / 2);
      if(!join) image.saturation(0.25);
      return image.encode();
    `;

  const request = await fetch('https://api.pxlapi.dev/imagescript/1.2.5', {
    body: JSON.stringify({
      code,
      inject: {
        tag: member.user.getTag(),
        avatarURL: member.user.getAvatarUrl(),
        join: type === Type.JOIN
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Application ${config.api.PXLAPI_TOKEN}`
    },
    method: 'POST'
  });

  if (!request.ok) throw new Error(await request.text());

  channel.sendMessage({
    attachments: [
      {
        name: type === Type.JOIN ? 'join.png' : 'leave.png',
        data: await request.arrayBuffer()
      }
    ]
  });
};

discord.on(discord.Event.GUILD_MEMBER_ADD, async (member) => {
  await joinLeaveImage(Type.JOIN, member);
});

discord.on(discord.Event.GUILD_MEMBER_REMOVE, async (member) => {
  await joinLeaveImage(Type.LEAVE, member);
});
