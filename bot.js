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
    `Salom ${firstName}! 👋\n\nMen admin bilan bog‘lovchi botman. Menga yozgan xabaringiz adminga yuboriladi.`
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

// Oddiy xabarlarni qayta ishlash
bot.on("message", (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name || "User";
  const userName = msg.from.username || "username yo‘q";

  if (chatId.toString() === ADMIN_CHAT_ID) return;

  bot.sendMessage(
    chatId,
    "✅ Xabaringiz adminga yuborildi. Tez orada javob olasiz!"
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

  if (msg.photo || msg.document || msg.video || msg.voice) {
    bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id).then((sentMsg) =>
      addToMessageMap(sentMsg.message_id, {
        chatId,
        messageId: msg.message_id,
        firstName,
        userName,
      })
    );
  }
});

// Railway server porti (majburiy)
app.get("/", (req, res) => {
  res.send("✅ Bot Railway’da ishlayapti!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server ${PORT}-portda ishga tushdi`));


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
