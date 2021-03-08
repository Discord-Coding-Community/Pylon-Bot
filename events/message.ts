const reactionHandlers: Map<string, ReactionHandler> = new Map();
const messageHandlers: Map<string, MessageHandler> = new Map();

export type OnMessageMatchCallback = (
  messageHandler: MessageHandler,
  msg: discord.Message
) => any;

export type OnReactionMatchCallback = (
  reactionHandler: ReactionHandler,
  reaction: discord.Event.IMessageReactionAdd
) => any;

export type MessageFilterCallback = (
  messageHandler: MessageHandler,
  msg: discord.Message
) => Promise<boolean> | boolean;

export type ReactionFilterCallback = (
  reactionHandler: ReactionHandler,
  reaction: discord.Event.IMessageReactionAdd
) => Promise<boolean> | boolean;

export interface BaseHandlerData {
  message: discord.Message;
}

export class BaseHandler {
  public message: discord.Message;

  constructor(data: BaseHandlerData) {
    this.message = data.message;
  }

  public done() {
    throw new Error(
      'This function must be called from a child class (MessageHandler, ReactionHandler)'
    );
  }
}

export interface MessageHandlerData {
  message: discord.Message;
  filter: MessageFilterCallback;
  onMatch: OnMessageMatchCallback;
}

export class MessageHandler extends BaseHandler {
  public filter: MessageFilterCallback;
  public onMatch: OnMessageMatchCallback;

  constructor(data: MessageHandlerData) {
    super({ message: data.message });
    this.message = data.message;
    this.filter = data.filter;
    this.onMatch = data.onMatch;
  }

  public done(): boolean {
    return messageHandlers.delete(this.message.author!.id);
  }
}

export interface ReactionHandlerData {
  message: discord.Message;
  emojis: Array<discord.decor.Emojis | string>;
  onMatch: OnReactionMatchCallback;
  selfReact?: boolean;
}

export class ReactionHandler extends BaseHandler {
  public emojis: Array<discord.decor.Emojis | string>;
  public onMatch: OnReactionMatchCallback;

  constructor(data: ReactionHandlerData) {
    super({ message: data.message });
    this.message = data.message;
    this.emojis = data.emojis;
    this.onMatch = data.onMatch;
  }

  public done(): boolean {
    return reactionHandlers.delete(this.message.id);
  }
}

export class Handler {
  constructor() {
    this.initEvents();
  }

  private initEvents(): void {
    discord.on(discord.Event.MESSAGE_REACTION_ADD, async (reaction) => {
      const match = reactionHandlers.get(reaction.messageId);
      if (!match) return;

      if (!match.emojis.some((e) => e === reaction.emoji.name)) return;

      await match.onMatch(match, reaction);
    });

    discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
      if (!message.author) return;

      const match = messageHandlers.get(message.author.id);
      if (!match) return;

      const filterRes = await match.filter(match, message);
      if (!filterRes) return;

      await match.onMatch(match, message);
    });
  }

  public async createReactionHandler(
    data: ReactionHandlerData
  ): Promise<ReactionHandler> {
    if (data.selfReact === undefined || data.selfReact) {
      for (const emoji of data.emojis) {
        await data.message.addReaction(emoji);
      }
    }
    const reactionHandler = new ReactionHandler(data);
    reactionHandlers.set(data.message.id, reactionHandler);
    return reactionHandler;
  }

  public async createMessageHandler(
    data: MessageHandlerData
  ): Promise<MessageHandler> {
    const messageHandler = new MessageHandler(data);
    messageHandlers.set(data.message.author!.id, messageHandler);
    return messageHandler;
  }
}
