import * as def from '../config/setup';
import * as inventory from './inv-setup';
import * as op from '../config/functions';
import { getObjectProperty as find } from './shop';
import obc from '../config/setup';

export async function confirmPurchase(
  count: number,
  itemName: string,
  message: discord.Message,
  price: number,
  sold?: boolean
) {
  const embed = new discord.Embed();
  embed
    .setColor(def.standards.embeds.general)
    .setAuthor({
      name: 'Successful Purchase',
      iconUrl: message.author.getAvatarUrl()
    })
    .setDescription(
      `<:yes:718226032829923379> You ${
        sold === true ? 'sold' : 'bought'
      } **${count} ${itemName}${count === 1 ? '' : 's'}** and ${
        sold === true ? 'recieved' : 'paid'
      } **${def.standards.currency}${sold === true ? price : price * count}**`
    );
  await message.reply(embed);
}

export const giftEmbed = async (
  count: number,
  itemName: string,
  giftedUser: string,
  message: discord.Message
) => {
  const embed = new discord.Embed();
  embed
    .setColor(def.standards.embeds.general)
    .setAuthor({
      name: 'Item Gifted',
      iconUrl: message.author.getAvatarUrl()
    })
    .setDescription(
      `<:yes:718226032829923379> You gifted **${count} ${itemName}${
        count === 1 ? '' : 's'
      }** to **${giftedUser}**`
    );
  await message.reply(embed);
};

export async function incrementLocksInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          lock: (prev.lock ?? 0) + by
        };
      return { lock: by };
    }
  );
}

export async function incrementMinesInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          mine: (prev.mine ?? 0) + by
        };
      return { mine: by };
    }
  );
}

export async function incrementLivesInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          life: (prev.life ?? 0) + by
        };
      return { life: by };
    }
  );
}

export async function incrementPicksInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          pick: (prev.pick ?? 0) + by
        };
      return { pick: by };
    }
  );
}

export async function incrementGemsInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          gem: (prev.gem ?? 0) + by
        };
      return { gem: by };
    }
  );
}

export async function incrementCommonsInInventory(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          commonCrate: (prev.commonCrate ?? 0) + by
        };
      return { commonCrate: by };
    }
  );
}

export async function changedLockEquip(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          lEquip: (prev.lEquip ?? 0) + by
        };
      return { lEquip: by };
    }
  );
}

export async function changeMineEquip(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          mEquip: (prev.mEquip ?? 0) + by
        };
      return { mEquip: by };
    }
  );
}

export async function incrementMineUses(
  userId: discord.Snowflake,
  by: number = 1
) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          mUse: (prev.mUse ?? 0) + by
        };
      return { mUse: by };
    }
  );
}

export async function resetMineUses(userId: discord.Snowflake) {
  const transact = await def.userKV.transact<def.IUserInventory>(
    userId,
    (prev) => {
      if (prev)
        return {
          ...prev,
          mUse: 0
        };
      return { mUse: 0 };
    }
  );
}
