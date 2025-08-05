import fs from "fs";
const path = "./comandos.json";

export async function before(m, { conn }) {
  if (!m.message?.stickerMessage?.fileSha256) return;

  const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
  const fileSha = m.message.stickerMessage.fileSha256.toString("base64");
  const comando = data[fileSha];

  if (comando) {
    const commandName = comando.split(" ")[0].toLowerCase();
    const args = comando.split(" ");

    m.text = "." + comando;
    m.command = commandName;

    const plugin = Object.values(global.plugins).find(
      plugin =>
        typeof plugin?.command === "string" ? plugin.command === commandName :
        plugin.command instanceof RegExp ? plugin.command.test(commandName) :
        Array.isArray(plugin.command) ? plugin.command.includes(commandName) : false
    );

    if (plugin) {
      try {
        await plugin(m, { conn, args, command: commandName, usedPrefix: ".", isOwner: false });
      } catch (e) {
        console.error("❌ Error al ejecutar el comando vinculado al sticker:", e);
        await conn.sendMessage(m.chat, {
          text: "⚠️ *Ocurrió un error al ejecutar el comando vinculado.*",
          quoted: m
        });
      }
    } else {
      await conn.sendMessage(m.chat, {
        text: "❌ *Comando vinculado no encontrado.*",
        quoted: m
      });
    }
  }
}