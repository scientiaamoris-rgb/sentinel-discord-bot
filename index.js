import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Sentinel ONLINE as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'workers') {
    await interaction.reply('🧠 Sentinel ONLINE (cloud mode)');
  }
});

client.login(process.env.DISCORD_TOKEN);
