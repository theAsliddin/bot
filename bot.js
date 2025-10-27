require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

if (!ADMIN_CHAT_ID) {
  console.error('Error: ADMIN_CHAT_ID is not set in environment variables');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('Bot started successfully!');
console.log(`Forwarding all messages to admin: ${ADMIN_CHAT_ID}`);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'User';
  
  bot.sendMessage(chatId, `Salom ${firstName}! 👋\n\nMen superadminga xabar yuborish botiman. Menga yozgan xabaringiz avtomatik ravishda admin ko'rib chiqishi uchun yuboriladi.\n\nXabaringizni yozing:`);
  
  const adminNotification = `🆕 Yangi foydalanuvchi bot bilan aloqaga chiqdi!\n\nIsm: ${firstName}\nUsername: @${msg.from.username || 'username yo\'q'}\nUser ID: ${msg.from.id}\nTil: ${msg.from.language_code || 'noma\'lum'}\n\n/start buyrug'ini yubordi`;
  
  bot.sendMessage(ADMIN_CHAT_ID, adminNotification);
});

bot.on('message', (msg) => {
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.username || 'username yo\'q';
  const firstName = msg.from.first_name || 'User';
  
  if (chatId.toString() === ADMIN_CHAT_ID) {
    return;
  }
  
  bot.sendMessage(chatId, '✅ Xabaringiz adminga yuborildi. Tez orada javob olasiz!');
  
  let forwardMessage = `📩 Yangi xabar!\n\n`;
  forwardMessage += `👤 Foydalanuvchi:\n`;
  forwardMessage += `- Ismi: ${firstName}\n`;
  forwardMessage += `- Username: @${userName}\n`;
  forwardMessage += `- User ID: ${userId}\n`;
  forwardMessage += `- Chat ID: ${chatId}\n\n`;
  forwardMessage += `💬 Xabar:\n${msg.text || '[Media fayl]'}`;
  
  bot.sendMessage(ADMIN_CHAT_ID, forwardMessage);
  
  if (msg.photo) {
    bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id);
  }
  
  if (msg.document || msg.video || msg.audio || msg.voice || msg.sticker) {
    bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id);
  }
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

process.on('SIGINT', () => {
  console.log('\nBot to\'xtatilmoqda...');
  bot.stopPolling();
  process.exit(0);
});
