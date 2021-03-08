import * as def from '../config/setup';
import * as op from '../config/functions';
import * as inventory from '../inventory/inv-setup';
import obc from '../config/setup';

obc.raw('help', async (message) => {
  const cc = [
    '`achievements`',
    '`bailout`',
    '`balance`',
    '`beg`',
    '`buy`',
    '`coinflip`',
    '`daily`',
    '`gamble`',
    '`gift`',
    '`mine`',
    '`roll`',
    '`shop`',
    '`search`',
    '`sell`',
    '`slots`',
    '`steal`',
    '`use`',
    '`weekly`'
  ].join(', ');
  const gc = [
    '`checklist`',
    '`inventory`',
    '`leaderboard`',
    '`profile`',
    '`trivia`'
  ].join(', ');
  const ac = [
    '`admin`',
    '`hardwipe`',
    '`myserver`',
    '`setbal`',
    '`setxp`',
    '`viewcooldowns`',
    '`viewstorage`'
  ].join(', ');
  const embed = new discord.Embed();
  embed
    .setColor(def.standards.embeds.general)
    .setDescription(
      `**${def.standards.currency} Currency Commands** \n ${cc}\n\n**${def.standards.checkmark} General Commands** \n ${gc}\n\n**${def.standards.settings} Admin Commands** \n${ac}`
    );
  await message.reply(embed);
});

obc.on(
  {
    name: 'balance',
    aliases: ['bal']
  },
  (args) => ({ target: args.guildMemberOptional() }),
  async (message, { target }) => {
    target = target || message.member;
    const bal = await op.getBalance(target.user.id);
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**${target.user.username}'s Balance: ${
          def.standards.currency
        }${bal as number}**`
      );
    await message.reply(embed);
  }
);

obc.raw({ name: 'leaderboard', aliases: ['top', 'lb'] }, async (message) => {
  await sleep(500);
  const points = (await def.userKV.items()).map(({ key, value }) => ({
    userId: key,
    value: value?.bal as number
  }));
  const sorted = points.sort((a, b) => b.value - a.value).slice(0, 10);
  const pointsWithUsers = await Promise.all(
    sorted.map(async (v) => ({
      ...v,
      user: await discord.getUser(v.userId)
    }))
  );
  // Sort `points` by value and make sure it doesn't exceed the character limit by slicing the array
  const lbEmbed = new discord.Embed();
  const guild = await message.getGuild();
  let medal = `:small_blue_diamond:`;
  lbEmbed
    .setAuthor({
      name: `Richest Users in ${guild.name}`
    })
    .setColor(def.standards.embeds.general);
  pointsWithUsers.forEach((v, i) => {
    if (i == undefined) {
      return;
    } else {
      if (i == 0) {
        medal = `🥇`;
      } else if (i == 1) {
        medal = `🥈`;
      } else if (i == 2) {
        medal = `🥉`;
      } else {
        medal = ':small_blue_diamond:';
      }
    }
    lbEmbed.addField({
      name:
        v.value == undefined
          ? '឵឵'
          : `${medal} ${v.user?.getTag() || 'Unknown'} - **${
              def.standards.currency
            }${v.value?.toLocaleString()}**`,
      value: `_ _`,
      inline: false
    });
  });

  await message.reply({
    embed: lbEmbed
  });
});

obc.raw({ name: 'checklist', aliases: ['cl'] }, async (message) => {
  let mine = `:white_medium_square:`;
  const userPicks = await inventory.getPicks(message.author.id);
  if (userPicks > 0) {
    const lastMine = await def.tempStorageKV.get<number>(
      `lastMine-${message.author?.id}`
    );
    if (lastMine) mine = def.standards.checkmark;
  }
  let daily = `:white_medium_square:`;
  let beg = `:white_medium_square:`;
  let search = `:white_medium_square:`;
  let weekly = `:white_medium_square:`;
  const lastDaily = await def.tempStorageKV.get<number>(
    `lastDaily-${message.author?.id}`
  );
  const lastBeg = await def.tempStorageKV.get<number>(
    `lastBeg-${message.author?.id}`
  );
  const lastWeekly = await def.tempStorageKV.get<number>(
    `lastWeekly-${message.author?.id}`
  );
  const lastSearch = await def.tempStorageKV.get<number>(
    `lastSearch-${message.author?.id}`
  );
  if (lastDaily) daily = def.standards.checkmark;
  if (lastBeg) beg = def.standards.checkmark;
  if (lastSearch) search = def.standards.checkmark;
  if (lastWeekly) weekly = def.standards.checkmark;
  const embed = new discord.Embed();
  embed
    .setThumbnail({ url: message.author.getAvatarUrl() })
    .setColor(def.standards.embeds.general)
    .setDescription(
      [
        `**${daily} Daily**`,
        `**${weekly} Weekly**`,
        `**${beg} Beg**`,
        `**${search} Search**`,
        userPicks > 0 ? `**${mine} Mine**` : ''
      ].join('\n')
    );
  await message.reply(embed);
});

obc.on(
  { name: 'multiplier', aliases: ['multi'] },
  (a) => ({ target: a.guildMemberOptional() }),
  async (message, { target }) => {
    target = target || message.member;
    const xp = await op.getXp(message.author.id);
    const userLevel = Math.floor(def.levelScale * Math.sqrt(xp ?? 0));
    const multi = await op.getMulti(target.user.id);
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setAuthor({
        name: `${target.user.username}'s Multiplier`,
        iconUrl: target.user.getAvatarUrl()
      })
      .addField({
        name: `**Total Multiplier:** ${multi}%`,
        value: [`**Level ${userLevel}**`].join('\n')
      });
    await message.reply(embed);
  }
);

