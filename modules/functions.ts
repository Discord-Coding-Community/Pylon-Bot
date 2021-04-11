import { MEMBER_COUNT_CHANNEL } from '../config/configs';

export async function getLatency(cb: (...any: any[]) => Promise<any>) {
  const s = Date.now();
  await cb();
  return Date.now() - s;
}

pylon.tasks.cron('update_member_count', '0 0/5 * * * * *', async () => {
  const channel = await discord.getGuildVoiceChannel(MEMBER_COUNT_CHANNEL);
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
