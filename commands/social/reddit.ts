import { config } from '../../modules/config/cfg';
import { permissions } from '../../modules/config/permissions';
config.commands.on(
  {
    name: 'reddit',
    aliases: ['r'],
    description: 'Fetch a random post from a specified subreddit.',
    filters: permissions.user
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
      const req = await fetch(`https://api.reddit.com/r/${subReddit}/`);
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
            text: `Fetched from r/${subReddit}`
          },
          timestamp: new Date().toISOString()
        })
      );
    }
  }
);
