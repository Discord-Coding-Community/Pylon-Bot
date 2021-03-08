import * as def from './setup';

//randomizer
export function randomizer<T>(items: T[]): T {
  return items[(items.length * Math.random()) | 0];
}

// increment user balance:
export async function incrementBalance(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, bal: (prev.bal ?? 0) + by };
    return { bal: by };
  });
}

export async function incrementXP(userId: discord.Snowflake, by: number = 1) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, xp: (prev.xp ?? 0) + by };
    return { xp: by };
  });
}

export async function incrementMulti(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, multi: (prev.multi ?? 0) + by };
    return { multi: by };
  });
}

export async function incrementGained(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, amtGained: (prev.amtGained ?? 0) + by };
    return { amtGained: by };
  });
  const incWins = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, gWins: (prev.gWins ?? 0) + 1 };
    return { gWins: 1 };
  });
}

export async function incrementLost(userId: discord.Snowflake, by: number = 1) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, amtLost: (prev.amtLost ?? 0) + by };
    return { amtLost: by };
  });
  const incLosses = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, gLosses: (prev.gLosses ?? 0) + 1 };
    return { gLosses: 1 };
  });
}

// access the interface
export async function getXp(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.xp ?? 0;
}

export async function getBalance(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.bal ?? 0;
}

export async function getMulti(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.multi ?? 0;
}

export async function getGained(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtGained ?? 0;
}

export async function getLost(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtLost ?? 0;
}

export async function getGambleWins(
  userId: discord.Snowflake
): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.gWins ?? 0;
}

export async function getGambleLosses(
  userId: discord.Snowflake
): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.gLosses ?? 0;
}

export async function getAmountShared(
  userId: discord.Snowflake
): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtShared ?? 0;
}

export async function getAmountRecieved(
  userId: discord.Snowflake
): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtRecieved ?? 0;
}

export async function incrementShared(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, amtShared: (prev.amtShared ?? 0) + by };
    return { amtShared: by };
  });
}
export async function incrementRecieved(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = def.userKV.transact<def.IUserInventory>(userId, (prev) => {
    if (prev) return { ...prev, amtRecieved: (prev.amtRecieved ?? 0) + by };
    return { amtRecieved: by };
  });
}
/*
export async function ttt(userId: discord.Snowflake) {
  const ui = await def.userKV.get<def.IUserInventory>(userId);
  if (ui?.test) return;
  await def.userKV.put(userId, <def.IUserInventory>)
}
*/
