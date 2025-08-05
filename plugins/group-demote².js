import PhoneNumber from 'awesome-phonenumber'

function normalizeJid(text = '') {
  let number = text.replace(/\D/g, '')
  if (!number) return ''
  let pn = new PhoneNumber(number, 'MX') // forzar región México
  if (!pn.isValid()) return ''
  return pn.getNumber('e164').replace('+', '') + '@s.whatsapp.net'
}

let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  if (!body || !/^demote\s+@/i.test(body)) {
    return;
  }

  if (!mentioned || !mentioned.length) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Etiqueta a alguien para quitarle el admin.', m);
  }

  // 🔽 Único cambio aquí: se normaliza el número mencionado (por si es +52...)
  const user = normalizeJid(mentioned[0].split('@')[0]);

  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'No pude reconocer al usuario mencionado.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    // No responde nada si sale bien
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo quitar el admin.', m);
  }
};

handler.customPrefix = /^demote\s+@/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;