import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';

config.slashCommands.register(
  {
    name: 'search',
    description: 'Search with Wolfram Alpha API',
    options: (opt) => ({
      query: opt.string({
        name: 'query',
        description: 'Search with Wolfram Alpha API'
      })
    })
  },
  async (interaction, { query }) => {
    const s = Date.now();
    const api = await fetch(
      `http://api.wolframalpha.com/v1/result?appid=${
        config.api.WOLFRAM_API
      }&i=${encodeURIComponent(query)}`
    );
    const res = await api.text();
    await interaction.respond(`.
You searched for: \`${query}\`
Result: ${res}

(Done in ${Date.now() - s}ms)`);
  }
);

config.commands.on(
  {
    name: 'search',
    aliases: ['s', 'wolfram', 'ws', 'wa'],
    description: 'Search with Wolfram Alpha API',
    filters: permissions.user
  },
  (args) => ({
    query: args.text()
  }),
  async (message, { query }) => {
    const appId = config.api.WOLFRAM_API;

    let api = await fetch(
      `http://api.wolframalpha.com/v1/result?appid=${appId}&i=${query}`
    );
    let result = await api.text();

    const replyEmbed = new discord.Embed();
    const description = `**Query:**
    \`\`\`${query}\`\`\`
    **Response:**
    \`\`\`${result}\`\`\``;
    replyEmbed.setDescription(description);
    replyEmbed.setFooter({
      text: `Powered by the WolframAlpha API`,
      iconUrl:
        'https://community.wolfram.com/group-branding-portlet/images/wa-asset.png'
    });

    await message.reply(replyEmbed);
  }
);
