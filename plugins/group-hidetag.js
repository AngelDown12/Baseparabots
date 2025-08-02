import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted || m
    const c = m.quoted ? await m.getQuotedObj() : m
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const mtype = q.mtype || Object.keys(q.message || {})[0]

    // 🗣️ Reacción al mensaje del comando
    await conn.sendMessage(m.chat, {
      react: {
        text: '🗣️',
        key: m.key
      }
    })

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = text.trim() || (m.quoted ? originalCaption : '') || '🗣️'

    if (isMedia && m.quoted) {
      const media = await q.download()

      const options = {
        caption: finalCaption,
        mentions: users,
        quoted: m
      }

      switch (mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, ...options })
          break
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', ...options })
          break
        case 'audioMessage':
          await conn.sendMessage(m.chat, {
            audio: media,
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            mentions: users
          }, { quoted: m })
          break
        case 'stickerMessage':
          await conn.sendMessage(m.chat, {
            sticker: media,
            mentions: users
          }, { quoted: m })
          break
      }

    } else {
      // Si no hay texto ni respuesta a otro mensaje, manda solo 🗣️
      await conn.sendMessage(m.chat, {
        text: finalCaption,
        mentions: users
      }, { quoted: m })
    }

  } catch (e) {
    const users = participants.map(u => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: '🗣️',
      mentions: users
    }, { quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|rcc|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler