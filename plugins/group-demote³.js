import PhoneNumber from 'awesome-phonenumber'

function normalizeJid(text = '') {
  let number = text.replace(/\D/g, '')
  if (!number) return ''
  let pn = new PhoneNumber(number, 'MX') // fuerza a región México
  if (!pn.isValid()) return ''
  return pn.getNumber('e164').replace('+', '') + '@s.whatsapp.net'
}

let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  if (body !== 'demote') return;

  // 🔽 único cambio: normalizamos por si el número viene en formato raro
  const user = normalizeJid(m.quoted?.sender?.split('@')[0] || '');

  if (!user) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    return conn.reply(m.chat, 'Responde al mensaje de quien quieras quitar.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    // No dice nada si lo logra
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.reply(m.chat, 'No se pudo quitar el admin.', m);
  }
};

handler.customPrefix = /^demote$/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;