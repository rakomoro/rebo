import fs from 'fs-extra';
import path from 'path';

const langData = {
  "en_US": {
    "prefix": `${global.config.NAME} رمز البوت هو: {prefix}`
  }
};

const localImages = [
  path.join(__dirname, "p1.jpg"),
  path.join(__dirname, "p2.jpg")
];

async function onCall({ message, getLang, data }) {
  const body = message.body?.toLowerCase()?.trim();
  const prefixTriggers = ["prefix", "prefix?", "prefix؟"];

  if (!prefixTriggers.includes(body) || message.senderID === global.botID) return;

  const prefix = data?.thread?.data?.prefix || global.config.PREFIX;
  const selectedImage = localImages[Math.floor(Math.random() * localImages.length)];

  if (!fs.existsSync(selectedImage)) {
    return message.reply(getLang("prefix", { prefix }));
  }

  try {
    await message.reply({
      body: getLang("prefix", { prefix }),
      attachment: fs.createReadStream(selectedImage)
    });
  } catch (err) {
    console.error("❌ فشل إرسال الصورة:", err);
    await message.reply(getLang("prefix", { prefix }));
  }
}

export default {
  langData,
  onCall
};
