import * as def from '../config/setup';
import * as op from '../config/functions';
import obc from '../config/setup';

obc.on(
  {
    name: 'coinflip',
    aliases: ['cf', 'flip']
  },
  (args) => ({
    coinInput: args.string({ choices: ['heads', 'tails'] }),
    amount: args.integer()
  }),
  async (message, { coinInput, amount }) => {
    const userBal = await op.getBalance(message.author.id);
    const coinFlipResult = Math.random() >= 0.5 ? 'heads' : 'tails';
    if (amount < 100)
      return message.reply(
        `You must bet atleast **${def.standards.currency}100**!`
      );
    if (amount > userBal)
      return message.reply(
        `Your balance is only **${def.standards.currency}${userBal}**.`
      );
    const lastFlip = await def.tempStorageKV.get<number>(
      `lastFlip-${message.author?.id}`
    );
    const secondsUntil = -Math.ceil((lastFlip - Date.now()) / 1000);
    if (lastFlip)
      return message.reply(
        `Gambling Addiction is a serious problem.\nTry again in **${5 -
          secondsUntil}** seconds.`
      );
    await def.tempStorageKV.put(`lastFlip-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.BET_INTERVAL
    });
    if (coinFlipResult !== coinInput)
      await op.incrementBalance(message.author.id, -amount);
    else await op.incrementBalance(message.author.id, amount);
    await sleep(250);
    const incrementBasedOnResult =
      coinFlipResult !== coinInput
        ? await op.incrementLost(message.author.id, amount)
        : await op.incrementGained(message.author.id, amount);
    const embed = new discord.Embed();
    embed
      .setColor(
        coinFlipResult !== coinInput
          ? def.standards.embeds.lose
          : def.standards.embeds.general
      )
      .setAuthor({
        name: `${message.author.username}'s coinflip`,
        iconUrl: 'https://cdn.discordapp.com/emojis/743891217586323527.png?v=1'
      })
      .setDescription(
        `${
          coinFlipResult !== coinInput
            ? `**The coin landed on \`${coinFlipResult}\`\nYou lost ${
                def.standards.currency
              }${amount}\nBalance: ${def.standards.currency}${userBal -
                amount}**`
            : `**The coin landed on \`${coinFlipResult}\`\nBalance: ${
                def.standards.currency
              }${userBal + amount}**`
        }`
      );
    await message.reply(embed);
  }
);

obc.on(
  {
    name: 'gamble',
    aliases: ['bet', 'g']
  },
  (args) => ({ amount: args.integer() }),
  async (message, { amount }) => {
    const userChance = Math.random();
    const userBal = await op.getBalance(message.author.id);
    const userMulti = await op.getMulti(message.author.id);
    const buffReward =
      amount > 250 ? 250 : amount > 1000 ? 400 : amount > 10000 ? 1250 : 80;
    const userReward =
      Math.ceil(amount * (Math.random() * 1) + buffReward) +
      Math.ceil(amount * (userMulti / 100));
    if (amount < 100 || amount > 75000)
      return await message.reply(
        `You can only gamble between **${def.standards.currency}100 and ${def.standards.currency}75000**`
      );
    if (amount > userBal)
      return await message.reply(
        `You only have **${def.standards.currency}${userBal}**`
      );

    const lastBet = await def.tempStorageKV.get<number>(
      `lastBet-${message.author?.id}`
    );
    const secondsUntil = -Math.ceil((lastBet - Date.now()) / 1000);
    if (lastBet)
      return message.reply(
        `Gambling Addiction is a serious problem.\nTry again in **${5 -
          secondsUntil}** seconds.`
      );
    await def.tempStorageKV.put(`lastBet-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.BET_INTERVAL
    });

    const giveToUser =
      userChance >= 0.55
        ? await op.incrementBalance(message.author.id, userReward)
        : await op.incrementBalance(message.author.id, -amount);
    await sleep(250);
    const incrementBasedOnResult =
      userChance >= 0.55
        ? await op.incrementGained(message.author.id, userReward)
        : await op.incrementLost(message.author.id, amount);
    const embed = new discord.Embed();
    embed
      .setColor(
        userChance >= 0.55
          ? def.standards.embeds.general
          : def.standards.embeds.lose
      )
      .setAuthor({ name: `${message.author.username}'s gambling game` })
      .setDescription(
        `${
          userChance >= 0.55
            ? `You won **${
                def.standards.currency
              }${userReward}**\n**Percent of bet won:** ${Math.round(
                100 * (1 - ((userReward - amount) / amount) * -1)
              )}% | **Multiplier:** ${userMulti}% \n\nYou now have **${
                def.standards.currency
              }${userBal + userReward}**`
            : `You lost **${
                def.standards.currency
              }${amount}**\nYou now have **${def.standards.currency}${userBal -
                amount}**`
        }`
      );
    await message.reply(embed);
  }
);

