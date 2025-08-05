import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, args, text }) => {
  // Verifica si se respondió a un sticker
  if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
    return conn.sendMessage(m.chat, {
      text: '❌ *Responde a un sticker para vincularlo con un comando.*'
    }, { quoted: m });
  }

  // Verifica si hay texto de comando
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: '⚠️ *Debes escribir el comando que quieres vincular al sticker.*\n\nEjemplo:\n*.addco kick*'
    }, { quoted: m });
  }

  // Obtiene el ID único del sticker (SHA256)
  let fileSha = m.quoted.msg.fileSha256?.toString('base64');
  if (!fileSha) {
    return conn.sendMessage(m.chat, {
      text: '❌ *No se pudo obtener la firma del sticker.*'
    }, { quoted: m });
  }

  // Carga o crea base de datos
  const file = './comandos.json';
  let db = {};
  if (fs.existsSync(file)) {
    try {
      db = JSON.parse(fs.readFileSync(file));
    } catch {
      db = {};
    }
  }

  // Guarda el comando asignado
  db[fileSha] = text.trim();
  fs.writeFileSync(file, JSON.stringify(db, null, 2));

  // Respuesta
  await conn.sendMessage(m.chat, {
    text: `✅ *Sticker vinculado con éxito al comando:* \`${text.trim()}\``,
    quoted: m
  });
};

handler.command = ['addco'];
handler.help = ['addco <comando>'];
handler.tags = ['tools'];

export default handler;