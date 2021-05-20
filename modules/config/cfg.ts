import { apiKeys } from './api';
import { messages } from '../logger/';
import { img } from './images';
export const config = {
  slashCommands: discord.interactions.commands,
  commands: new discord.command.CommandGroup({
    defaultPrefix: '~',
    mentionPrefix: true,
    additionalPrefixes: ['p.']
  }),
  ownerIds: [
    '465228604721201158' // Nimbi
  ],
  me: {
    user: discord.getBotUser,
    id: discord.getBotId()
  },
  api: {
      TWITTER_API: apiKeys.twitterAPI,
      WOLFRAM_API: apiKeys.wolframAPI,
      TWITTER_BEARER: apiKeys.twitterBearer,
      PXLAPI_TOKEN: apiKeys.pxlAPI,
  },
  images: {
      twitterIcon: img.twitter,
      pylonIcon: img.pylon,
      loadingImage: img.ping

  },
  guildId: '801125364218200074', // Discord Coding Community
  welcomeChannel: '801125364646150200',
  modules: {
    logging: {
      enabled: true,
      timezone: 'America/Phoenix',
      channel: '844734009623445514', // 📝｜pylon-logs
      showTimestamps: true,
      showEventNames: true,
      scopes: {
        channelCreate: true,
        channelDelete: true,
        channelPinsUpdate: true,
        channelUpdate: true,
        guildBanAdd: true,
        guildBanRemove: true,
        guildCreate: true,
        guildEmojisUpdate: true,
        guildIntegrationsUpdate: true,
        guildMemberAdd: true,
        guildMemberRemove: true,
        guildMemberUpdate: true,
        guildRoleCreate: true,
        guildRoleDelete: true,
        guildRoleUpdate: true,
        guildUpdate: true,
        messageDelete: true,
        messageDeleteBulk: true,
        messageReactionAdd: true,
        messageReactionRemove: true,
        messageReactionRemoveAll: true,
        messageUpdate: true,
        typingStart: true,
        userUpdate: true,
        voiceServerUpdate: true,
        voiceStateUpdate: true,
        webhooksUpdate: true
      }
    },
    automated: {
      autopublisher: {
          enabled: true,
          announcements: '801274126907080704',
          blacklist: '844733521561255956'
      },
      memberCount: {
        updateChannel: {
          enabled: true,
          channel: '844733697579548712'
        }
      },
      onJoin: {
          enabled: true,
          channel: '801125364646150200'
      },
      onLeave: {
          enabled: true,
          channel: '801125364646150200'
      }
    },
    mod: {
      enabled: true,
      commands: {
          announce: { 
              enabled: true, 
              channel: '801274126907080704'},
          mute: true,
          unmute: true,
          warn: true
        }
      },
      admin: {
        enabled: true,
        defaultRole: '801125364218200076',
        muteRole: '801125364218200075',
        adminRole: '801125364252147744',
        moderatorRole: '801125364252147743',
        autoRoles: {
          enabled: true,
          human: ['801125364218200077'],
          bot: ['804529912928927794']
        },
        reactRoles: {
          enabled: true,
          definitions: [
            {
                role: 'role.id',
                message: 'message.id',
                emoji: discord.decor.Emojis.EMOJI_TAG,
                type: 'toggle'
              },  
            {
                role: 'role.id',
                message: 'message.id',
                emoji: discord.decor.Emojis.EMOJI_TAG,
                type: 'toggle'
              },  
            {
                role: 'role.id',
                message: 'message.id',
                emoji: discord.decor.Emojis.EMOJI_TAG,
                type: 'toggle'
              },  
            {
                role: 'role.id',
                message: 'message.id',
                emoji: discord.decor.Emojis.EMOJI_TAG,
                type: 'toggle'
              },  
            {
                role: 'role.id',
                message: 'message.id',
                emoji: discord.decor.Emojis.EMOJI_TAG,
                type: 'toggle'
              },  
            {
              role: 'role.id',
              message: 'message.id',
              emoji: discord.decor.Emojis.EMOJI_TAG,
              type: 'toggle'
            },               
          ] as {
            role: string;
            message: string;
            emoji: discord.decor.Emojis;
            type: 'once' | 'remove' | 'toggle';
          }[]
        },
        commands: {
          ban: true,
          banlist: true,
          slowmode: true,
          kick: true,
          tag: {
            enabled: true,
            create: true,
            delete: true,
            list: true
          }
        }
      },
      util: {
        enabled: true,
        commands: {
          avatar: true,
          ping: true,
          search: true,
          menu: true
        }
      }
    },
    xp: {
        enabled: true,
        commands: {
            top: true,
            rank: true
        }
    },
    social: {
        enabled: true,
        commands: {
            twitter: {
                enabled: true,
                sub: true,
                unsub: true,
                list: true
            },
            reddit: true
        }
    },
    messages: messages
  }
};
export default config;