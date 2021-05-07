import {
  LOG_CHANNEL,
  MOD_ROLE,
  MUTE_ROLE,
  USER_PERMS,
  COMMAND_PREFIX
} from '../../config/configs';
const WarnCommands: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: COMMAND_PREFIX
  }
);

import * as betterKV from '../../modules/db/betterKV';

interface structure {
  index: string;
  reason: string[];
  author: string[];
  timestamp: number[];
}

WarnCommands.on(
  {
    name: 'warn',
    description:
      'Warn a user for a specified reason.\n\n**Format**: [prefix]warn [user] [reason]\n**Examples**: ~warn @user#1234 spam'
  },
  (_arguments) => ({
    member: _arguments.guildMember(),
    reason: _arguments.text()
  }),
  async (message, { member, reason }) => {
    console.log('exect');
    if (!message.member.roles.some((r) => MOD_ROLE.includes(r))) {
      await message.reply('You are not permitted to use this command.');
      return;
    }

    if (member.roles.some((r) => MOD_ROLE.includes(r))) {
      await message.reply("You can't warn a teammember.");
      return;
    }

    if (member.user.bot) {
      await message.reply("You can't warn a bot.");
      return;
    }

    try {
      await member.removeRole(USER_PERMS);
      await member.addRole(MUTE_ROLE);
    } catch (_) {}

    await message.reply(
      `User ${member.toMention()} was warned by ${message.member.toMention()} with the reason: "${reason}".`
    );

    discord
      .getGuildTextChannel(LOG_CHANNEL)
      .then((channel) =>
        channel?.sendMessage(
          `User ${member.toMention()} was warned by ${message.member.toMention()} with the reason: "${reason}".`
        )
      );

    const oldData = await betterKV.GetData(
      `warncase-${member.user.id}`,
      'warncases'
    );
    if (oldData === undefined)
      await betterKV.SaveData(
        {
          index: `warncase-${member.user.id}`,
          reason: [reason],
          author: [message.member.user.id],
          timestamp: [Date.now()]
        },
        'warncases'
      );
    else
      await betterKV.UpdateDataValues(
        `warncase-${member.user.id}`,

        (data: structure) => {
          data.reason.push(reason);
          data.author.push(message.member.user.id);
          data.timestamp.push(Date.now());
          return data;
        },
        'warncases'
      );
  }
);

WarnCommands.on(
  {
    name: 'get-warns',
    description: 'get warn info about a user'
  },
  (_arguments) => ({
    user: _arguments.guildMember()
  }),
  async (message, { user }) => {
    if (!message.member.roles.some((r) => MOD_ROLE.includes(r))) {
      await message.reply('You are not permitted to use this command.');
      return;
    }

    const infos: undefined | structure = await betterKV.GetData(
      `warncase-${user.user.id}`,
      'warncases'
    );

    if (infos === undefined) await message.reply('No cases for this user!');
    else {
      let msg: string = `Warn cases for user <@${user.user.id}>: `;
      console.log(infos);
      for (let i: number = 0; i < infos.reason.length; ++i) {
        msg = msg.replace(
          msg,
          msg +
            `\nAuthor: <@${infos.author[i] ?? 'no id'}>. Reason: ${infos.reason[
              i
            ] ?? 'no reason'}. Timestamp: ${new Date(infos.timestamp[i])}.`
        );
      }

      await message.reply(msg);
    }
  }
);

WarnCommands.on(
  {
    name: 'delete-warn',
    description: 'delete all the cases from a user'
  },
  (_arguments) => ({
    user: _arguments.guildMember()
  }),
  async (message, { user }) => {
    if (!message.member.roles.some((r) => MOD_ROLE.includes(r))) {
      await message.reply('You are not permitted to use this command.');
      return;
    }

    if (await betterKV.DeleteData(`warncase-${user.user.id}`, 'warncases'))
      await message.reply(
        `Warn cases for the user ${user.toMention()} were succesfully deleted.`
      );
    else
      await message.reply(
        `No warn cases were deleted for the user ${user.toMention()}. Probably were no data saved before...`
      );
  }
);
