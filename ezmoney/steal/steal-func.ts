import * as op from '../config/functions';
import * as inventory from '../inventory/inv-setup';
import * as invfunc from '../inventory/func';
import * as def from '../config/setup';

// increment vals
export async function incrementAmtRobbed(
  userId: discord.Snowflake,
  by: number = 1
) {
  const incrementAmountRobbed = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev) return { ...prev, amtRobbed: (prev.amtRobbed ?? 0) + by };
      return { amtRobbed: by };
    }
  );

  const incrementRobWins = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev) return { ...prev, rWins: (prev.rWins ?? 0) + 1 };
      return { rWins: 1 };
    }
  );
}

export async function incrementAmtPaid(
  userId: discord.Snowflake,
  by: number = 1
) {
  const incrementAmountPaid = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev) return { ...prev, amtPaid: (prev.amtPaid ?? 0) + by };
      return { amtPaid: by };
    }
  );

  const incrementRobLosses = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev) return { ...prev, rLosses: (prev.rLosses ?? 0) + 1 };
      return { rLosses: 1 };
    }
  );
}

// access kvInterface
export async function getAmtRobbed(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtRobbed ?? 0;
}

export async function getAmtPaid(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.amtPaid ?? 0;
}

export async function getRobWins(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.rWins ?? 0;
}

export async function getRobLosses(userId: discord.Snowflake): Promise<number> {
  const userInfo = await def.userKV.get<def.IUserInventory>(userId);
  return userInfo?.rLosses ?? 0;
}

// steal checks
/* DEPRECATED */ export async function checkUserLocks(
  robberId: discord.Snowflake,
  targetId: discord.Snowflake,
  message: discord.Message
) {
  //functions
  const robberBalance = await op.getBalance(robberId);
  const targetBalance = await op.getBalance(targetId);
  const targetLock = await inventory.getLockEquipped(targetId);
  // code
}
