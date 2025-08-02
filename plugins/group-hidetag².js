import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^n(\s|$)/i.test(content.trim())) return

  // Reacción al mensaje
  await conn.sendMessage(m.chat, {
    react: {
      text: '🗣️',
      key: m.key
    }
  })

  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const userText = content.trim().slice(1).trim()
    const originalCaption = q.msg?.caption || q.text || ''
    const finalCaption = userText || originalCaption.trim() || '📢 Notificación'

    let media
    if (isMedia) {
      try {
        media = await conn.downloadMediaMessage(q)
      } catch {
        media = await q.download?.()
      }
    }

    if (m.quoted && isMedia) {
      const options = { quoted: m }

      switch (q.mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users, ...options })
          break
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4', ...options })
          break
        case 'audioMessage':
          await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', fileName: 'audio.mp3', mentions: users, ...options })
          break
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: media, mentions: users, ...options }) // ✅ Con menciones
          break
      }

    } else if (m.quoted && !isMedia) {
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

    } else if (!m.quoted && isMedia) {
      if (q.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: m })
      } else if (q.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
      }

    } else {
      await conn.sendMessage(m.chat, {
        text: finalCaption,
        mentions: users
      }, { quoted: m })
    }

  } catch (e) {
    const users = participants.map(u => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: '📢 Notificación',
      mentions: users
    }, { quoted: m })
  }
}

handler.customPrefix = /^n(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler