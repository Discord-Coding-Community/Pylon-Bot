import * as def from '../config/setup';
import * as op from '../config/functions';
import * as inventory from './inv-setup';
import { Item } from './inv-setup';
import obc from '../config/setup';

const unknownItem = (name: string) => {
  return `Item with name: **${name}** does not exist, use \`.shop\` to list items that can be purchased.`;
};

export const getObjectProperty = (name: string, obj: object) => {
  const arr = obj;
  for (const property in arr) {
    if (property.toLowerCase().includes(name))
      // @ts-ignore
      return arr[property];
  }
};

export const buildShopEmbed = async (
  name: string,
  message: discord.Message
): Promise<discord.Embed> => {
  name = name.toLowerCase();
  for (const [item, itemInfo] of inventory.itemConfig.entries()) {
    if (
      itemInfo.id.toLowerCase() === name ||
      itemInfo.shortform.toLowerCase() === name ||
      inventory.nonShopItems.includes(name)
    ) {
      const amount = await inventory.getUserItems(message.author.id, name);
      return new discord.Embed({
        title: `**${
          inventory.nonShopItems.includes(name)
            ? getObjectProperty(name, inventory.nonShopObjects)
            : itemInfo.name
        }** ${amount === 0 ? '' : `(${amount} owned)`}`,
        description: `**Type: \`${getObjectProperty(
          name,
          inventory.hardItemTypes
        )}\`** \n\n${getObjectProperty(
          name,
          inventory.extendDescriptions
        )} \n\n${[
          `**PRICE** - **${
            inventory.nonShopItems.includes(name)
              ? 'Cannot be Purchased'
              : `${def.standards.currency}${itemInfo.price}`
          }**`,
          `**SELLS** - **${def.standards.currency}${
            inventory.nonShopItems.includes(name)
              ? `${getObjectProperty(name, inventory.ItemConfig)}`
              : `${Math.round(itemInfo.price / 10)}`
          }**`
        ].join('\n')}`,
        color: def.standards.embeds.general,
        thumbnail: { url: getObjectProperty(name, inventory.itemThumbnails) }
      });
    }
  }
  return new discord.Embed({ description: unknownItem(name) });
};

obc.subcommand('shop', async (shopCommands) => {
  shopCommands.default(
    (a) => ({ shopItem: a.stringOptional() }),
    async (message, { shopItem }) => {
      if (shopItem === null) {
        const embed = inventory.renderEmbed(
          [...inventory.itemConfig.entries()].map(([item, itemInfo]) => ({
            item,
            itemInfo
          }))
        );
        embed
          .setColor(def.standards.embeds.general)
          .setTitle('All Items')
          .setDescription(
            `to buy an item, write \`.buy <id>\`. for more information, use \`.shop <id>\``
          );
        await message.reply(embed);
      } else {
        const auditItem = shopItem.toLowerCase();
        await message.reply(buildShopEmbed(auditItem, message));
      }
    }
  );
});
