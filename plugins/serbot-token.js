import fs from "fs";
import path from "path";

const handler = async (m, { conn, args, isOwner }) => {
  const chatId = m.chat;
  const isGroup = chatId.endsWith("@g.us");
  const senderId = m.sender;

  // ✅ Verifica permisos solo si es grupo
  if (isGroup && !isOwner) {
    const groupMetadata = await conn.groupMetadata(chatId);
    const participant = groupMetadata.participants.find(p => p.id === senderId);
    const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";

    if (!isAdmin) {
      return conn.sendMessage(chatId, {
        text: "🚫 *Solo los administradores o el owner pueden usar este comando.*"
      }, { quoted: m });
    }
  }

  // ✅ Asegura que se responda a un sticker
  const q = m.quoted || m.msg?.contextInfo?.quotedMessage;
  if (!q?.stickerMessage) {
    return conn.sendMessage(chatId, {
      text: "❌ *Responde a un sticker para vincularlo con un comando.*"
    }, { quoted: m });
  }

  // ✅ Verifica que haya comando
  const comando = args.join(" ").trim();
  if (!comando) {
    return conn.sendMessage(chatId, {
      text: "⚠️ *Especifica el comando a asignar. Ejemplo:* `.addco menu`"
    }, { quoted: m });
  }

  // ✅ Obtiene el SHA del sticker
  const fileSha = q.stickerMessage.fileSha256?.toString("base64");
  if (!fileSha) {
    return conn.sendMessage(chatId, {
      text: "❌ *No se pudo obtener el identificador del sticker.*"
    }, { quoted: m });
  }

  // ✅ Guarda en el JSON
  const jsonPath = path.resolve("./comandos.json");
  const data = fs.existsSync(jsonPath)
    ? JSON.parse(fs.readFileSync(jsonPath))
    : {};

  data[fileSha] = comando;
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  // ✅ Confirmación
  await conn.sendMessage(chatId, {
    react: { text: "✅", key: m.key }
  });

  return conn.sendMessage(chatId, {
    text: `✅ *Sticker vinculado exitosamente al comando:* \`${comando}\``,
    quoted: m
  });
};

handler.command = ["addco"];
handler.tags = ["tools"];
handler.help = ["addco <comando>"];

export default handler;