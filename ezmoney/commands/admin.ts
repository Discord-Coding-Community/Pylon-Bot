import * as def from '../config/setup';
import * as op from '../config/functions';
import * as myserver from '../config/myserver';
import * as steal from '../steal/steal-func';
import * as inventory from '../inventory/inv-setup';
import * as toInventory from '../inventory/func';
import obc from '../config/setup';

obc.raw('admin', async (message) => {
  const desc = [
    '`disable <command>`',
    ' `enable <command>`',
    '`set lotterychannel <lotterychannelID>`'
  ].join(', ');
  await message.reply(
    new discord.Embed({
      description:
        '**these commands are used to manage commands that can be used in your server. view your servers current config using `.myserver`** \n' +
        desc +
        '\n**i.e `.disable rob`**'
    })
  );
});

obc.on(
  {
    name: 'setbal',
    filters: discord.command.filters.isAdministrator()
  },
  (a) => ({ target: a.guildMember(), by: a.number() }),
  async (message, { target, by }) => {
    const userBal = await op.getBalance(target.user.id);
    await op.incrementBalance(target.user.id, by);
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**${target.user.username}'s balance is now ${
          def.standards.currency
        }${userBal + by}**`
      );
    await message.reply(embed);
  }
);

obc.on(
  {
    name: 'setxp',
    filters: discord.command.filters.isAdministrator()
  },
  (a) => ({ target: a.guildMember(), by: a.integer() }),
  async (message, { target, by }) => {
    const userBal = await op.getXp(target.user.id);
    await op.incrementXP(target.user.id, by);
    const embed = new discord.Embed();
    embed
      .setColor(def.standards.embeds.general)
      .setDescription(
        `**${target.user.username}'s xp is now ${userBal + by}**`
      );
    await message.reply(embed);
  }
);

obc.on(
  {
    name: 'e',
    filters: discord.command.filters.isAdministrator()
  },
  (a) => ({ func: a.stringOptional() }),
  async (message, { func }) => {
    await message.reply(`${op.getBalance.toString()}`);
  }
);

obc.raw(
  { name: 'viewstorage', filters: discord.command.filters.isAdministrator() },
  async (message) => {
    const c = await def.userKV.count();
    const l = await def.userKV.list();
    await message.reply(
      `**${discord.decor.Emojis.LOCK} ${c} key${
        c === 1 ? '' : 's'
      } stored:** \`${def.userKV.namespace}\`\n\`\`\`\n${l.join(',\n')}\`\`\``
    );
  }
);

obc.raw(
  { name: 'viewcooldowns', filters: discord.command.filters.isAdministrator() },
  async (message) => {
    const c = await def.tempStorageKV.count();
    const l = await def.tempStorageKV.list();
    await message.reply(
      `**${discord.decor.Emojis.LOCK} ${c} key${
        c === 1 ? '' : 's'
      } stored:** \`${def.tempStorageKV.namespace}\`\n\`\`\`\n${l.join(
        ',\n'
      )}\`\`\``
    );
  }
);

obc.raw(
  { name: 'hardwipe', filters: discord.command.filters.isAdministrator() },
  async (message) => {
    const clear1 = await def.userKV.clear();
    const clear2 = await def.tempStorageKV.clear();
    await message.reply(`**Cleared \`${clear1}\`** accounts`);
  }
);

obc.on(
  { name: 'del', filters: discord.command.filters.isAdministrator() },
  (a) => ({ key: a.string() }),
  async (message, { key }) => {
    const c = await def.userKV.delete(key);
    await message.reply(`deleted ${c} key`);
  }
);
obc.subcommand(
  { name: 'myserver', filters: myserver.iA },
  async (subcommand) => {
    subcommand.defaultRaw(async (message) => {
      await myserver.renderConfig(message);
    });
  }
);

obc.subcommand({ name: 'set', filters: myserver.iA }, async (subcommand) => {
  subcommand.on(
    {
      name: 'lotterychannel'
    },
    (a) => ({ whichChannel: a.string() }),
    async (message, { whichChannel }) => {
      const guild = await message.getGuild();
      await myserver.setLotteryChannel(guild.id, whichChannel);
      await message.reply(
        new discord.Embed({
          description: `${def.standards.settings} **Lottery Channel is now <#${whichChannel}>**`
        })
      );
    }
  );
});

obc.subcommand({ name: 'enable', filters: myserver.iA }, async (subcommand) => {
  subcommand.default(
    (a) => ({
      whichModule: a.stringOptional({
        choices: ['rob', 'daily', 'weekly', 'all', 'default']
      })
    }),
    async (message, { whichModule }) => {
      if (whichModule === null) return await myserver.renderConfig(message);
      const guild = await message.getGuild();
      switch (whichModule) {
        case 'all':
          await myserver.enableAll(message);
          break;
        case 'default':
          await myserver.setDefault(message);
          break;
        case 'rob':
          const rs = await myserver.robSettings(guild.id);
          if (rs === true) return message.reply(myserver.moduleEnabled);
          await myserver.enableRob(guild.id);
          await myserver.enableMSG(message, 'Rob');
          break;
        case 'daily':
          const ds = await myserver.dailySettings(guild.id);
          if (ds === true) return message.reply(myserver.moduleEnabled);
          await myserver.enableDaily(guild.id);
          await myserver.enableMSG(message, 'Daily');
          break;
        case 'weekly':
          const ws = await myserver.weeklySettings(guild.id);
          if (ws === true) return message.reply(myserver.moduleEnabled);
          await myserver.enableWeekly(guild.id);
          await myserver.enableMSG(message, 'Weekly');
          break;
      }
    }
  );
});

obc.subcommand(
  { name: 'disable', filters: myserver.iA },
  async (subcommand) => {
    subcommand.default(
      (a) => ({
        whichModule: a.stringOptional({
          choices: ['rob', 'daily', 'weekly', 'all', 'default']
        })
      }),
      async (message, { whichModule }) => {
        if (whichModule === null) return await myserver.renderConfig(message);
        const guild = await message.getGuild();
        switch (whichModule) {
          case 'all':
            await myserver.disableAll(message);
            break;
          case 'rob':
            const rs = await myserver.robSettings(guild.id);
            if (rs === false) return message.reply(myserver.moduleDisabled);
            await myserver.disableRob(guild.id);
            await myserver.disableMSG(message, 'Rob');
            break;
          case 'daily':
            const ds = await myserver.dailySettings(guild.id);
            if (ds === false) return message.reply(myserver.moduleDisabled);
            await myserver.disableDaily(guild.id);
            await myserver.disableMSG(message, 'Daily');
            break;
          case 'weekly':
            const ws = await myserver.weeklySettings(guild.id);
            if (ws === false) return message.reply(myserver.moduleDisabled);
            await myserver.disableWeekly(guild.id);
            await myserver.disableMSG(message, 'Weekly');
            break;
        }
      }
    );
  }
);