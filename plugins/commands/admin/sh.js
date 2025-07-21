import { exec } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const config = {
  name: "تحكم",
  permissions: [2],
  description: "نفذ أوامر شيل عالسيرفر (للمطور فقط!)",
  usage: "شيل [ls/cd/del/get/cer] [مسار/اسم]",
  credits: "Perplexity",
  cooldown: 5
};

// لتحديد المطور فقط (اكتب ID بتاعك!!)
//const OWNER_ID = '61553754531086'; // عدلها لي ID بتاعك من فيسبوك

async function onCall({ message, args, senderID }) {
  //if (String(senderID)!== String(OWNER_ID)) return message.reply("فطرت؟   •-•");

  const command = args;
  const target = args.slice(1).join(" ") || "";

  // حماية أساسية
  if (/rm\s+-rf\s+\/|del\s+C:\/|rm\s+-rf\s+\./.test(target)) {
    return message.reply("عايز تمسح الدنيا كلها؟ مستحيل! 😜");
  }

  let cwd = process.cwd();

  try {
    if (command === "ls") {
      exec(`ls ${target}`, { cwd }, (err, stdout, stderr) => {
        if (err) return message.reply(`😅 خطأ: ${stderr}`);
        message.reply(`📁 محتوى المجلد:\n${stdout}`);
      });
    } else if (command === "cd") {
      let newDir = resolve(cwd, target);
      process.chdir(newDir);
      message.reply(`📂 تم التحويل إلى: ${newDir}`);
    } else if (command === "del") {
      if (!existsSync(target)) return message.reply("😕 الملف أو المجلد غير موجود!");
      unlinkSync(target);
      message.reply(`🗑️ تم حذف ${target} بنجاح!`);
    } else if (command === "get") {
      if (!existsSync(target)) return message.reply("💾 مافي ملف بهذا الاسم!");
      message.reply({
        body: "🎉 الملف وصل:",
        attachment: readFileSync(target)
      });
    } else if (command === "cer") {
      // جنّنك بشهادة فاضية مضروبة
      writeFileSync('cert.txt', "شهادة أسطورة الشيل مُنحت لمطور Xavia 🔥");
      message.reply({
        body: "🎓 خذ شهادتك يا زول!",
        attachment: readFileSync('cert.txt')
      });
    } else {
      message.reply("❓ الأوامر المدعومة: ls, cd, del, get, cer");
    }
  } catch (e) {
    message.reply(`💥 في خطأ: ${e.message}`);
  }
}

export default {
  config,
  onCall
}
