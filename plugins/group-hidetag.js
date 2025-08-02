import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  try {
    // Reacción al comando
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

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = text.trim() ? text : originalCaption || '🗣️'

    if (isMedia) {
      const media = await q.download()

      let type = q.mtype
      let msgOptions = {
        mentions: users,
        quoted: m
      }

      switch (type) {
        case 'imageMessage':
          msgOptions.image = media
          msgOptions.caption = finalCaption
          break
        case 'videoMessage':
          msgOptions.video = media
          msgOptions.caption = finalCaption
          msgOptions.mimetype = 'video/mp4'
          break
        case 'audioMessage':
          msgOptions.audio = media
          msgOptions.mimetype = 'audio/mpeg'
          msgOptions.fileName = 'audio.mp3'
          break
        case 'stickerMessage':
          msgOptions.sticker = media
          break
        default:
          break
      }

      await conn.sendMessage(m.chat, msgOptions)
    } else {
      // Solo texto con mención
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [q.mtype || 'extendedTextMessage']: q.message?.[q.mtype] || { text: finalCaption } },
          { quoted: m, userJid: conn.user.id }
        ),
        finalCaption,
        conn.user.jid,
        { mentions: users }
      )
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }
  } catch (e) {
    // Si falla, envía un mensaje plano con menciones
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