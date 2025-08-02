import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: '🗣️',
        key: m.key
      }
    })

    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const caption = text.trim() || q.msg?.caption || q.text || '🗣️'

    if (isMedia) {
      let media
      try {
        media = await conn.downloadMediaMessage(q)
      } catch {
        media = await q.download?.() // fallback si falla la anterior
      }

      let type = q.mtype
      let msg = { mentions: users, quoted: m }

      if (type === 'imageMessage') {
        msg.image = media
        msg.caption = caption
      } else if (type === 'videoMessage') {
        msg.video = media
        msg.caption = caption
        msg.mimetype = 'video/mp4'
      } else if (type === 'audioMessage') {
        msg.audio = media
        msg.mimetype = 'audio/mpeg'
        msg.fileName = 'audio.mp3'
      } else if (type === 'stickerMessage') {
        msg.sticker = media
      }

      await conn.sendMessage(m.chat, msg)
    } else {
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [q.mtype || 'extendedTextMessage']: q.message?.[q.mtype] || { text: caption } },
          { quoted: m, userJid: conn.user.id }
        ),
        caption,
        conn.user.jid,
        { mentions: users }
      )

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

  } catch (e) {
    const users = participants.map(u => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: text || '🗣️',
      mentions: users
    }, { quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler