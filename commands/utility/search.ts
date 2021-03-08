const API_KEY = ' ';
let f = discord.command.filters;
const QUERY_PERMS = f.and(f.canSendMessages());

const SearchCommand = discord.interactions.commands;

SearchCommand.register(
  {
    name: 'search',
    description: 'Search for something!',
    filters: QUERY_PERMS,
    options: (opt) => ({
      query: opt.string({
        name: 'query',
        description: 'The thing to search for'
      })
    })
  },
  async (interaction, { query }) => {
    const s = Date.now();
    const api = await fetch(
      `http://api.wolframalpha.com/v1/result?appid=${API_KEY}&i=${encodeURIComponent(
        query
      )}`
    );
    const res = await api.text();
    await interaction.respond(`.
You searched for: \`${query}\`
Result: ${res}

(Done in ${Date.now() - s}ms)`);
  }
);
