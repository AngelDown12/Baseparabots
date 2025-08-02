import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  const users = participants.map(u => conn.decodeJid(u.id))
  try {
    const q = m.quoted || m
    const msgContent = q.msg || q
    const mime = msgContent.mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const mtype = q.mtype || Object.keys(q.message || {})[0]

    // Reacciona con 🗣️
    await conn.sendMessage(m.chat, {
      react: { text: '🗣️', key: m.key }
    })

    // Define caption final
    const originalCaption = (msgContent.caption || q.text || '').trim()
    const finalCaption = text.trim() || (m.quoted ? originalCaption : '') || '🗣️'

    // Opciones comunes
    const commonOpts = { mentions: users, quoted: m }

    if (isMedia && m.quoted) {
      const media = await q.download()

      switch (mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, ...commonOpts })
          break
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mimetype: 'video/mp4', ...commonOpts })
          break
        case 'audioMessage':
          await conn.sendMessage(m.chat, {
            audio: media,
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3',
            ...commonOpts
          })
          break
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: media, ...commonOpts })
          break
        default:
          // Por si es otro tipo que no cubrimos
          await conn.sendMessage(m.chat, { text: finalCaption, ...commonOpts })
          break
      }
    } else {
      // Texto plano o sin media
      await conn.sendMessage(m.chat, { text: finalCaption, ...commonOpts })
    }

  } catch (e) {
    await conn.sendMessage(m.chat, { text: '🗣️', mentions: users, quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|notify|notificar|noti|n|rcc|hidetah|hidet)$/i
handler.group = true
handler.admin = true

export default handler