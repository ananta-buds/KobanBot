const KuroukaiBot = require('./src/index');

const bot = new KuroukaiBot();
bot.start().catch(error => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
