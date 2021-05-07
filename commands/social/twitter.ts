import {
  COMMAND_PREFIX,
  ADMIN_ROLE,
  TWITTER_API,
  TWITTER_BEARER,
  TWITTER_ICON
} from '../../config/configs';

const TwitterSubCfg = {
  TWITTER_API_KEY: TWITTER_API,
  TWITTER_BEARER_TOKEN: TWITTER_BEARER,
  ICON_URL: TWITTER_ICON,
  REQUIRED_ROLE_ID: ADMIN_ROLE
};

class TwitterClient {
  private static AuthHeader: RequestInit = {
    headers: [['Authorization', `Bearer ${TwitterSubCfg.TWITTER_BEARER_TOKEN}`]]
  };

  static async getTweets(
    userId?: string,
    sinceId?: string,
    count?: number
  ): Promise<Tweet[]> {
    let url = new URL(
      'https://api.twitter.com/1.1/statuses/user_timeline.json'
    );

    if (userId != undefined) {
      url.searchParams.append('user_id', userId);
    }
    if (sinceId != undefined) {
      url.searchParams.append('since_id', sinceId);
    }
    if (count != undefined) {
      url.searchParams.append('count', count.toString());
    }

    let query = await fetch(url, TwitterClient.AuthHeader);
    let json = await query.json();
    let rawJson = JSON.stringify(json);
    return JSON.parse(rawJson);
  }

  static async getUserIdByUserName(username: string): Promise<string | null> {
    let url = new URL('https://api.twitter.com/2/users/by/username/');
    url.pathname += username;
    let query = await fetch(url, TwitterClient.AuthHeader);
    let json = await query.json();

    if (json['errors']?.length > 0) {
      return null;
    }

    return json['data']['id'];
  }

  static async getUserNames(userIds: string[]): Promise<string[]> {
    let url = new URL('https://api.twitter.com/2/users');
    url.searchParams.append('ids', userIds.join(','));
    let query = await fetch(url, TwitterClient.AuthHeader);
    let json = await query.json();
    return json['data'].map((x: any) => x.username);
  }
}

const cmd = new discord.command.CommandGroup({
  defaultPrefix: COMMAND_PREFIX,
  filters:
    TwitterSubCfg.REQUIRED_ROLE_ID?.length > 0
      ? discord.command.filters.hasRole(TwitterSubCfg.REQUIRED_ROLE_ID)
      : undefined
});
const twitterSubKv = new pylon.KVNamespace('twitter-subs');

interface TwitterSub {
  channelId: string;
  lastTweetId?: string;
}

interface Tweet {
  id_str: string;
  user: TwitterUser;
}

interface TwitterUser {
  screen_name: string;
}

