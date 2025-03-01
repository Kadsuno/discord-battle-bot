const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Lade Umgebungsvariablen
dotenv.config();

// Erstelle einen neuen Client mit den notwendigen Intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB! ✨');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Bot ist bereit
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const activities = [
    'with Senpai! uwu',
    'Watching Anime >w<',
    'Making Bento (｡♥‿♥｡)',
    'Reading Manga (●´ω｀●)',
    'Waiting for your commands desu~'
  ];

  setInterval(() => {
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(randomActivity);
  }, 30000);
});

client.commands = new Collection();

// Lade Command Handler
require('./handlers/commandHandler')(client);

// Nach dem Command Handler
require('./handlers/eventHandler')(client);

// Nachricht empfangen
client.on('messageCreate', async message => {
  // Ignoriere Nachrichten von Bots
  if (message.author.bot) return;

  const prefix = '!'; // Dein gewünschter Prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply('Gomen ne! I made a mistake! (╥﹏╥)');
  }
});

// Bot einloggen
client.login(process.env.DISCORD_TOKEN);
