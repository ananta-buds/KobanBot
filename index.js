require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');
const messages = require('./messages');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', async () => {
  console.log(`Bot logado como ${client.user.tag}`);

  const channel = await client.channels.fetch(process.env.CHANNEL_RULES_ID);

  // Verifica se já existe uma mensagem do bot no canal
  const messages = await channel.messages.fetch({ limit: 50 });
  const existingMessage = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.embeds.length > 0 &&
    msg.embeds[0].title === '📜 Server Rules'
  );

  if (existingMessage) {
    console.log('Mensagem de regras já existe, não enviando novamente.');
    return;
  }

  const button = new ButtonBuilder()
    .setCustomId('accept_rules')
    .setLabel('✅ Accept')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  const embed = new EmbedBuilder()
    .setTitle('📜 Server Rules')
    .setDescription(messages.rules)
    .setColor('#00ff00');

  await channel.send({
    embeds: [embed],
    components: [row],
  });

  console.log('Mensagem de regras enviada.');
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'accept_rules') {
    const role = interaction.guild.roles.cache.get(process.env.ROLE_COMER_ID);

    if (!role) {
      await interaction.reply({ content: '❌ Error, role not found.', ephemeral: true });
      return;
    }

    try {
      await interaction.deferUpdate();
      await interaction.member.roles.add(role);
    } catch (err) {
      console.error(err);
      await interaction.followUp({ content: '❌ Error, unable to add role.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
