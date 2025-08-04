import { readdirSync, statSync, unlinkSync, existsSync, readFileSync} from "fs";
import { resolve, basename} from "path";

const config = {
  name: "كمندس",
  permissions: [2],
  description: "أوامر إدارة داخلية للملفات أو البيئة",
  usage: "[ls/cd/del/get/cer] [path]",
  credits: "Copilot & Xavia",
  cooldown: 5,
};

async function onCall({ message, args}) {
  const { threadID} = message;
  const command = args[0]?.toLowerCase();
  const target = args.slice(1).join(" ").trim();

  const root = process.cwd();

  // 🔒 دالة لحماية المسار داخل الجذر فقط
  function safePath(p = "") {
    const resolved = resolve(root, p);
    if (!resolved.startsWith(root)) throw new Error("📛 مسار غير آمن خارج الجذر.");
    return resolved;
}

  try {
    switch (command) {
      case "ls": {
        const dirPath = target? safePath(target): root;
        if (!existsSync(dirPath)) return message.reply("📁 المسار غير موجود.");
        if (!statSync(dirPath).isDirectory()) return message.reply("❌ هذا ليس مجلد.");

        const contents = readdirSync(dirPath);
        if (contents.length === 0) return message.reply("📂 المجلد فارغ.");
        return message.reply(`📦 محتويات ${basename(dirPath)}:\n• ${contents.join("\n• ")}`);
}

      case "cd": {
        const checkPath = safePath(target);
        if (!existsSync(checkPath) ||!statSync(checkPath).isDirectory()) {
          return message.reply("❌ المسار غير موجود أو ليس مجلد.");
}
        return message.reply(`📌 المسار صالح: ${checkPath}`);
}

      case "del": {
        const file = safePath(target);
        if (!existsSync(file)) return message.reply("🗑️ الملف غير موجود.");
        if (statSync(file).isDirectory()) {
          return message.reply("🚫 لا يمكن حذف مجلد بهذه الطريقة.");
}
        unlinkSync(file);
        return message.reply(`✅ تم حذف الملف: ${basename(file)}`);
}

      case "get": {
        const file = safePath(target);
        if (!existsSync(file) || statSync(file).isDirectory()) {
          return message.reply("📄 الملف غير موجود أو المسار يشير إلى مجلد.");
}
        const content = readFileSync(file, "utf8").slice(0, 1500);
        return message.reply(`📄 محتوى ${basename(file)}:\n${content}`);
}

      case "cer": {
        return message.reply(`🧠 بيئة التشغيل:\n• Node: ${process.version}\n• Platform: ${process.platform}\n• RAM Used: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
}

      default:
        return message.reply("🌀 الأمر غير معروف. استخدم: ls, cd, del, get, cer");
}
} catch (err) {
    console.error("❌ خطأ في تنفيذ الأمر:", err);
    return message.reply("⚠️ حدث خلل أثناء تنفيذ العملية.");
}
}

export default {
  config,
  onCall,
};
