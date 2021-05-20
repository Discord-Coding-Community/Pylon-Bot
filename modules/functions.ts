import { config } from '../../modules/config/cfg';

enum timeUnits {
  ns = 1e-6,
  μs = 1e-3,
  ms = 1,
  s = 1000,
  min = 1000 * 60,
  h = 1000 * 60 * 60,
  d = 1000 * 60 * 60 * 24,
  w = 1000 * 60 * 60 * 24 * 7,
  mth = 1000 * 60 * 60 * 24 * 30,
  y = 1000 * 60 * 60 * 24 * 365,
  a = 1000 * 60 * 60 * 24 * 365.25,
  dec = 1000 * 60 * 60 * 24 * 365 * 10,
  cen = 1000 * 60 * 60 * 24 * 365 * 100
}

const timeUnitsAlliases = {
  ns: ['nanosecond(s)', 'nanosec(s)'],
  μs: ['microsec(s)', 'microsecond(s)'],
  ms: ['millisecond(s)', 'millisec(s)'],
  s: ['sec(s)', 'second(s)'],
  min: ['minute(s)', 'm', 'min(s)'],
  h: ['hr(s)', 'hour(s)'],
  d: ['day(s)'],
  w: ['wk(s)', 'week(s)'],
  mth: ['mth(s)', 'month(s)'],
  y: ['year(s)'],
  a: ['julianyear(s)'],
  dec: ['decade(s)'],
  cen: ['cent(s)', 'century', 'centuries']
};

function TimeCalculator(
  time: string,
  size:
    | 'ns'
    | 'μs'
    | 'ms'
    | 's'
    | 'min'
    | 'h'
    | 'd'
    | 'w'
    | 'mth'
    | 'y'
    | 'a'
    | 'dec'
    | 'cen'
): number | undefined {
  if (time.split('').some((s) => !/[0-9.,:]/g.test(s))) return;

  if (!time.includes(':')) {
    if (isNaN(Number.parseFloat(time))) return;
    else return Number.parseFloat(time) * timeUnits[size];
  }

  const times: string[] = time.split(':');

  const firstTime: number = Number.parseInt(times[0]!);
  let secondTime: number = Number.parseInt(times[1]!);

  if (times.length !== 2 || isNaN(firstTime) || isNaN(secondTime)) return;

  if (times[1].toString().length < 2) secondTime *= 10;
  else
    while (secondTime.toString().length > 2)
      secondTime = Number.parseInt(secondTime / 10 + '');

  if (size === 'min')
    return firstTime * timeUnits['min'] + secondTime * timeUnits['s'];
  if (size === 'h')
    return firstTime * timeUnits['h'] + secondTime * timeUnits['min'];

  return;
}

export async function errorFn(
  context: discord.command.ICommandContextDeprecated,
  error: Error
) {
  console.error(error);
  if (error.name !== 'ArgumentError') {
    const error_message = `something unexpected happened (${error.name}: ${error.message})`;
    await context.message.reply(
      `${error_message}\n\`\`\`\n${error.stack}\`\`\``
    );
  } else {
    const missing_args_message = `i need the correct arguments (${error.name}: ${error.message})`;
    const usage = (context.command as any).argumentConfigList
      .map((e: any) => {
        const optional = (e[1].type as string).endsWith('Optional');
        const brackets = {
          left: optional ? '(' : '<',
          right: optional ? ')' : '>'
        };
        return `${brackets.left}${e[0]}: ${e[1].type}${brackets.right}`;
      })
      .join(' ');
    await context.message.reply(
      `${missing_args_message}
\`\`\`
${usage}
\`\`\``
    );
  }
}

export function CustomTimeStringToMS(time?: string): number | undefined {
  if (time === undefined) return;

  time = time
    .split(' ')
    .join('')
    .toLowerCase();

  for (const key in timeUnitsAlliases) {
    let finalTime: number | undefined;

    finalTime = TimeCalculator(time.replace(key, ''), key as any);
    if (finalTime !== undefined) return finalTime;

    for (const keys of timeUnitsAlliases[key as 'ms']) {
      if (keys.includes('(s)')) {
        finalTime = TimeCalculator(
          time.replace(keys.replace('(s)', 's'), ''),
          key as any
        );
        if (finalTime !== undefined) return finalTime;
        finalTime = TimeCalculator(
          time.replace(keys.replace('(s)', ''), ''),
          key as any
        );
        if (finalTime !== undefined) return finalTime;
      } else {
        finalTime = TimeCalculator(time.replace(keys, ''), key as any);
        if (finalTime !== undefined) return finalTime;
      }
    }
  }

  return;
}

export async function getLatency(cb: (...any: any[]) => Promise<any>) {
  const s = Date.now();
  await cb();
  return Date.now() - s;
}

pylon.tasks.cron('update_member_count', '0 0/5 * * * * *', async () => {
  const channel = await discord.getGuildVoiceChannel(
    config.modules.automated.memberCount.updateChannel.channel
  );
  if (!channel) {
    return;
  }

  const guild = await discord.getGuild(channel.guildId);
  if (!guild) {
    return;
  }

  await channel.edit({
    name: `👥｜Member Count: ${guild.memberCount.toLocaleString()}`
  });
});

async function timeUpdate() {
  var guild = await discord.getGuild();
  var roles = await guild.getRoles();

  var timeString = /GMT(?<off>[+-])(?<time>[\d.]{1,})+\:\s?[\d:]*$/is;

  roles.forEach((e: discord.Role) => {
    if (timeString.test(e.name)) {
      var regexMatches = e.name.match(timeString);
      if (regexMatches == null) return console.log(regexMatches);
      var GMToffset = Number(regexMatches[1] + regexMatches[2]);
      var time = new Date(new Date().getTime() + GMToffset * 3600 * 1000);
      e.edit({
        name: e.name.replace(
          timeString,
          `GMT$1$2: ${time.getUTCHours()}:${time.getUTCMinutes()}`
        )
      });
    }
  });
}

pylon.tasks.cron('time', '0 0/5 * * * * *', async () => {
  await timeUpdate();
  return;
});
