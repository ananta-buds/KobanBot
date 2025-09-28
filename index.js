const KobanBot = require('./src/index');

const bot = new KobanBot();
bot.start().catch(error => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
