// === Import kutubxonalar ===
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();

// === Muhit o‘zgaruvchilari ===
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN muhit o‘zgaruvchisida topilmadi!");
  process.exit(1);
}

// === Botni webhook yoki polling orqali ishga tushirish ===
// Railway doimiy server, shuning uchun long polling ishlatish qulay:
const bot = new TelegramBot(TOKEN, { polling: true });

// === Bot buyruqlari ===
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "👋 Salom! Men Railway’da ishlaydigan Telegram botman.\n\nBuyruqlar:\n/start - Boshlash\n/help - Yordam"
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "🧭 Bu bot test maqsadida Railway’da ishlamoqda.");
});

// === Oddiy matnlarga javob ===
bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!text.startsWith("/")) {
    bot.sendMessage(chatId, `Siz yozdingiz: ${text}`);
  }
});

// === Express server (Railway uchun kerak) ===
app.get("/", (req, res) => {
  res.send("✅ Telegram bot Railway’da ishlayapti!");
});

// Railway server porti (Railway avtomatik PORT o‘zgaruvchisini beradi)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishga tushdi`));


// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// if (!BOT_TOKEN) {
//   console.error(
//     "Error: TELEGRAM_BOT_TOKEN is not set in environment variables",
//   );
//   process.exit(1);
// }

// if (!ADMIN_CHAT_ID) {
//   console.error("Error: ADMIN_CHAT_ID is not set in environment variables");
//   process.exit(1);
// }

// const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// const messageMap = new Map();
// const MAX_MESSAGE_MAP_SIZE = 1000;

// function addToMessageMap(messageId, data) {
//   if (messageMap.size >= MAX_MESSAGE_MAP_SIZE) {
//     const firstKey = messageMap.keys().next().value;
//     messageMap.delete(firstKey);
//   }
//   messageMap.set(messageId, data);
// }

// console.log("Bot started successfully!");
// console.log(`Forwarding all messages to admin: ${ADMIN_CHAT_ID}`);

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const firstName = msg.from.first_name || "User";

//   bot.sendMessage(
//     chatId,
//     `Salom ${firstName}! 👋\n\nMen @vaunut egasiga xabar yuboruvchi botman. Menga yozgan xabaringiz avtomatik ravishda admin ko'rib chiqishi uchun yuboriladi.\n\nXabaringizni yozing:`,
//   );

//   const adminNotification = `🆕 Yangi foydalanuvchi bot bilan aloqaga chiqdi!\n\nIsm: ${firstName}\nUsername: @${msg.from.username || "username yo'q"}\nUser ID: ${msg.from.id}\nTil: ${msg.from.language_code || "noma'lum"}\n\n/start buyrug'ini yubordi`;

//   bot.sendMessage(ADMIN_CHAT_ID, adminNotification);
// });

// bot.onText(/\/reply (\d+) (.+)/s, (msg, match) => {
//   const chatId = msg.chat.id;

//   if (chatId.toString() !== ADMIN_CHAT_ID) {
//     return;
//   }

//   const targetChatId = parseInt(match[1]);
//   const replyText = match[2];

//   bot
//     .sendMessage(targetChatId, `📬 Admin javob berdi:\n\n${replyText}`)
//     .then(() => {
//       bot.sendMessage(
//         ADMIN_CHAT_ID,
//         `✅ Javob yuborildi foydalanuvchiga (Chat ID: ${targetChatId})`,
//       );
//     })
//     .catch((error) => {
//       bot.sendMessage(
//         ADMIN_CHAT_ID,
//         `❌ Xatolik: ${error.message}\n\nChat ID: ${targetChatId}`,
//       );
//     });
// });

// bot.on("message", (msg) => {
//   if (msg.text && msg.text.startsWith("/")) {
//     return;
//   }

//   const chatId = msg.chat.id;
//   const userId = msg.from.id;
//   const userName = msg.from.username || "username yo'q";
//   const firstName = msg.from.first_name || "User";

//   if (chatId.toString() === ADMIN_CHAT_ID) {
//     if (msg.reply_to_message) {
//       const repliedToMessageId = msg.reply_to_message.message_id;

//       if (messageMap.has(repliedToMessageId)) {
//         const originalMessage = messageMap.get(repliedToMessageId);
//         const targetChatId = originalMessage.chatId;
//         const targetMessageId = originalMessage.messageId;

//         let replyPromise;