obc.on(
  { name: 'roll', aliases: ['r'] },
  (a) => ({ amount: a.integer() }),
  async (message, { amount }) => {
    const bot = await discord.getBotUser();

    const userMulti = await op.getMulti(message.author.id);
    const buffReward =
      amount > 250 ? 250 : amount > 1000 ? 400 : amount > 10000 ? 1250 : 80;
    const userReward =
      Math.ceil(amount * (Math.random() * 1) + buffReward) +
      Math.ceil(amount * (userMulti / 100));

    const userBal = await op.getBalance(message.author.id);
    const genRoll = Math.floor(Math.random() * 5 + 1);
    const userRoll = Math.floor(Math.random() * 5 + 1) + genRoll;
    const botRoll = Math.floor(Math.random() * 11 + 1);

    const lastRoll = await def.tempStorageKV.get<number>(
      `lastRoll-${message.author?.id}`
    );
    const secondsUntil = -Math.ceil((lastRoll - Date.now()) / 1000);
    if (lastRoll)
      return message.reply(
        `Gambling Addiction is a serious problem.\nTry again in **${5 -
          secondsUntil}** seconds.`
      );
    await def.tempStorageKV.put(`lastRoll-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.BET_INTERVAL
    });
    switch (true) {
      case amount < 100 || amount > 75000:
        return message.reply(
          `You can only gamble between **${def.standards.currency}100 and ${def.standards.currency}75000**`
        );
      case amount > userBal:
        return message.reply(`You don't have that many coins.`);
      case userRoll === botRoll:
        await op.incrementBalance(message.author.id, -Math.round(amount / 2));
        const incrementStats = await op.incrementLost(
          message.author.id,
          -Math.round(amount / 2)
        );
        const embed = new discord.Embed();
        embed
          .setColor(def.standards.embeds.neutral)
          .setAuthor({ name: `${message.author.username}'s Roll` })
          .setDescription(
            `You tied! You lost **${def.standards.currency}${Math.round(
              amount / 2
            )}**\n\nYou now have **${def.standards.currency}${userBal -
              Math.round(amount / 2)}**`
          )
          .addField({
            name: message.author.username,
            value: `Rolled \`${userRoll}\``,
            inline: true
          })
          .addField({
            name: bot.username,
            value: `Rolled \`${botRoll}\``,
            inline: true
          });
        return message.reply(embed);
      default:
        await op.incrementBalance(
          message.author.id,
          userRoll > botRoll ? userReward : -amount
        );
        const incrementBasedOnResult =
          userRoll > botRoll
            ? await op.incrementGained(message.author.id, userReward)
            : await op.incrementLost(message.author.id, amount);
        const finalEmbed = new discord.Embed();
        finalEmbed
          .setColor(
            userRoll > botRoll
              ? def.standards.embeds.general
              : def.standards.embeds.lose
          )
          .setAuthor({ name: `${message.author.username}'s Roll` })
          .setDescription(
            userRoll > botRoll
              ? `You won **${
                  def.standards.currency
                }${userReward}**\n**Percent of bet won:** ${Math.round(
                  100 * (1 - ((userReward - amount) / amount) * -1)
                )}% | **Multiplier:** ${userMulti}% \n\nYou now have **${
                  def.standards.currency
                }${userBal + userReward}**`
              : `You lost **${
                  def.standards.currency
                }${amount}**\nYou now have **${
                  def.standards.currency
                }${userBal - amount}**`
          )
          .addField({
            name: message.author.username,
            value: `Rolled \`${userRoll}\``,
            inline: true
          })
          .addField({
            name: bot.username,
            value: `Rolled \`${botRoll}\``,
            inline: true
          });
        return message.reply(finalEmbed);
    }
  }
);

