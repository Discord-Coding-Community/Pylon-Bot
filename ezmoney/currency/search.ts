import * as def from '../config/setup';
import * as op from '../config/functions';
import * as myserver from '../config/myserver';
import * as inventory from '../inventory/inv-setup';
import * as invfunc from '../inventory/func';
import { Handler } from '../config/awaiter';
import obc from '../config/setup';

const handler = new Handler();
const defMsg = (choice: string) => {
  return `**you searched: \`${choice.toUpperCase()}\`**`;
};

// setup
const SEARCH_CHOICES = {
  ONE: ['car', 'hospital', 'pocket', 'warehouse'],
  TWO: ['playground', 'drawer', 'bathtub', 'phone'],
  THREE: ['jacket', 'station', 'restaurant', 'house']
};

const betterSearch = async (
  userId: discord.Snowflake,
  choice: string,
  message: discord.Message
) => {
  const randomReward = Math.ceil(Math.random() * 95 + 1);
  const newReward = randomReward + 200;
  await op.incrementBalance(userId, newReward);
  return message.inlineReply(
    `${defMsg(choice)} and got some good loot! ${
      discord.decor.Emojis.MONEYBAG
    } \nYou found **${def.standards.currency}${newReward}**`
  );
};

const caughtSearch = async (
  userId: discord.Snowflake,
  choice: string,
  message: discord.Message
) => {
  const bal = await op.getBalance(userId);
  if (bal < 250)
    return message.inlineReply(
      `${defMsg(
        choice
      )} \nyou were caught! The police let you go with a warning.`
    );
  await op.incrementBalance(message.author.id, -250);
  return message.inlineReply(
    `${defMsg(choice)} \nyou were caught! You had to pay **${
      def.standards.currency
    }250** for your bail.`
  );
};

