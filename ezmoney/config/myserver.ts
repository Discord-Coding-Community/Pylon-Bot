import { tempStorageKV } from './setup';
import * as def from './setup';
import obc from './setup';

export interface IMyServer extends pylon.JsonObject {
  // Commands
  rob: boolean;
  daily: boolean;
  weekly: boolean;
  // Server
  lotteryChannel: discord.Snowflake;
  lotteryAmt: number;
}

export enum EnDis {
  enabled = '<:yes:718226032829923379>',
  disabled = '<:no:718226981401002026>'
}

export const moduleEnabled = `This Command is already Enabled.`;
export const moduleDisabled = `This Command is already Disabled.`;

const f = discord.command.filters;
export const iA = f.isAdministrator();

/*
//          Renders the config for your server.
*/
export async function renderConfig(message: discord.Message) {
  const guild = await message.getGuild();
  if (!guild) throw new TypeError('expected guild to be non-null');
  let rsOutcome = EnDis.disabled;
  let dsOutcome = EnDis.disabled;
  let wsOutcome = EnDis.disabled;
  let lCS = 'not set';
  const rs = await robSettings(guild.id);
  if (rs === true) rsOutcome = EnDis.enabled;
  const ds = await dailySettings(guild.id);
  if (ds === true) dsOutcome = EnDis.enabled;
  const ws = await weeklySettings(guild.id);
  if (ws === true) wsOutcome = EnDis.enabled;
  const lC = await lotteryChannelSettings(guild.id);
  await message.reply(
    new discord.Embed({
      description: `**${def.standards.settings} Server Config** 
          ${rsOutcome}**\`Robbing\`⁣ ⁣ ⁣ ⁣ ${dsOutcome}\`Daily\`
          ${wsOutcome}\`Weekly\`\nLottery Channel:** <#${lC}>`
    })
  );
}

/*
//          Methods to Recieve the current states of your server.
//          Default for all Methods are true, and lotteryChannel is unset.
*/
export async function robSettings(
  serverId: discord.Snowflake
): Promise<boolean> {
  const serversettings = await tempStorageKV.get<IMyServer>(serverId);
  return serversettings?.rob ?? true;
}

export async function dailySettings(
  serverId: discord.Snowflake
): Promise<boolean> {
  const serversettings = await tempStorageKV.get<IMyServer>(serverId);
  return serversettings?.daily ?? true;
}

export async function weeklySettings(
  serverId: discord.Snowflake
): Promise<boolean> {
  const serversettings = await tempStorageKV.get<IMyServer>(serverId);
  return serversettings?.weekly ?? true;
}

export async function lotteryChannelSettings(
  serverId: discord.Snowflake
): Promise<discord.Snowflake> {
  const serversettings = await tempStorageKV.get<IMyServer>(serverId);
  return serversettings?.lotteryChannel ?? 'not set';
}

/*
//              Methods to enable and disable modules with ease,
//              along with setting your server's lottery channel.
*/

export async function enableRob(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        rob: true
      };
    return { rob: true };
  });
}

export async function disableRob(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        rob: false
      };
    return { rob: false };
  });
}

export async function enableDaily(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        daily: true
      };
    return { daily: true };
  });
}

export async function disableDaily(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        daily: false
      };
    return { daily: false };
  });
}

export async function enableWeekly(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        weekly: true
      };
    return { weekly: true };
  });
}

export async function disableWeekly(serverId: discord.Snowflake) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        weekly: false
      };
    return { weekly: false };
  });
}

export async function setLotteryChannel(
  serverId: discord.Snowflake,
  channelId: string
) {
  const enable = await tempStorageKV.transact<IMyServer>(serverId, (prev) => {
    if (prev)
      return {
        ...prev,
        lotteryChannel: channelId
      };
    return { lotteryChannel: channelId };
  });
}

/*
//              Methods to check if modules are already enabled/disabled,
//              along with reverting modules back to their default states.
*/
export async function enableAll(message: discord.Message) {
  const guild = await message.getGuild();
  if (!guild) throw new TypeError('expected guild to be non-null');
  const rs = await robSettings(guild.id);
  const ds = await dailySettings(guild.id);
  const ws = await dailySettings(guild.id);
  if (rs === true && ds === true && ws === true)
    return message.reply('All commands are already enabled.');
  await enableRob(guild.id);
  await enableDaily(guild.id);
  await enableWeekly(guild.id);
  await message.reply(
    new discord.Embed({
      description: `${def.standards.settings} **Enabled \`All Commands\`**`
    })
  );
}

export async function disableAll(message: discord.Message) {
  const guild = await message.getGuild();
  if (!guild) throw new TypeError('expected guild to be non-null');
  const rs = await robSettings(guild.id);
  const ds = await dailySettings(guild.id);
  const ws = await weeklySettings(guild.id);
  if (rs === false && ds === false && ws === false)
    return message.reply('All commands are already disabled.');
  await disableRob(guild.id);
  await disableDaily(guild.id);
  await disableWeekly(guild.id);
  await message.reply(
    new discord.Embed({
      description: `${def.standards.settings} **Disabled \`All Commands\`**`
    })
  );
}

export async function setDefault(message: discord.Message) {
  const guild = await message.getGuild();
  if (!guild) throw new TypeError('expected guild to be non-null');
  const rs = await robSettings(guild.id);
  const ds = await dailySettings(guild.id);
  const ws = await weeklySettings(guild.id);
  if (rs === true && ds === true && ws === true)
    return message.reply('All commands are already in Default State.');
  await enableRob(guild.id);
  await enableDaily(guild.id);
  await enableWeekly(guild.id);
  await message.reply(
    new discord.Embed({
      description: `${def.standards.settings} **Reverted \`All Commands\` to Default State**`
    })
  );
}

export async function enableMSG(message: discord.Message, whichModule: string) {
  await message.reply(
    new discord.Embed({
      description: `${def.standards.settings} **Enabled \`${whichModule}\` command**`
    })
  );
}

export async function disableMSG(
  message: discord.Message,
  whichModule: string
) {
  await message.reply(
    new discord.Embed({
      description: `${def.standards.settings} **Disabled \`${whichModule}\` command**`
    })
  );
}

export async function disabledModule(
  whichModule: string,
  message: discord.Message
) {
  return message.reply(
    new discord.Embed({
      description: `**The following Command is Currently Disabled: \`${whichModule}\`**
        To enable, use \`.enable <command>\`.
        To check which Commands are enabled, use the \`myserver\` command.`
    })
  );
}
