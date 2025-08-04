import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export default async function ({ message}) {
  const prefix = global.config.PREFIX || "!"; // ← تأكد من وجود قيمة
  const imageURL = "https://i.postimg.cc/3xKMPPMY/image.jpg"; // ← رابط الصورة اللي تبغى ترسلها
  const imageName = `info_${Date.now()}.jpg`;
  const imagePath = path.join(__dirname, "cache", imageName);

  // إنشاء مجلد cache لو مفقود
  fs.ensureDirSync(path.dirname(imagePath));

  // تحميل الصورة
  try {
    const res = await axios.get(imageURL, { responseType: "arraybuffer"});
    fs.writeFileSync(imagePath, res.data);

    // الرسالة
    const content = `❀━━━━〖 مـشـمـش 〗━━━━❀\n\n معلومات البوت ✨   \n\n════════❍════════\n\n  اسم البوت: مشمش \n\n════════❍════════\n\n اسم المطور: صلاح الدين \n\n════════❍════════\n\n رابط حساب المطور: https://www.facebook.com/Rako.San.r.s \n\n════════❍════════\n\n  ${prefix}اوامر لرؤية قائمة الأوامر.\n`;

    await message.reply({
      body: content,
      attachment: fs.createReadStream(imagePath)
});

    // حذف الصورة بعد الإرسال
    fs.unlinkSync(imagePath);
} catch (error) {
    console.error("❌ فشل تحميل الصورة أو إرسالها:", error);
    message.reply(`❀━━━━〖 مـشـمـش 〗━━━━❀\n\n معلومات البوت بدون صورة:\n${prefix}اوامر لرؤية القائمة.`);
}
                              }
