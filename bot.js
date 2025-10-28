const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

// Muhit o'zgaruvchilari
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN topilmadi!");
  process.exit(1);
}

if (!ADMIN_CHAT_ID) {
  console.error("❌ ADMIN_CHAT_ID topilmadi!");
  process.exit(1);
}

// Botni ishga tushiramiz
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const messageMap = new Map();
const MAX_MESSAGE_MAP_SIZE = 1000;

function addToMessageMap(messageId, data) {
  if (messageMap.size >= MAX_MESSAGE_MAP_SIZE) {
    const firstKey = messageMap.keys().next().value;
    messageMap.delete(firstKey);
  }
  messageMap.set(messageId, data);
}

console.log("🤖 Bot ishga tushdi!");
console.log(`📨 Barcha xabarlar admin (${ADMIN_CHAT_ID})ga yuboriladi.`);

// /start buyrug‘i
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "Foydalanuvchi";

bot.sendMessage(
    chatId,
    `Salom ${firstName}! 👋\n\nMen @vaunut egasiga xabar yuboruvchi botman. \n\nXabaringizni yozing:`
  );

  bot.sendMessage(
    ADMIN_CHAT_ID,
    `🆕 Yangi foydalanuvchi bot bilan bog‘landi:\n👤 ${firstName}\n@${msg.from.username || "username yo‘q"}\n🆔 ${msg.from.id}`
  );
});

// Adminning /reply buyrug‘i
bot.onText(/\/reply (\d+) (.+)/s, (msg, match) => {
  if (msg.chat.id.toString() !== ADMIN_CHAT_ID) return;

  const targetChatId = parseInt(match[1]);
  const replyText = match[2];

  bot
    .sendMessage(targetChatId, `📬 Admin javob berdi:\n\n${replyText}`)
    .then(() =>
      bot.sendMessage(
        ADMIN_CHAT_ID,
        `✅ Javob yuborildi foydalanuvchiga (Chat ID: ${targetChatId})`
      )
    )
    .catch((error) =>
      bot.sendMessage(
        ADMIN_CHAT_ID,
        `❌ Xatolik: ${error.message}\nChat ID: ${targetChatId}`
      )
    );
});

// Oddiy xabarlarni qayta ishlash va o'ziga reply qilish
bot.on("message", (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name || "User";
  const userName = msg.from.username || "username yo‘q";

  // Admin bo‘lgan foydalanuvchidan kelgan xabarni qayta ishlash
  if (chatId.toString() === ADMIN_CHAT_ID) return;

  // Foydalanuvchidan kelgan xabarga reply qilish
  bot.sendMessage(
    chatId,
    `✅ Xabaringiz admin tomonidan qabul qilindi! Sizning xabaringizga admin tez orada javob beradi.`
  );

  let forwardText = `📩 Yangi xabar!\n\n👤 ${firstName}\n@${userName}\n🆔 ${userId}\n💬 ${msg.text || "[Media]"}\n\n/reply ${chatId} <javob>`;
  bot.sendMessage(ADMIN_CHAT_ID, forwardText).then((sentMsg) => {
    addToMessageMap(sentMsg.message_id, {
      chatId,
      messageId: msg.message_id,
      firstName,
      userName,
    });
  });

  // Media fayllar uchun ham reply
  if (msg.photo || msg.document || msg.video || msg.voice) {
    bot
      .forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id)
      .then((sentMsg) => {
        addToMessageMap(sentMsg.message_id, {
          chatId,
          messageId: msg.message_id,
          firstName,
          userName,
        });
      });
  }

  // Kelgan xabarga reply qilish (admin javobini yuborish)
  if (msg.text) {
    bot.sendMessage(chatId, `📬 Admin: "${msg.text}"`);
  } else if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1].file_id;
    bot.sendPhoto(chatId, photo, {
      caption: msg.caption || "📬 Admin javobi:",
    });
  } else if (msg.document) {
    bot.sendDocument(chatId, msg.document.file_id, {
      caption: msg.caption || "📬 Admin javobi:",
    });
  } else if (msg.video) {
    bot.sendVideo(chatId, msg.video.file_id, {
      caption: msg.caption || "📬 Admin javobi:",
    });
  }
});

// Railway server porti (majburiy)
app.get("/", (req, res) => {
  res.send("✅ Bot Railway’da ishlayapti!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server ${PORT}-portda ishga tushdi`));
