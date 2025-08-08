import fetch from 'node-fetch';

let mutedUsers = new Set();

let handler = async (m, { conn, participants, isAdmin, isOwner, isBotAdmin, usedPrefix, command }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn);
  if (!isBotAdmin) return global.dfail('botAdmin', m, conn);

  const isMute = command === 'muteall';
  const thumbUrl = isMute
    ? 'https://telegra.ph/file/f8324d9798fa2ed2317bc.png'
    : 'https://telegra.ph/file/aea704d0b242b8c41bf15.png';

  const thumbBuffer = await fetch(thumbUrl).then(res => res.buffer());

  const preview = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: m.chat
    },
    message: {
      locationMessage: {
        name: isMute ? 'Modo silencio activado' : 'Silencio desactivado',
        jpegThumbnail: thumbBuffer
      }
    }
  };

  let affected = 0;

  for (let user of participants) {
    const jid = user.id;

    if (isMute) {
      // Mutea a todos excepto al que ejecuta
      if (jid !== m.sender && !mutedUsers.has(jid)) {
        mutedUsers.add(jid);
        affected++;
      }
    } else {
      // Desmutea a todos
      if (mutedUsers.has(jid)) {
        mutedUsers.delete(jid);
        affected++;
      }
    }
  }

  const text = isMute
    ? `🔇 *Modo silencio activado*\nSe muteó a *${affected}* miembros del grupo.`
    : `🔊 *Silencio desactivado*\nSe desmuteó a *${affected}* miembros del grupo.`;

  await conn.sendMessage(m.chat, { text, mentions: participants.map(p => p.id) }, { quoted: preview });
};

// 🔥 Borra automáticamente TODO mensaje (texto, fotos, videos, stickers, etc) de los muteados
handler.before = async function (m, { conn }) {
  if (!m.isGroup || m.fromMe) return;

  if (mutedUsers.has(m.sender)) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      // ignorar errores si ya fue eliminado o no tiene permisos
    }
  }
};

handler.help = ['muteall', 'unmuteall'];
handler.tags = ['group'];
handler.command = /^(muteall|unmuteall)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;