obc.raw('search', async (message) => {
  const bal = await op.getBalance(message.author.id);
  const userLives = await inventory.getLives(message.author.id);
  const lastSearch = await def.tempStorageKV.get<number>(
    `lastSearch-${message.author?.id}`
  );
  const secondsUntil = -Math.ceil((lastSearch - Date.now()) / 1000);
  const cooldownmsg = `You can't always be searching! \nTry again in **${40 -
    secondsUntil}** seconds.`;
  if (lastSearch) return message.inlineReply(cooldownmsg);
  const successRate = Math.random();
  const badReward = 0;
  const badChance = 0.84;
  const randomReward = Math.ceil(Math.random() * 95 + 1);
  let attempts = 0;
  const choiceOne = op.randomizer(SEARCH_CHOICES.ONE);
  const choiceTwo = op.randomizer(SEARCH_CHOICES.TWO);
  const choiceThree = op.randomizer(SEARCH_CHOICES.THREE);
  await message.inlineReply(
    `**${discord.decor.Emojis.MAG} Where do you want to search?** Write your choice in chat.\n\`${choiceOne}\`, \`${choiceTwo}\`, \`${choiceThree}\``
  );
  await def.tempStorageKV.put(`lastSearch-${message.author?.id}`, Date.now(), {
    ttl: def.standards.TIMERS.BEG_INTERVAL
  });
  await handler.createMessageHandler({
    message,
    filter: (msgHandler, msg) =>
      msg.content.toLowerCase() === choiceOne ||
      msg.content.toLowerCase() === choiceTwo ||
      msg.content.toLowerCase() === choiceThree,
    onMatch: async (msgHandler, msg) => {
      const choice = msg.content.toLowerCase();

      attempts++;
      if (choice === choiceOne && attempts <= 1) {
        if (
          choiceOne === SEARCH_CHOICES.ONE[0] &&
          choice === choiceOne &&
          successRate <= 0.2
        )
          return await caughtSearch(message.author.id, choice, message);
        if (
          choiceOne === SEARCH_CHOICES.ONE[0] &&
          choice === choiceOne &&
          successRate >= 0.75
        )
          return await betterSearch(message.author.id, choice, message);
        if (
          choiceOne === SEARCH_CHOICES.ONE[1] &&
          choice === choiceOne &&
          successRate <= 0.12
        ) {
          await op.incrementBalance(
            message.author.id,
            userLives >= 1 ? 0 : -bal
          );
          if (userLives >= 1)
            await invfunc.incrementLivesInInventory(message.author.id, -1);
          return message.inlineReply(
            `${defMsg(choice)} and picked up a rare disease. \n${
              userLives >= 1
                ? `You would have lost all your coins, but luckily you had a **${def.standards.shopIcons.life} Backup Heart** in your inventory!`
                : 'You died.'
            }`
          );
        }
        if (
          choiceOne === SEARCH_CHOICES.ONE[1] &&
          choice === choiceOne &&
          successRate > 0.2 &&
          successRate < 0.45
        )
          return await betterSearch(message.author.id, choice, message);
        if (
          choiceOne === SEARCH_CHOICES.ONE[1] &&
          choice === choiceOne &&
          successRate >= 0.8
        ) {
          await op.incrementBalance(message.author.id, 75);
          await invfunc.incrementLivesInInventory(message.author.id, 1);
          return message.inlineReply(
            `${defMsg(choice)} and found **${
              def.standards.currency
            }75** and a **${def.standards.shopIcons.life} Backup Heart!**`
          );
        }
        if (
          choiceOne === SEARCH_CHOICES.ONE[2] &&
          choice === choiceOne &&
          successRate >= 0.7
        )
          return await betterSearch(message.author.id, choice, message);
        if (
          choiceOne === SEARCH_CHOICES.ONE[2] &&
          choice === choiceOne &&
          successRate <= 0.2
        ) {
          const randomGems = op.randomizer([1, 2]);
          await op.incrementBalance(message.author.id, randomReward);
          await invfunc.incrementGemsInInventory(message.author.id, randomGems);
          return message.inlineReply(
            `${defMsg(choice)} and found **${
              def.standards.currency
            }${randomReward}** and **${randomGems} ${
              def.standards.shopIcons.gem
            } Gem${randomGems === 1 ? '!' : 's!'}**`
          );
        }
        if (
          choiceOne === SEARCH_CHOICES.ONE[3] &&
          choice === choiceOne &&
          successRate >= 0.6
        ) {
          await op.incrementBalance(message.author.id, randomReward);
          await invfunc.incrementCommonsInInventory(message.author.id);
          return message.inlineReply(
            `${defMsg(choice)} and found **${
              def.standards.currency
            }${randomReward}** and a **${
              def.standards.shopIcons.commonCrate
            } Common Crate!**`
          );
        }
        if (
          choiceOne === SEARCH_CHOICES.ONE[3] &&
          choice === choiceOne &&
          successRate <= 0.12
        )
          return await caughtSearch(message.author.id, choice, message);
        const success = await op.incrementBalance(
          message.author.id,
          successRate >= badChance ? badReward : randomReward
        );
        await message.inlineReply(
          `${defMsg(choice)} and found **${def.standards.currency}${
            successRate >= badChance ? badReward : randomReward
          }**`
        );
        msgHandler.done();
      } else if (choice === choiceTwo && attempts <= 1) {
        if (
          choiceTwo === SEARCH_CHOICES.TWO[1] &&
          choice === choiceTwo &&
          successRate >= 0.75
        )
          return await betterSearch(message.author.id, choice, message);
        if (
          choiceTwo === SEARCH_CHOICES.TWO[3] &&
          choice === choiceTwo &&
          successRate >= 0.9
        )
          return await betterSearch(message.author.id, choice, message);
        const success = await op.incrementBalance(
          message.author.id,
          successRate >= badChance ? badReward : randomReward
        );
        await message.inlineReply(
          `${defMsg(choice)} and found **${def.standards.currency}${
            successRate >= badChance ? badReward : randomReward
          }**`
        );
        msgHandler.done();
      } else if (choice === choiceThree && attempts <= 1) {
        if (
          choiceThree === SEARCH_CHOICES.THREE[1] &&
          choice === choiceThree &&
          successRate <= 0.25
        )
          return await caughtSearch(message.author.id, choice, message);
        if (
          choiceThree === SEARCH_CHOICES.THREE[1] &&
          choice === choiceThree &&
          successRate >= 0.75
        )
          return await betterSearch(message.author.id, choice, message);
        const success = await op.incrementBalance(
          message.author.id,
          successRate >= badChance ? badReward : randomReward
        );
        await message.inlineReply(
          `${defMsg(choice)} and found **${def.standards.currency}${
            successRate >= badChance ? badReward : randomReward
          }**`
        );
        msgHandler.done();
      }
    }
  });
});
