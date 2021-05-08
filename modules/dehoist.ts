import {
  AUTO_DEHOIST_CHARACTER_1,
  AUTO_DEHOIST_CHARACTER_2,
  AUTO_DEHOIST_CHARACTER_3,
  AUTO_DEHOIST_CHARACTER_4,
  AUTO_DEHOIST_CHARACTER_5,
  AUTO_DEHOIST_CHARACTER_6,
  AUTO_DEHOIST_CHARACTER_7,
  AUTO_DEHOIST_CHARACTER_8,
  AUTO_DEHOIST_CHARACTER_9
} from '../config/configs';

const hoistCharacters = [
  AUTO_DEHOIST_CHARACTER_1,
  AUTO_DEHOIST_CHARACTER_2,
  AUTO_DEHOIST_CHARACTER_3,
  AUTO_DEHOIST_CHARACTER_4,
  AUTO_DEHOIST_CHARACTER_5,
  AUTO_DEHOIST_CHARACTER_6,
  AUTO_DEHOIST_CHARACTER_7,
  AUTO_DEHOIST_CHARACTER_8,
  AUTO_DEHOIST_CHARACTER_9
];

discord.on('USER_UPDATE', async (user: discord.User) => {
  if (hoistCharacters.some((ch) => user.username.startsWith(ch))) {
    const guild = await discord.getGuild();
    const member = await guild?.getMember(user.id);

    const newnick: string = user?.username?.match(/w+/)?.[0] ?? 'user';
    member?.edit({ nick: newnick });
  }
});

discord.on('GUILD_MEMBER_UPDATE', async (member: discord.GuildMember) => {
  if (hoistCharacters.some((ch) => member?.nick?.startsWith(ch))) {
    const newnick: string = member?.nick?.match(/\w+/)?.[0] ?? 'user';
    member?.edit({ nick: newnick });
  }
});
discord.on('GUILD_MEMBER_ADD', async (member: discord.GuildMember) => {
  if (hoistCharacters.some((ch) => member?.user.username?.startsWith(ch))) {
    const newnick: string = member?.user.username?.match(/\w+/)?.[0] ?? 'user';
    member?.edit({ nick: newnick });
  }
});
