import { writeFileSync, readFileSync, unlinkSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const config = {
  name: "تحكم",
  description: "تـحـكـم في ملفات البوت مباشرة (للمطور فقط)",
  usage: "شيل [ls/cd/del/get/cer] [اسم/مسار/كود]",
  credits: "Perplexity",
  cooldown: 5
};

const OWNER_ID = '61553754531086'; // غيره لـ ID بتاعك

let currentPath = process.cwd();

async function onCall({ message, args, senderID }) {
  if (senderID!= OWNER_ID) return message.reply("الأمر للمطور فقط يا أسطورة! 🚫");

  const [cmd,...rest] = args;
  if (!cmd) return message.reply("حدد الأمر بعدها اسم الملف/المجلد.");

  try {
    if (cmd === "ls") {
      let dir = rest? resolve(currentPath, rest): currentPath;
      const files = readdirSync(dir);
      message.reply(`📁 محتويات ${dir}:\n` + files.join('\n'));
    } else if (cmd === "cd") {
      let target = rest;
      if (target === ".." || target === "../") currentPath = resolve(currentPath, "..");
      else currentPath = resolve(currentPath, target);
      process.chdir(currentPath);
      message.reply(`📂 انت الآن في: ${currentPath}`);
    } else if (cmd === "get") {
      let filePath = resolve(currentPath, rest);
      if (!existsSync(filePath)) return message.reply("مافي ملف بالإسم ده!");
      message.reply({
        body: `📄 جاهز ليك (${rest}):`,
        attachment: readFileSync(filePath)
      });
    } else if (cmd === "cer") {
      let fileName = rest;
      let content = rest.slice(1).join(" ") || "// ملف جديد";
      let filePath = resolve(currentPath, fileName);
      writeFileSync(filePath, content);
      message.reply(`🎉 تم إنشاء ${fileName}:\n${content}`);
    } else if (cmd === "del") {
      let filePath = resolve(currentPath, rest);
      if (!existsSync(filePath)) return message.reply("الملف غير موجود!");
      unlinkSync(filePath);
      message.reply(`🗑️ حذفنا ليك ${rest} خلاص!`);
    } else {
      message.reply("الأوامر المدعومة: ls, cd, get, cer, del");
    }
  } catch (e) {
    message.reply("💥 حصل خطأ: " + e.message);
  }
}

export default {
  config,
  onCall
}