cmd.subcommand('twitter', (subcmd) => {
  subcmd.on(
    'sub',
    (ctx) => ({
      username: ctx.string(),
      channel: ctx.stringOptional()
    }),
    async (msg, { username, channel }) => {
      let userId = await TwitterClient.getUserIdByUserName(username);
      if (userId == null) {
        await msg.reply(
          createEmbedMessage(
            `:x: Cannot find Twitter user with the name **${username}**`
          )
        );
        return;
      }

      let existingSub = await twitterSubKv.get<string>(userId);
      if (existingSub != null) {
        let sub: TwitterSub = JSON.parse(existingSub);
        let subChannel = await discord.getGuildTextChannel(sub.channelId);
        await msg.reply(
          createEmbedMessage(
            `:x: There is a subscription already to this feed in ${subChannel?.toMention() ??
            '*Unknown channel*'}`
          )
        );
        return;
      }

      let channelId =
        channel == null ? msg.channelId : stripMentionableChannelId(channel);
      let ch = await discord.getGuildTextChannel(channelId);

      if (ch == null) {
        msg.reply(createEmbedMessage(':x: Invalid channel'));
        return;
      }

      let twitterSub: TwitterSub = {
        channelId: stripMentionableChannelId(channelId)
      };
      await twitterSubKv.put(userId, JSON.stringify(twitterSub));

      let twitterNames = await TwitterClient.getUserNames([userId]);
      await msg.reply(
        createEmbedMessage(
          `:white_check_mark: Successfully subscribed to [@${twitterNames[0]
          }](https://twitter.com/${twitterNames[0]}) in ${ch.toMention()}`
        )
      );

      await fetchTweets();
    }
  );

  subcmd.on(
    'unsub',
    (ctx) => ({ username: ctx.string() }),
    async (msg, { username }) => {
      let userId = await TwitterClient.getUserIdByUserName(username);
      if (userId == null) {
        await msg.reply(
          createEmbedMessage(
            `:x: Cannot find Twitter user with the name **${username}**`
          )
        );
        return;
      }

      let sub = await twitterSubKv.get<string>(userId);
      if (sub == null) {
        await msg.reply(
          createEmbedMessage(':x: There is no subscription for this feed')
        );
        return;
      }

      await twitterSubKv.delete(userId);

      let twitterNames = await TwitterClient.getUserNames([userId]);
      await msg.reply(
        createEmbedMessage(
          `:white_check_mark: Successfully unsubscribed from [@${twitterNames[0]}](https://twitter.com/${twitterNames[0]})`
        )
      );
    }
  );

  subcmd.raw('list', async (msg) => {
    let keys = await twitterSubKv.list();
    if (keys.length == 0) {
      await msg.reply(createEmbedMessage(':x: There are no subscriptions'));
      return;
    }

    let items = await twitterSubKv.items();
    let usernames = await TwitterClient.getUserNames(keys);
    let listMsg = new Array<string>();

    for (let i = 0; i < keys.length; i++) {
      let sub: TwitterSub = JSON.parse(items[i].value as string);
      let channel = await discord.getGuildTextChannel(sub.channelId);
      listMsg.push(
        `@${usernames[i]} -> ${channel?.toMention() ?? '*Unknown channel*'}`
      );
    }

    await msg.reply(
      createEmbedMessage(
        listMsg.join('\n'),
        'Subscriptions',
        `${keys.length} subscribed feeds`
      )
    );
  });

  subcmd.raw('poll', async (msg) => {
    let tweetCount = await fetchTweets();
    await msg.reply(
      createEmbedMessage(
        `:white_check_mark: Manual polling found ${tweetCount} new tweets`
      )
    );
  });
});

pylon.tasks.cron('twitter-sub', '0 0/5 * * * * *', async () => {
  await fetchTweets();
});

async function fetchTweets(): Promise<number> {
  let keys = await twitterSubKv.list();
  if (keys.length == 0) {
    return 0;
  }

  let tweetCount = 0;
  for (let key of keys) {
    tweetCount += await fetchFeed(key);
  }

  return tweetCount;
}

async function fetchFeed(twitterUserId: string): Promise<number> {
  let sub = await getSub(twitterUserId);
  let tweets = await TwitterClient.getTweets(
    twitterUserId,
    sub.lastTweetId,
    sub.lastTweetId == undefined ? 1 : undefined
  );
  if (tweets.length > 0) {
    await twitterSubKv.transact<string>(twitterUserId, (prev) => {
      let sub: TwitterSub = JSON.parse(prev as string);
      sub.lastTweetId = tweets[0].id_str;
      return JSON.stringify(sub);
    });

    let sub = await getSub(twitterUserId);
    await sendTweets(sub.channelId, tweets);
  }

  return tweets.length;
}

async function sendTweets(channelId: string, tweets: Tweet[]): Promise<void> {
  let channel = await discord.getGuildTextChannel(channelId);
  for (let tweet of tweets) {
    await channel?.sendMessage({
      content: `http://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
    });
  }
}

async function getSub(key: string): Promise<TwitterSub> {
  let subJson = await twitterSubKv.get<string>(key);
  return JSON.parse(subJson as string);
}

function stripMentionableChannelId(mentionnableChannelId: string): string {
  return mentionnableChannelId.replace('<#', '').replace('>', '');
}

function createEmbedMessage(
  description?: string,
  title?: string,
  footerText?: string
): discord.Message.OutgoingMessageArgument<
  discord.Message.OutgoingMessageOptions
> {
  let embed = new discord.Embed({
    author: {
      name: 'Twitter Sub',
      iconUrl: TwitterSubCfg.ICON_URL
    },
    title,
    description
  });

  if (footerText != undefined) {
    embed.setFooter({
      text: footerText
    });
  }

  return { embed };
}
