const fs = require("fs");
const path = require("path");

const jsonPath = path.resolve("./comandos.json");
const data = fs.existsSync(jsonPath)
  ? JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
  : {};

const handler = async (msg, { conn }) => {
  if (!msg.message?.stickerMessage?.fileSha256) return;

  const fileSha = msg.message.stickerMessage.fileSha256.toString("base64");
  const comando = data[fileSha];

  if (comando) {
    // Ejecutamos el comando vinculado como si lo escribieran
    msg.text = `.${comando}`; // o el prefijo que uses
    const commandName = comando.split(" ")[0].toLowerCase();

    const plugin = Object.values(global.plugins).find(
      plugin => plugin?.command instanceof RegExp
        ? plugin.command.test(commandName)
        : Array.isArray(plugin.command)
          ? plugin.command.includes(commandName)
          : plugin.command === commandName
    );

    if (plugin) {
      await plugin(msg, { conn, args: comando.split(" "), usedPrefix: ".", command: commandName });
    } else {
      await conn.sendMessage(msg.key.remoteJid, {
        text: "❌ *No se encontró el comando vinculado.*",
        quoted: msg
      });
    }
  }
};

module.exports = { before: handler };