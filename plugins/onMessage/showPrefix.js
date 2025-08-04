import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const langData = {
  "en_US": {
    "prefix": `${global.config.NAME} رمز البوت هو: {prefix}`
}
};

// روابط صور ثابتة (PNG, JPG...) ← غير متحركة
const imageLinks = [
  "https://i.postimg.cc/nLD1Thdz/image.jpg",
  "https://i.postimg.cc/3xKMPPMY/image.jpg",
  "https://i.postimg.cc/3xKMPPMY/image.jpg"
];

async function onCall({ message, getLang, data}) {
  const messageBody = message.body.toLowerCase().trim();
  const prefixTriggers = ["prefix", "prefix?", "Prefix"];

  if (prefixTriggers.includes(messageBody) && message.senderID!== global.botID) {
    const prefix = data?.thread?.data?.prefix || global.config.PREFIX;

    // اختيار صورة عشوائية
    const selectedURL = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imageName = `prefix_${Date.now()}.jpg`; // اسم مؤقت للصورة
    const imagePath = path.join(__dirname, "cache", imageName);

    try {
      fs.ensureDirSync(path.dirname(imagePath)); // تأكد من وجود مجلد cache
      const res = await axios.get(selectedURL, { responseType: 'arraybuffer'});
      fs.writeFileSync(imagePath, res.data);

      await message.reply({
        body: getLang("prefix", { prefix}),
        attachment: fs.createReadStream(imagePath)
});

      fs.unlinkSync(imagePath); // حذف الصورة بعد الإرسال

} catch (error) {
      console.error("❌ خطأ أثناء تحميل أو إرسال الصورة:", error);
      await message.reply(getLang("prefix", { prefix}));
}
}
}

export default {
  langData,
  onCall
};