obc.on(
  { name: 'slots' },
  (a) => ({ amount: a.integer() }),
  async (message, { amount }) => {
    const bal = await op.getBalance(message.author.id);
    const multi = await op.getMulti(message.author.id);
    const tripleReward =
      Math.ceil(amount * (Math.random() * 4.5) + 250) +
      Math.ceil(amount * (multi / 100));
    const doubleReward =
      Math.ceil(amount * (Math.random() * 1.25) + 75) +
      Math.ceil(amount * (multi / 100));
    // slots setup
    const slots = def.slots;
    let result1 = Math.floor(Math.random() * slots.length);
    let result2 = Math.floor(Math.random() * slots.length);
    let result3 = Math.floor(Math.random() * slots.length);
    //checks
    if (amount < 100 || amount > 75000)
      return await message.reply(
        `You can only gamble between **${def.standards.currency}100 and ${def.standards.currency}75000**`
      );
    if (amount > bal)
      return await message.reply(
        `You only have **${def.standards.currency}${bal}**`
      );
    const lastSlot = await def.tempStorageKV.get<number>(
      `lastSlot-${message.author?.id}`
    );
    const secondsUntil = -Math.ceil((lastSlot - Date.now()) / 1000);
    if (lastSlot)
      return message.reply(
        `Gambling Addiction is a serious problem.\nTry again in **${5 -
          secondsUntil}** seconds.`
      );
    await def.tempStorageKV.put(`lastSlot-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.BET_INTERVAL
    });
    // code runs
    const embed = new discord.Embed();
    embed
      .setAuthor({ name: `${message.author.username}'s slot machine` })
      .addField({
        name: 'Outcome',
        value: `**>${slots[result1]} ${slots[result2]} ${slots[result3]}<**`
      });
    await message.reply(embed).then(async (m) => {
      await sleep(1000);
      if (
        slots[result1] === slots[result2] &&
        slots[result1] === slots[result3]
      ) {
        await op.incrementBalance(message.author.id, tripleReward);
        await op.incrementGained(message.author.id, tripleReward);
        m.edit(
          embed
            .setColor(def.standards.embeds.general)
            .setDescription(
              `You won **${
                def.standards.currency
              }${tripleReward}\nPercent of bet won:** ${Math.round(
                100 * (1 - ((tripleReward - amount) / amount) * -1)
              )}% | **Multiplier:** ${multi}%\nYou now have **${
                def.standards.currency
              }${bal + tripleReward}**`
            )
        );
      }
      if (
        slots[result1] === slots[result2] ||
        slots[result1] === slots[result3] ||
        slots[result2] === slots[result3]
      ) {
        await op.incrementBalance(message.author.id, doubleReward);
        await op.incrementGained(message.author.id, doubleReward);
        m.edit(
          embed
            .setColor(def.standards.embeds.general)
            .setDescription(
              `You won **${
                def.standards.currency
              }${doubleReward}\nPercent of bet won:** ${Math.round(
                100 * (1 - ((doubleReward - amount) / amount) * -1)
              )}% | **Multiplier:** ${multi}%\nYou now have **${
                def.standards.currency
              }${bal + doubleReward}**`
            )
        );
      } else {
        await op.incrementBalance(message.author.id, -amount);
        await op.incrementLost(message.author.id, amount);
        m.edit(
          embed
            .setColor(def.standards.embeds.lose)
            .setDescription(
              `You lost **${
                def.standards.currency
              }${amount}**\nYou now have **${def.standards.currency}${bal -
                amount}**`
            )
        );
      }
    });
  }
);