//         if (msg.text) {
//           replyPromise = bot.sendMessage(
//             targetChatId,
//             `📬 Admin javob berdi:\n\n${msg.text}`,
//             {
//               reply_to_message_id: targetMessageId,
//             },
//           );
//         } else if (msg.photo) {
//           const photo = msg.photo[msg.photo.length - 1].file_id;
//           replyPromise = bot.sendPhoto(targetChatId, photo, {
//             caption: msg.caption
//               ? `📬 Admin javob berdi:\n\n${msg.caption}`
//               : "📬 Admin javob berdi:",
//             reply_to_message_id: targetMessageId,
//           });
//         } else if (msg.document) {
//           replyPromise = bot.sendDocument(targetChatId, msg.document.file_id, {
//             caption: msg.caption
//               ? `📬 Admin javob berdi:\n\n${msg.caption}`
//               : "📬 Admin javob berdi:",
//             reply_to_message_id: targetMessageId,
//           });
//         } else if (msg.video) {
//           replyPromise = bot.sendVideo(targetChatId, msg.video.file_id, {
//             caption: msg.caption
//               ? `📬 Admin javob berdi:\n\n${msg.caption}`
//               : "📬 Admin javob berdi:",
//             reply_to_message_id: targetMessageId,
//           });
//         } else {
//           bot.sendMessage(
//             ADMIN_CHAT_ID,
//             "❌ Bu turdagi xabarni yuborib bo'lmadi",
//           );
//           return;
//         }

//         replyPromise
//           .then(() => {
//             bot.sendMessage(
//               ADMIN_CHAT_ID,
//               `✅ Javob yuborildi foydalanuvchiga: ${originalMessage.firstName}`,
//               {
//                 reply_to_message_id: msg.message_id,
//               },
//             );
//           })
//           .catch((error) => {
//             bot.sendMessage(ADMIN_CHAT_ID, `❌ Xatolik: ${error.message}`, {
//               reply_to_message_id: msg.message_id,
//             });
//           });
//       } else {
//         bot.sendMessage(
//           ADMIN_CHAT_ID,
//           "❌ Bu xabar uchun foydalanuvchi topilmadi. /reply buyrug'idan foydalaning:\n\n/reply <chat_id> <xabar>",
//           {
//             reply_to_message_id: msg.message_id,
//           },
//         );
//       }
//     }
//     return;
//   }

//   bot.sendMessage(
//     chatId,
//     "✅ Xabaringiz adminga yuborildi. Tez orada javob olasiz!",
//   );

//   let forwardMessage = `📩 Yangi xabar!\n\n`;
//   forwardMessage += `👤 Foydalanuvchi:\n`;
//   forwardMessage += `- Ismi: ${firstName}\n`;
//   forwardMessage += `- Username: @${userName}\n`;
//   forwardMessage += `- User ID: ${userId}\n`;
//   forwardMessage += `- Chat ID: ${chatId}\n\n`;
//   forwardMessage += `💬 Xabar:\n${msg.text || "[Media fayl]"}\n\n`;
//   forwardMessage += `📤 Javob berish:\n1️⃣ Ushbu xabarga reply qiling\n2️⃣ Yoki: /reply ${chatId} sizning javobingiz`;

//   bot.sendMessage(ADMIN_CHAT_ID, forwardMessage).then((sentMsg) => {
//     addToMessageMap(sentMsg.message_id, {
//       chatId: chatId,
//       messageId: msg.message_id,
//       userId: userId,
//       firstName: firstName,
//       userName: userName,
//     });
//   });

//   if (msg.photo) {
//     bot
//       .forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id)
//       .then((sentMsg) => {
//         addToMessageMap(sentMsg.message_id, {
//           chatId: chatId,
//           messageId: msg.message_id,
//           userId: userId,
//           firstName: firstName,
//           userName: userName,
//         });
//       });
//   }

//   if (msg.document || msg.video || msg.audio || msg.voice || msg.sticker) {
//     bot
//       .forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id)
//       .then((sentMsg) => {
//         addToMessageMap(sentMsg.message_id, {
//           chatId: chatId,
//           messageId: msg.message_id,
//           userId: userId,
//           firstName: firstName,
//           userName: userName,
//         });
//       });
//   }
// });

// bot.on("polling_error", (error) => {
//   console.error("Polling error:", error.message);
// });

// process.on("SIGINT", () => {
//   console.log("\nBot to'xtatilmoqda...");
//   bot.stopPolling();
//   process.exit(0);
// });
