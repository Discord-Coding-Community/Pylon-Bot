import * as def from './setup';
import * as op from './functions';
import obc from './setup';

async function handleXpInc(userId: discord.Snowflake, by: number = 1) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev) return { ...prev, xp: (prev.xp ?? 0) + by };
      return { xp: by };
    }
  );
}

discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (!message.author || message.author.bot || !message.member) return;
  const userFetch = await def.userKV.get<def.IUserInventory>(message.author.id);
  const userXp = userFetch?.xp;
  const userLevel = def.levelScale * Math.sqrt(userXp ?? 0);
  const xpGain: number = 10 + parseInt((Math.random() * 15).toFixed(0));
  if (
    !def.xpGainCooldowns.get(message.author.id) ||
    (def.xpGainCooldowns.get(message.author.id) &&
      <number>def.xpGainCooldowns.get(message.author.id) < Date.now())
  ) {
    if (userXp === undefined) {
      await def.userKV.transact<def.IUserInventory>(
        message.author.id,
        (prev) => {
          if (prev)
            return {
              ...prev,
              xp: xpGain
            };
          return { xp: xpGain };
        }
      );
    } else {
      if (
        Math.floor(def.levelScale * Math.sqrt(userXp + xpGain)) >
        Math.floor(userLevel)
      ) {
        const newLevel = Math.round(
          def.levelScale * Math.sqrt(userXp + xpGain)
        );
        await handleLevelUp(message, newLevel);
      }
      await handleXpInc(message.author.id, xpGain);
    }
    def.xpGainCooldowns.set(message.author.id, Date.now() + 60000);
  }
});

async function handleLevelUp(message: discord.Message, newLevel: number) {
  const currentMultiplier = await op.getMulti(message.author.id);
  const incMulti = def.multiplierIncByLevel.get(newLevel);
  const newReward = def.levelRewards.get(newLevel);
  if (newReward)
    await op.incrementBalance(message.author.id, parseInt(newReward));
  if (incMulti) await op.incrementMulti(message.author.id, parseInt(incMulti));
  const embed = new discord.Embed();
  embed
    .setColor(def.standards.embeds.general)
    .setDescription(
      `**${
        message.author.username
      } Levelled Up! \nThey are now Level \`${newLevel}\`**${
        newReward
          ? `\n\n**They recieved ${def.standards.currency}${newReward}**`
          : ''
      }${
        incMulti
          ? `\n**Their new multiplier:** ${currentMultiplier +
              parseInt(incMulti)}%`
          : ''
      }`
    );
  await message.reply(embed);
}
