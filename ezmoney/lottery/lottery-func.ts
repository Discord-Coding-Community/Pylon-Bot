// not currently in use

import * as def from '../config/setup';
import * as op from '../config/functions';
import * as inventory from '../inventory/inv-setup';
import * as invfunc from '../inventory/func';
import * as myserver from '../config/myserver';
import obc from '../config/setup';

export const LOTTERY_TIME_MINUTES = 30;

export const nextDrawText = () => {
  const nextDraw =
    (Math.ceil(Date.now() / 1000 / 60 / LOTTERY_TIME_MINUTES) *
      1000 *
      60 *
      LOTTERY_TIME_MINUTES -
      Date.now()) /
    1000 /
    60;

  const hours = Math.floor(nextDraw) / 60;
  const minutes = Math.floor(nextDraw);
  const seconds = Math.floor((nextDraw % 1) * 60);
  return `next draw is in ${minutes} ${
    minutes === 1 ? 'minute' : 'minutes'
  } and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}. ${Math.round(
    hours
  )} hours`;
};

export const lottery = obc.subcommandGroup({
  name: 'lottery',
  description: 'command group for the lottery commands.'
});

export async function getCurrentLottery(lotteryKey: discord.Snowflake) {
  const lottery = await def.tempStorageKV.get<myserver.IMyServer>(lotteryKey);
  return lottery?.lotteryAmt ?? 0;
}

export async function getTotalPartic(lotteryKey: discord.Snowflake) {
  const ltry = await getCurrentLottery(lotteryKey);
  return ltry / 250;
}
