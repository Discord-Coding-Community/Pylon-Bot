let f = discord.command.filters;
const REDDIT_PERMS = f.and(f.canSendMessages());

const RedditCommand: discord.command.CommandGroup = new discord.command.CommandGroup(
  {
    defaultPrefix: '~',
    filters: REDDIT_PERMS
  }
);

RedditCommand.on(
  {
    name: 'reddit',
    aliases: ['r'],
    description: 'Fetch a random post from a specified subreddit.'
  },

  (args) => ({
    subReddit: args.textOptional()
  }),
  async (message, { subReddit }) => {
    if (subReddit == null) {
      return message.reply(
        `❌ Sorry ${message.author.toMention()}, You need a Subreddit to Fetch a Post from`
      );
    } else {
      const req = await fetch(`https://api.reddit.com/${subReddit}/`);
      const data = await req.json();
      const { children } = data.data;
      const len = children.length;
      const post = children[Math.floor(Math.random() * (len - 1))];

      await message.reply(
        new discord.Embed({
          title: post.data.title,
          color: (Math.random() * 0xffffff) | 0,
          image: {
            url: post.data.url
          },
          footer: {
            text: `Fetched from https://www.reddit.com/${subReddit}/\nRequested By ${message.author.getTag()}`
          },
          timestamp: new Date().toISOString()
        })
      );
    }
  }
);
