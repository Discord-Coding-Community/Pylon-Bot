import { COMMAND_PREFIX, USER_PERMS, PYLON_ICON } from '../../config/configs';

const AvatarCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
    {
        defaultPrefix: COMMAND_PREFIX,
        filters: USER_PERMS
    }
);

AvatarCommand.on(
    {
        name: 'avatar',
        aliases: ['av', 'ava', 'a', 'pfp'],
        description: "Display's a user's avatar"
    } as AltCommandOptions,
    (ctx) => ({ p: ctx.userOptional() }),
    async (message, { p }) => {
        let embed = new discord.Embed();
        if (!p) p = message.author;
        let IMAGE = p?.getAvatarUrl();
        embed
            .setTitle(`${p?.username}'s avatar`)
            .setImage({ url: IMAGE })
            .setFooter({ text: 'Pylon.bot', iconUrl: PYLON_ICON })
            .setTimestamp(new Date().toISOString());
        const msg = await message.reply(embed);
    }
);