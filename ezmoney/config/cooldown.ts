// not in use currently

import { tempStorageKV } from './setup';

export interface IUserCooldowns extends pylon.JsonObject {
  lastBeg: any;
  lastSearch: any;
  lastDaily: any;
  lastWeekly: any;
  lastRob: any;
  lastVictim: any;
  lastMine: any;
}

export function instanceOfA(object: any): object is IUserCooldowns {
  return 'lastBeg' in object;
}

const a: any = {
  lastBeg: null,
  lastSearch: null,
  lastDaily: null,
  lastWeekly: null,
  lastRob: null,
  lastVictim: null,
  lastMine: null
};

const c = new discord.command.CommandGroup();

c.raw('t', async (message) => {
  if (instanceOfA(a)) {
    await tempStorageKV.put(`${message.author?.id}`, a.lastBeg, { ttl: 500 });
  }
});
