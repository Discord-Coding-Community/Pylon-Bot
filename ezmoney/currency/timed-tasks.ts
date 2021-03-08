import * as def from '../config/setup';
import * as op from '../config/functions';
import * as myserver from '../config/myserver';
import * as inventory from '../inventory/inv-setup';
import * as invfunc from '../inventory/func';
import { Handler } from '../config/awaiter';
import obc from '../config/setup';

const handler = new Handler();

obc.raw('daily', async (message) => {
  const guild = await message.getGuild();
  const ds = await myserver.dailySettings(guild.id);
  if (ds === false) return myserver.disabledModule('Daily', message);

  const lastDaily = await def.tempStorageKV.get<number>(
    `lastDaily-${message.author?.id}`
  );
  const hoursUntil = -Math.ceil((lastDaily - Date.now()) / 1000 / 3600);
  if (lastDaily)
    return message.reply(
      `You already collected your daily reward! \nTry again in **${24 -
        hoursUntil}** hours.`
    );
  await def.tempStorageKV.put(`lastDaily-${message.author?.id}`, Date.now(), {
    ttl: def.standards.TIMERS.DALIY_INTERVAL
  });
  await op.incrementBalance(
    message.author.id,
    def.standards.REWARDS.DAILY_REWARD
  );
  await message.reply(
    new discord.Embed({
      color: def.standards.embeds.general,
      description: `**${def.standards.currency}${def.standards.REWARDS.DAILY_REWARD} was added to your balance**`
    })
  );
});

obc.raw('weekly', async (message) => {
  const guild = await message.getGuild();
  const ws = await myserver.weeklySettings(guild.id);
  if (ws === false) return myserver.disabledModule('Weekly', message);

  const lastWeekly = await def.tempStorageKV.get<number>(
    `lastWeekly-${message.author?.id}`
  );
  const daysUntil = -Math.ceil((lastWeekly - Date.now()) / 1000 / 86400);
  if (lastWeekly)
    return message.reply(
      `You already collected your weekly reward!\nTry again in **${7 -
        daysUntil}** days.`
    );
  await def.tempStorageKV.put(`lastWeekly-${message.author.id}`, Date.now(), {
    ttl: def.standards.TIMERS.WEEKLY_INTERVAL
  });
  await op.incrementBalance(
    message.author.id,
    def.standards.REWARDS.WEEKLY_REWARD
  );
  await message.reply(
    new discord.Embed({
      color: def.standards.embeds.general,
      description: `**${def.standards.currency}${def.standards.REWARDS.WEEKLY_REWARD} was added to your balance**`
    })
  );
});

obc.raw('beg', async (message) => {
  const lastBeg = await def.tempStorageKV.get<number>(
    `lastBeg-${message.author?.id}`
  );
  const secondsUntil = -Math.ceil((lastBeg - Date.now()) / 1000);
  if (lastBeg)
    return message.reply(
      `You can't always be begging! \nTry again in **${40 -
        secondsUntil}** seconds.`
    );
  await def.tempStorageKV.put(`lastBeg-${message.author?.id}`, Date.now(), {
    ttl: def.standards.TIMERS.BEG_INTERVAL
  });

  const begReward = Math.round(Math.random() * 100 + 15);
  const hoursBegged = Math.round(Math.random() * 11 + 1);
  await op.incrementBalance(message.author.id, begReward);

  await message.reply(
    new discord.Embed({
      color: def.standards.embeds.general,
      description: `**You begged for ${hoursBegged} hour${
        hoursBegged === 1 ? '' : 's'
      } and made ${def.standards.currency}${begReward}**`
    })
  );
});

