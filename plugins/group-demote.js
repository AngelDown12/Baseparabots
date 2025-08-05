import PhoneNumber from 'awesome-phonenumber'

function normalizeJid(text = '') {
  let number = text.replace(/\D/g, '') // eliminar todo lo que no sea número
  if (!number) return ''
  let pn = new PhoneNumber(number, 'MX') // Forzar región MX
  if (!pn.isValid()) return ''
  return pn.getNumber('e164').replace('+', '') + '@s.whatsapp.net'
}

let handler = async (m, { conn, text }) => {
  if (!text && !m.quoted) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } })
    return conn.reply(m.chat, 'Etiqueta o responde al que quieras quitar.', m)
  }

  let user = null

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0]
  } else if (text) {
    user = normalizeJid(text)
  } else if (m.quoted?.sender) {
    user = m.quoted.sender
  }

  if (!user || !user.endsWith('@s.whatsapp.net')) {
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } })
    return conn.reply(m.chat, 'Ese número no es válido o no se encontró.', m)
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
  } catch (e) {
    // Puedes loguear el error si deseas: console.log(e)
  }
}

handler.help = ['@usuario*'].map((v) => 'demote ' + v)
handler.tags = ['group']
handler.command = /^(demote|quitaradmin|quitarpoder)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler