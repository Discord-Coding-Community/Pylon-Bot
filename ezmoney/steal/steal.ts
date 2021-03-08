import * as def from '../config/setup';
import * as op from '../config/functions';
import * as steal from './steal-func';
import * as inventory from '../inventory/inv-setup';
import * as invfunc from '../inventory/func';
import * as myserver from '../config/myserver';
import obc from '../config/setup';

obc.on(
  {
    name: 'steal',
    aliases: ['rob']
  },
  (args) => ({ target: args.guildMember() }),
  async (message, { target }) => {
    // EnDis
    const guild = await message.getGuild();
    const rs = await myserver.robSettings(guild.id);
    if (rs === false) return myserver.disabledModule('Rob', message);

    const userLives = await inventory.getLives(message.author.id);
    const targetLock = await inventory.getLockEquipped(target.user.id);
    const targetMine = await inventory.getMineEquipped(target.user.id);
    const getTargetMineUsesLeft = await inventory.getMineUses(target.user.id);
    const robberBalance = await op.getBalance(message.author.id);
    const victimBalance = await op.getBalance(target.user.id);
    const robReward = [0.2, 0.15, 0.4, 0.21, 0.3, 0.12, 0.2, 0.3, 0.55, 0.22];
    const robPenalty = [0.05, 0.04, 0.08, 0.03, 0.02, 0.065];
    const mineChance = Math.random();
    const lockChance = Math.random();
    const calculateRobReward = Math.round(
      victimBalance * op.randomizer(robReward)
    );
    const calculateRobPentalty = Math.round(
      robberBalance * op.randomizer(robPenalty)
    );
    let EmojiBasedOnReward = ':money_with_wings: You stole a small amount!';
    if (
      calculateRobReward > victimBalance * 0.2 &&
      calculateRobReward < victimBalance * 0.3
    )
      EmojiBasedOnReward = ':moneybag: You stole a good amount!';
    else if (calculateRobReward > victimBalance * 0.35)
      EmojiBasedOnReward = ':money_mouth: You stole a HUGE amount!';
    // checks
    const robChance = Math.random();
    if (message.author.id === target.user.id)
      return await message.reply(`You can't steal from yourself!`);
    if (robberBalance < 500)
      return await message.reply(
        `You need at least **${def.standards.currency}500** in your balance`
      );
    if (victimBalance < 500)
      return await message.reply(
        `The person you are robbing must have more than **${def.standards.currency}500**`
      );

    const lastRob = await def.tempStorageKV.get<number>(
      `lastRob-${message.author?.id}`
    );
    const minutesUntil = -Math.ceil((lastRob - Date.now()) / 1000 / 60);
    if (lastRob)
      return message.reply(
        `You can't be stealing all the time!\nTry again in **${5 -
          minutesUntil}** minutes.`
      );
    await def.tempStorageKV.put(`lastRob-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.ROB_INTERVAL
    });

    const victimRob = await def.tempStorageKV.get<number>(
      `lastVictim-${message.author?.id}`
    );
    if (victimRob)
      return message.reply(
        `This person has already been stolen from in the last 5 minutes!\nTry again in **${5 -
          minutesUntil}** minutes.`
      );
    await def.tempStorageKV.put(
      `lastVictim-${message.author?.id}`,
      Date.now(),
      { ttl: def.standards.TIMERS.ROB_INTERVAL }
    );
    // lock check
    if (targetLock > 0) {
      await op.incrementBalance(
        message.author.id,
        -inventory.ItemConfig.lockPentalty
      );
      await op.incrementBalance(
        target.user.id,
        inventory.ItemConfig.lockPentalty
      );
      await steal.incrementAmtPaid(
        message.author.id,
        inventory.ItemConfig.lockPentalty
      );
      await invfunc.changedLockEquip(
        target.user.id,
        lockChance >= 0.25 ? -1 : 0
      );
      return message.reply(
        `You try to steal from ${target.user.username}, but are stopped by a **${def.standards.shopIcons.lock} Padlock**. You pay the victim **${def.standards.currency}${inventory.ItemConfig.lockPentalty}**`
      );
    }
    // mine check
    if (targetMine > 0 && mineChance >= 0.35) {
      if (userLives >= 1) {
        await invfunc.incrementLivesInInventory(message.author.id, -1);
        await invfunc.incrementMineUses(target.user.id, 1);
        if (getTargetMineUsesLeft + 1 === inventory.ItemConfig.mineUses) {
          await invfunc.changeMineEquip(target.user.id, -1);
        }
        return message.reply(
          `You step on ${target.user.username}'s **${def.standards.shopIcons.mine} Landmine**, but are saved by your **${def.standards.shopIcons.life} Backup Heart**!`
        );
      } else {
        await op.incrementBalance(message.author.id, -robberBalance);
        await invfunc.incrementMineUses(target.user.id, 1);
        if (getTargetMineUsesLeft + 1 === inventory.ItemConfig.mineUses) {
          await invfunc.changeMineEquip(target.user.id, -1);
        }
        return message.reply(
          `You try to steal from ${target.user.username}, but step on a **${def.standards.shopIcons.mine} Landmine**. You die, and lose **${def.standards.currency}${robberBalance}**.`
        );
      }
    } else {
      const changeAuthorBalance =
        robChance >= 0.33
          ? await op.incrementBalance(message.author.id, -calculateRobPentalty)
          : await op.incrementBalance(message.author.id, calculateRobReward);
      const changeTargetBalance =
        robChance >= 0.33
          ? await op.incrementBalance(target.user.id, calculateRobPentalty)
          : await op.incrementBalance(target.user.id, -calculateRobReward);
      const incrementAuthorStats =
        robChance >= 0.33
          ? await steal.incrementAmtPaid(
              message.author.id,
              calculateRobPentalty
            )
          : await steal.incrementAmtRobbed(
              message.author.id,
              calculateRobReward
            );

      const embed = new discord.Embed();
      embed
        .setColor(
          robChance >= 0.33
            ? def.standards.embeds.lose
            : def.standards.embeds.general
        )
        .setDescription(
          robChance >= 0.33
            ? `${discord.decor.Emojis.ROTATING_LIGHT} **You were caught!**\nYou paid the person you stole from **${def.standards.currency}${calculateRobPentalty}**`
            : `**${EmojiBasedOnReward}**\nYour payout was **${def.standards.currency}${calculateRobReward}**`
        );
      await message.reply(embed);
    }
  }
);
