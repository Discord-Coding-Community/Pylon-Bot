export async function getLatency(cb: (...any: any[]) => Promise<any>) {
  const s = Date.now();
  await cb();
  return Date.now() - s;
}

const MEMBER_COUNT_CHANNEL = ' ';

pylon.tasks.cron('update_member_count', '0 0/5 * * * * *', async () => {
    const channel = await discord.getGuildVoiceChannel(' ');
    if (!channel) {
      return;
    }
  
    const guild = await discord.getGuild(channel.guildId);
    if (!guild) {
      return;
    }
  
    await channel.edit({
      name: `Member Count: ${guild.memberCount.toLocaleString()}`
    });
  });