obc.on(
  {
    name: 'share',
    aliases: ['give', 'donate']
  },
  (a) => ({ target: a.guildMember(), amount: a.integer() }),
  async (message, { target, amount }) => {
    const userBal = await op.getBalance(message.author.id);
    const targetBal = await op.getBalance(target.user.id);
    if (target.user.id === message.author.id)
      return message.reply(`You can't share coins with yourself!`);
    if (target.user.bot)
      return message.reply(`You can't share coins with bots.`);
    if (userBal < 500)
      return message.reply(
        `You need at least **${def.standards.currency}500** to share coins with people.`
      );
    if (amount > userBal)
      return message.reply(`You don't have that many coins!`);
    const takeFromAuthor = await op.incrementBalance(
      message.author.id,
      -amount
    );
    const giveToUser = await op.incrementBalance(target.user.id, amount);
    const increaseAmtShared = await op.incrementShared(
      message.author.id,
      amount
    );
    const increaseAmtRecieved = await op.incrementRecieved(
      target.user.id,
      amount
    );
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**You gave ${
          def.standards.currency
        }${amount} to ${target.user.getTag()}**`
      );
    await message.reply(embed);
  }
);

/*
 * new Bailout Command
 * if you go to 0 coins you can get 500 coins for free
 */
obc.raw({ name: 'bailout', aliases: ['bail'] }, async (message) => {
  const userBal = await op.getBalance(message.author.id);
  const gambleAttempts =
    (await op.getGambleWins(message.author.id)) +
    (await op.getGambleLosses(message.author.id));
  if (userBal === 0 && gambleAttempts > 5) {
    await op.incrementBalance(
      message.author.id,
      def.standards.REWARDS.BAILOUT_REWARD
    );
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**🏦 You were given ${def.standards.currency}${def.standards.REWARDS.BAILOUT_REWARD} as part of your bailout.**`
      );
    await message.reply(embed);
  } else
    return await message.reply(
      'You are not currently eligible for the bailout.'
    );
});

obc.raw({ name: 'achievements', aliases: ['badges'] }, async (message) => {
  await message.reply(
    new discord.Embed({
      description: `While using the bot, you can receive random Badges and Achievements. \nMost are secret. These show up on your profile card.`,
      color: def.standards.embeds.general
    })
  );
});
