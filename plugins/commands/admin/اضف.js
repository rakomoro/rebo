import moment from "moment-timezone";
import fs from "fs";
import path from "path";

const config = {
  name: "شيل",
  version: "1.0.0",
  credits: "مطور البوت",
  permissions: [2],
  description: "أمر shell للتحكم في ملفات البوت",
  usages: "shell [الأمر]",
  cooldowns: 5,
};

let currentDir = __dirname;

async function handleReply({ eventData, message }) {
  const { body } = message;
  const { listCommands } = eventData;
  const args = body.replace(/ +/g, " ").toLowerCase().split(" ");
  const command = args[0];

  if (command === "ls") {
    const files = fs.readdirSync(currentDir);
    message.reply(files.join("\n"));
  } else if (command === "get") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isFile() && /\.(jpg|jpeg|png|gif)$/.test(fileName)) {
        message.reply({ attachment: fs.createReadStream(filePath) });
      } else {
        const fileContent = fs.readFileSync(filePath, "utf8");
        message.reply(fileContent);
      }
    } else {
      message.reply("الملف غير موجود");
    }
  } else if (command === "del") {
    const fileName = args[1];
    const filePath = path.join(currentDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      message.reply("تم حذف الملف");
    } else {
      message.reply("الملف غير موجود");
    }
  } else if (command === "mkdir") {
    const dirName = args[1];
    const newDir = path.join(currentDir, dirName);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
      message.reply("تم إنشاء المجلد");
    } else {
      message.reply("المجلد موجود بالفعل");
    }
  } else if (command === "rename") {
    const oldName = args[1];
    const newName = args[2];
    const oldPath = path.join(currentDir, oldName);
    const newPath = path.join(currentDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      message.reply("تم إعادة تسمية الملف");
    } else {
      message.reply("الملف غير موجود");
    }
  } else if (command === "write") {
    const fileName = args[1];
    const fileContent = args.slice(2).join(" ");
    const filePath = path.join(currentDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    message.reply("تم كتابة الملف");
  } else if (command === "cd") {
    const dirName = args[1];
    if (dirName === "..") {
      currentDir = path.dirname(currentDir);
      message.reply(`تم تغيير المجلد إلى ${currentDir}`);
    } else {
      const newDir = path.join(currentDir, dirName);
      if (fs.existsSync(newDir) && fs.lstatSync(newDir).isDirectory()) {
        currentDir = newDir;
        message.reply(`تم تغيير المجلد إلى ${currentDir}`);
      } else {
        message.reply("المجلد غير موجود");
      }
    }
  }
}

async function onCall({ message }) {
  const listCommands = [
    "ls",
    "get",
    "del",
    "mkdir",
    "rename",
    "write",
    "cd",
  ];
  let msg = "";
  let i = 0;
  for (const command of listCommands) {
    i++;
    msg += `\n${i}. ${command}`;
  }
  message.reply(`${msg}\nReply this message with command to execute`).then((d) =>
    d.addReplyEvent({
      callback: handleReply,
      listCommands,
    })
  );
}

export { onCall, config };
