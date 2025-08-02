import fetch from 'node-fetch'

let mutedUsers = new Set();

let handler = async (m, { conn, isAdmin, isOwner, isBotAdmin, args }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return;
  if (!isBotAdmin) return;

  let text = m.text.toLowerCase();
  if (!text.startsWith('mute') && !text.startsWith('unmute')) return;

  let user;
  if (m.quoted) {
    user = m.quoted.sender;
  } else if (m.mentionedJid?.[0]) {
    user = m.mentionedJid[0];
  } else {
    return m.reply('⚠️ Usa: mute @usuario o responde a su mensaje.');
  }

  if (user === m.sender) return m.reply('❌ No puedes mutearte o desmutearte a ti mismo.');

  const isMute = text.startsWith('mute');
  const thumbnailUrl = isMute
    ? 'https://telegra.ph/file/f8324d9798fa2ed2317bc.png'
    : 'https://telegra.ph/file/aea704d0b242b8c41bf15.png';

  const thumbBuffer = await fetch(thumbnailUrl).then(res => res.buffer());

  const preview = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: m.chat
    },
    message: {
      locationMessage: {
        name: isMute ? 'Usuario mutado' : 'Usuario desmuteado',
        jpegThumbnail: thumbBuffer
      }
    }
  };

  if (isMute) {
    mutedUsers.add(user);
    await conn.sendMessage(m.chat, { text: '*Tus mensajes serán eliminados*' }, { quoted: preview, mentions: [user] });
  } else {
    if (!mutedUsers.has(user)) return m.reply('⚠️ Ese usuario no está muteado.');
    mutedUsers.delete(user);
    await conn.sendMessage(m.chat, { text: '*Tus mensajes no serán eliminados*' }, { quoted: preview, mentions: [user] });
  }
};


handler.before = async (m, { conn }) => {
  if (!m.isGroup || !m.sender || m.fromMe) return;
  if (mutedUsers.has(m.sender)) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error('[MUTE] Error al eliminar mensaje:', e);
    }
  }
};


handler.customPrefix = /^(mute|unmute)(\s|$)/i;
handler.command = new RegExp;

handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;