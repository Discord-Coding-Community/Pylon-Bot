/* other-bot STORAGE + GENERAL SETUP */
export interface IUserInventory extends pylon.JsonObject {
  xp: number;
  bal: number;
  multi: number;
  //gambling
  amtGained: number;
  amtLost: number;
  gWins: number;
  gLosses: number;
  //stealing
  amtRobbed: number;
  amtPaid: number;
  rWins: number;
  rLosses: number;
  //sharing
  amtShared: number;
  amtRecieved: number;
  //shop items + config
  lock: number;
  mine: number;
  life: number;
  pick: number;
  gem: number;
  commonCrate: number;
  //equipped items
  lEquip: number;
  mEquip: number;
  mUse: number;
  //lottery
  lotteryInput: number;
}

export const userKV = new pylon.KVNamespace('userinfo');
export const tempStorageKV = new pylon.KVNamespace('tempstorage');

export const standards = {
  checkmark: '<:yes:718226032829923379>',
  currency: '<:Coin:772209883335491626>',
  settings: '<:settings:756612184120885380>',
  embeds: {
    general: 0x30bd88,
    lose: 0xdb5858,
    neutral: discord.decor.RoleColors.DARK_YELLOW
  },
  REWARDS: {
    DAILY_REWARD: 150,
    WEEKLY_REWARD: 1100,
    BAILOUT_REWARD: 250
  },
  TIMERS: {
    WEEKLY_INTERVAL: 168 * 60 * 60 * 1000,
    DALIY_INTERVAL: 24 * 60 * 60 * 1000,
    BET_INTERVAL: 20 * 5 * 5 * 10,
    BEG_INTERVAL: 160 * 5 * 5 * 10,
    TRIV_INTERVAL: 20 * 5 * 10 * 10,
    ROB_INTERVAL: 50 * 20 * 30 * 10,
    MINE_INTERVAL: 30 * 20 * 30 * 10
  },
  ranks: {
    s1: '**<:silver1:737395207208960081>  Silver I** (5 wins)',
    s2: '**<:silver2:737395651624829019> Silver II** (10 wins)',
    s3: '**<:silver3:737395711150260225> Silver III** (20 wins)',
    gambler: '<:gambler:794028886848569354>',
    merchant: ' <:merchant:795425671261978664>'
  },
  shopIcons: {
    lock: discord.decor.Emojis.LOCK,
    mine: discord.decor.Emojis.FIRECRACKER,
    life: discord.decor.Emojis.HEART,
    pick: discord.decor.Emojis.PICK,
    gem: discord.decor.Emojis.GEM,
    commonCrate: '<:crate:760939184562503731>'
  }
};

export const slots = [
  ':trident:',
  ':fleur_de_lis:',
  ':gem:',
  ':heartpulse:',
  ':heart:',
  ':globe_with_meridians:',
  ':sparkling_heart:',
  ':cupid:',
  ':gift_heart:'
];

export const betaUsers = [
  '485489103870230528',
  '483784085613969439',
  '552878658407235594',
  '344955957627060225'
];
// level sys
export const xpGainCooldowns: Map<string, number> = new Map();
export const levelScale = 0.15;
/* Level Rewards are defined here
This will grant the User 1000 Coins at level 5 */
export const levelRewards: Map<number, string> = new Map([
  [1, '250'],
  [5, '1000'],
  [10, '2250'],
  [15, '4000'],
  [20, '9000'],
  [25, '15000'],
  [30, '25000']
]);
/* More Level Rewards
This will grant the User +1% multiplier at level 5 */
export const multiplierIncByLevel: Map<number, string> = new Map([
  [5, '1'],
  [10, '1'],
  [15, '1'],
  [20, '1'],
  [25, '1'],
  [35, '1'],
  [50, '4']
]);

// commands declaration
export const PREFIX = '.';
export const obc = new discord.command.CommandGroup({
  defaultPrefix: PREFIX
});
export default obc;
