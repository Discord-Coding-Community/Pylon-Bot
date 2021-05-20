import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

const tagsKv = new pylon.KVNamespace('tags');

config.commands.subcommand(
  { name: 'tag', filters: permissions.admin },
  (subcommand) => {
    subcommand.on(
      {
        name: 'set',
        description: 'Create a tag'
      },
      (ctx) => ({
        key: ctx.string(),
        value: ctx.text()
      }),
      async (message, { key, value }) => {
        await tagsKv.put(key, value);

        await message.reply({
          content: `Alright, I've saved the tag for **${key}**!`,
          allowedMentions: {}
        });
      }
    );

    subcommand.on(
      {
        name: 'delete',
        description: 'Delete a tag'
      },
      (ctx) => ({ key: ctx.string() }),
      async (message, { key }) => {
        await tagsKv.delete(key);

        await message.reply({
          content: `Alright, I've deleted the tag for **${key}**!`,
          allowedMentions: {}
        });
      }
    );

    subcommand.default(
      (ctx) => ({ key: ctx.string() }),
      async (message, { key }) => {
        const value = await tagsKv.get<string>(key);

        if (value == null) {
          await message.reply({
            content: `Unknown tag: **${key}**`,
            allowedMentions: {}
          });
        } else {
          await message.reply({ content: value, allowedMentions: {} });
        }
      }
    );
  }
);