obc.raw({ name: 'trivia', aliases: ['triv'] }, async (message) => {
  const lastTriv = await def.tempStorageKV.get<number>(
    `lastTriv-${message.author?.id}`
  );
  const secondsUntil = -Math.ceil((lastTriv - Date.now()) / 1000);
  const cooldownmsg = `You can't always do trivia! \nTry again in **${10 -
    secondsUntil}** seconds.`;
  const userBalance = await op.getBalance(message.author.id);
  const randomReward = Math.ceil(Math.random() * 18 + 6);

  const id = message.author.id;
  const triv = await fetch('https://opentdb.com/api.php?amount=1');
  const startTime = Date.now();

  let emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
  let data = await triv.json();
  let results = data.results;
  let body = results[0];
  let question = body.question;
  question = question
    .replace(/&quot;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "'")
    .replace(/&rdquo;/g, "'");
  let correct = body.correct_answer;
  let answers = body.incorrect_answers;

  let correct_num = Math.floor(Math.random() * answers.length);
  answers.splice(correct_num, 0, correct);
  let emb = new discord.Embed({
    author: {
      name: `${message.author.username}'s Trivia Question`
    },
    title: question
  });
  const description = answers
    .map((answer, i) => `${i + 1}) ${answer}`)
    .join('\n');
  emb.setDescription(description);
  emb.setColor((Math.random() * 0xffffff) | 0);

  if (lastTriv) return message.reply(cooldownmsg);
  let msg = await message?.reply(emb);

  if (!msg) return;

  await msg.addReaction('1️⃣');
  await msg.addReaction('2️⃣');

  if (answers.length > 2) {
    await msg.addReaction('3️⃣');
    await msg.addReaction('4️⃣');
  }

  while (Date.now() - startTime < 16000) {
    if (lastTriv) return message.reply(cooldownmsg);
    await def.tempStorageKV.put(`lastTriv-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.TRIV_INTERVAL
    });
    for await (const user of msg.iterReactions(emojis[correct_num])) {
      if (user.id == id) {
        const success = await op.incrementBalance(
          message.author.id,
          randomReward
        );
        return message?.reply(
          `Well done! You earned **${def.standards.currency}${randomReward}**.`
        );
      }
    }
  }

  await message?.reply(
    "You couldn't answer in time. The correct answer is:\n" +
      answers[correct_num]
  );
});

const MINE_CHOICES = {
  canada: '`canada`',
  america: '`america`',
  china: '`china`'
};

obc.raw('mine', async (message) => {
  const userPicks = await inventory.getPicks(message.author.id);
  if (userPicks === 0)
    return message.reply(
      'You need a pickaxe to use this command, buy one using the `buy` command!'
    );
  const lastMine = await def.tempStorageKV.get<number>(
    `lastMine-${message.author?.id}`
  );
  const minutesUntil = -Math.ceil((lastMine - Date.now()) / 1000 / 60);
  if (lastMine)
    return message.reply(
      `You can't be mining all the time!\nTry again in **${3 -
        minutesUntil}** minute${5 - minutesUntil === 1 ? '' : 's'}.`
    );
  await def.tempStorageKV.put(`lastMine-${message.author?.id}`, Date.now(), {
    ttl: def.standards.TIMERS.MINE_INTERVAL
  });
  const pickaxeChance = Math.random();
  const amountOfGemsFound = Math.random() * 5 + 1;
  const hoursMined = Math.round(Math.random() * 11 + 1);
  if (pickaxeChance < 0.04) {
    await invfunc.incrementPicksInInventory(message.author.id, -1);
    return message.reply(
      `You went mining for too long, and now your pickaxe has broken. Time to buy another one!`
    );
  }
  if (pickaxeChance >= 0.91)
    return message.reply("You didn't find anything during your session.");
  else {
    await invfunc.incrementGemsInInventory(
      message.author.id,
      Math.round(amountOfGemsFound)
    );
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**${
          def.standards.shopIcons.pick
        } You went mining for ${hoursMined} hour${
          hoursMined === 1 ? '' : 's'
        } and acquired ${Math.round(amountOfGemsFound)} ${
          def.standards.shopIcons.gem
        } Gem${Math.round(amountOfGemsFound) === 1 ? '' : 's'}**`
      );
    await message.reply(embed);
  }
});
