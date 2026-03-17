import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

// Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Register slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('workers')
    .setDescription('Check Sentinel status')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: commands }
    );

    console.log('✅ Slash commands registered');
  } catch (error) {
    console.error(error);
  }
})();

// When bot starts
client.once('ready', async () => {
  console.log(`🔥 Sentinel ONLINE as ${client.user.tag}`);

  // Update Sentinel status in DB
  await supabase
    .from('workers')
    .update({
      status: 'online',
      last_seen_at: new Date().toISOString()
    })
    .eq('slug', 'sentinel');

  // Log startup event
  await supabase.from('events').insert({
    type: 'status',
    payload: {
      message: 'Sentinel connected',
      time: new Date().toISOString()
    }
  });
});

// Slash command handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'workers') {
    await interaction.reply('🧠 Sentinel ONLINE + Supabase connected');

    // Log command
    await supabase.from('events').insert({
      type: 'command',
      payload: {
        command: '/workers',
        user: interaction.user.username,
        time: new Date().toISOString()
      }
    });
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
