import * as def from '../config/setup';
import * as op from '../config/functions';
import * as inventory from './inv-setup';
import * as invfunc from './func';
import { getObjectProperty as find } from './shop';
import obc from '../config/setup';

obc.on(
  { name: 'inventory', aliases: ['inv'] },
  (a) => ({ target: a.guildMemberOptional() }),
  async (message, { target }) => {
    target = target || message.member;
    const tid = target.user.id;
    // prettier-ignore
    const mapItems: Map<string, number> = new Map([
      [`**${def.standards.shopIcons.lock} Padlock:** `, await inventory.getUserItems(tid, 'lock')],
      [`**${def.standards.shopIcons.mine} Landmine:** `, await inventory.getUserItems(tid, 'mine')],
      [`**${def.standards.shopIcons.life} Backup Heart:** `, await inventory.getUserItems(tid, 'heart')],
      [`**${def.standards.shopIcons.pick} Pickaxe:** `, await inventory.getUserItems(tid, 'pick')],
      [`**${def.standards.shopIcons.gem} Gems:** `, await inventory.getUserItems(tid, 'gem')],
      [`**${def.standards.shopIcons.commonCrate} Common Crate:** `, await inventory.getUserItems(tid, 'common')]
    ]);
    const inventoryWithItems = [];
    for (const [name, value] of mapItems.entries()) {
      if (value > 0) {
        inventoryWithItems.push([name + `**\`${value}\`**`], '');
      }
    }
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setAuthor({ name: `${target.user.username}'s inventory` })
      .setDescription(
        inventoryWithItems === undefined || inventoryWithItems.length == 0
          ? '**nothing to see here...**'
          : inventoryWithItems.join('\n')
      )
      .setFooter({
        text: "For more information on \nan item, use '.shop <id>'"
      });
    await message.reply(embed);
  }
);

const nonBuyableItems = inventory.nonShopItems;

obc.on(
  {
    name: 'buy',
    aliases: ['b', 'purchase']
  },
  (a) => ({ shopItem: a.string(), count: a.integerOptional() }),
  async (message, { shopItem, count }) => {
    count = count || 1;
    if (nonBuyableItems.includes(shopItem.toLowerCase())) {
      return message.reply(`This item cannot be Purchased.`);
    }
    const item = inventory.findItemByName(shopItem);
    if (item == null) {
      return message.reply({
        content: `Item with name: **${shopItem}** does not exist, use \`.shop\` to list items that can be purchased.`,
        allowedMentions: {}
      });
    }
    await inventory.purchaseItem(message.author.id, shopItem, message, count);
  }
);

obc.on(
  {
    name: 'sell',
    aliases: ['s']
  },
  (a) => ({ shopItem: a.string(), count: a.integerOptional() }),
  async (message, { shopItem, count }) => {
    count = count || 1;
    const item = inventory.findItemByName(shopItem);
    if (item == null) {
      return message.reply({
        content: `Item with name: **${shopItem}** does not exist, use \`.shop\` to list items that can be sold.`,
        allowedMentions: {}
      });
    }
    await inventory.SellItem(message.author.id, shopItem, count, message);
  }
);

obc.on(
  {
    name: 'gift',
    aliases: ['giveitem'],
    onError: ({ message }) => {
      message.reply(`need help? \n\`${def.PREFIX}gift <count> <item> <user>\``);
    }
  },
  (a) => ({
    count: a.integer(),
    shopItem: a.string(),
    target: a.guildMember()
  }),
  // prettier-ignore
  async (message, { count, shopItem, target }) => {
    const item = inventory.findItemByName(shopItem);
    if (item == null) {
      return message.reply({
        content: `Item with name: **${shopItem}** does not exist, use \`.shop\` to list items that can be sold.`,
        allowedMentions: {}
      });
    }
    await inventory.giftItem(message.author.id, target.user.id, shopItem, count, message);
  }
);

obc.on(
  {
    name: 'use',
    aliases: ['equip', 'open']
  },
  (a) => ({ inventoryItem: a.text() }),
  async (message, { inventoryItem }) => {
    const lastUse = await def.tempStorageKV.get<number>(
      `lastUse-${message.author?.id}`
    );
    if (lastUse)
      return message.reply(`You need to wait before using an Item again.`);
    await def.tempStorageKV.put(`lastUse-${message.author?.id}`, Date.now(), {
      ttl: def.standards.TIMERS.BET_INTERVAL
    });
    const item = inventory.findItemByName(inventoryItem);
    if (item == null) {
      return message.reply({
        content: `Item with name: **${inventoryItem}** is not in your inventory, use \`.inventory\` to list items that you have.`,
        allowedMentions: {}
      });
    }
    await inventory.useItem(message.author.id, inventoryItem, message);
  }
);
