import { readdirSync, statSync, unlinkSync, existsSync, readFileSync} from "fs";
import { join, resolve} from "path";

const config = {
  name: "كمندس",
  permissions: [2],
  description: "أوامر إدارة داخلية للملفات أو البيئة",
  usage: "[ls/cd/del/cer/get] [path]",
  credits: "Copilot & Xavia",
  cooldown: 5
};

async function onCall({ message, args}) {
  const { threadID, senderID} = message;
  const command = args[0]?.toLowerCase();
  const target = args.slice(1).join(" ");

  const safeRoot = process.cwd(); // الجذر الآمن للمشروع

  function safePath(pathInput) {
    return resolve(safeRoot, pathInput);
}

  try {
    switch (command) {
      case "ls": {
        const pathToList = target? safePath(target): safeRoot;
        if (!existsSync(pathToList)) return message.reply("📁 المسار غير موجود.");
        const files = readdirSync(pathToList);
        return message.reply(`📂 المحتويات:\n${files.join("\n")}`);
}

      case "cd": {
        const pathToCheck = safePath(target);
        if (!existsSync(pathToCheck) ||!statSync(pathToCheck).isDirectory()) {
          return message.reply("❌ المسار غير صالح أو غير موجود.");
}
        return message.reply(`✅ تم التحقق من المسار: ${pathToCheck}`);
}

      case "del": {
        const fileToDelete = safePath(target);
        if (!existsSync(fileToDelete)) return message.reply("🗑️ الملف غير موجود.");
        unlinkSync(fileToDelete);
        return message.reply(`✅ تم حذف الملف: ${target}`);
}

      case "get": {
        const fileToRead = safePath(target);
        if (!existsSync(fileToRead)) return message.reply("📄 الملف غير موجود.");
        const content = readFileSync(fileToRead, "utf-8");
        return message.reply(`📄 محتوى الملف:\n${content.slice(0, 1500)}`);
}

      case "cer": {
        return message.reply(`📜 تفاصيل البيئة:\nNode: ${process.version}\nPlatform: ${process.platform}\nMemory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

      default:
        return message.reply("❓ الأمر غير معروف. استخدم: ls, cd, del, get, cer");
}
} catch (err) {
    console.error("Shell error:", err);
    return message.reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
}
}

export default {
  config,
  onCall
};
