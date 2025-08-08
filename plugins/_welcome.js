import { WAMessageStubType } from '@whiskeysockets/baileys'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const defaultPP = 'https://files.catbox.moe/jknpio.jpg'
  const welcomeAudioUrl = 'https://qu.ax/sjtTL.opus'
  const byeAudioUrl = 'https://qu.ax/LhbNi.opus'

  let chat = global.db.data.chats[m.chat]
  let userJid = m.messageStubParameters[0]
  let user = `@${userJid.split('@')[0]}`
  let groupName = groupMetadata.subject
  let groupDesc = groupMetadata.desc || 'Sin descripción'

  // Obtener foto de perfil o usar default
  let profilePic
  try {
    profilePic = await conn.profilePictureUrl(userJid, 'image')
  } catch (e) {
    profilePic = defaultPP
  }

  // BIENVENIDA
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.ADD) {
    let welcome = chat.sWelcome
      ? chat.sWelcome
          .replace(/@user/g, user)
          .replace(/@group/g, groupName)
          .replace(/@desc/g, groupDesc)
      : `┊» 𝙋𝙊𝙍 𝙁𝙄𝙉 𝙇𝙇𝙀𝙂𝘼𝙎\n┊» ${groupName}\n┊» ${user}\n┊» 𝗹𝗲𝗲 𝗹𝗮 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝗰𝗶𝗼𝗻\n\n» Siéntete como en tu casa, aplasta el culo!!!`

    try {
      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: welcome,
        mentions: [userJid]
      })

      await new Promise(resolve => setTimeout(resolve, 500)) // Espera breve

      await conn.sendMessage(m.chat, {
        audio: { url: welcomeAudioUrl },
        mimetype: 'audio/ogg; codecs=opus'
      })
    } catch (e) {
      console.error('Error en mensaje de bienvenida:', e)
    }
  }

  // DESPEDIDA
  if (chat.bienvenida && [WAMessageStubType.REMOVE, WAMessageStubType.LEAVE].includes(m.messageStubType)) {
    const msgsBye = [
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*\n*┊* ${user}\n*┊𝗧𝗨 𝗔𝗨𝗦𝗘𝗡𝗖𝗜𝗔 𝗙𝗨𝗘 𝗖𝗢𝗠𝗢 𝗨𝗡 𝗤𝗟𝗢,*\n*┊𝗖𝗢𝗡 𝗢𝗟𝗢𝗥 𝗔 𝗠𝗥𝗗!!* 👿\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*\n*┊* ${user}\n*┊𝗔𝗟𝗚𝗨𝗜𝗘𝗡 𝗠𝗘𝗡𝗢𝗦, 𝗤𝗨𝗜𝗘𝗡 𝗧𝗘 𝗥𝗘𝗖𝗨𝗘𝗥𝗗𝗘*\n*┊𝗦𝗘𝗥𝗔 𝗣𝗢𝗥 𝗟𝗔𝗦𝗧𝗜𝗠𝗔, 𝗔𝗗𝗜𝗢𝗦!!* 👿\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*\n*┊* ${user}\n*┊𝗧𝗨 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 𝗡𝗢𝗦 𝗛𝗔𝗥𝗔 𝗟𝗟𝗢𝗥𝗔𝗥,*\n*┊𝗗𝗘 𝗟𝗔 𝗩𝗘𝗥𝗚𝗨𝗘𝗡𝗭𝗔 𝗤𝗨𝗘 𝗗𝗔𝗕𝗔𝗦!!* 👿\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*\n*┊* ${user}\n*┊𝗗𝗘𝗝𝗢 𝗗𝗘 𝗢𝗟𝗘𝗥 𝗔 𝗠𝗥𝗗,*\n*┊𝗛𝗔𝗦𝗧𝗔 𝗤𝗨𝗘 𝗧𝗘 𝗟𝗔𝗥𝗚𝗔𝗦𝗧𝗘!!* 👿\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`
    ]

    let bye = chat.sBye
      ? chat.sBye
          .replace(/@user/g, user)
          .replace(/@group/g, groupName)
          .replace(/@desc/g, groupDesc)
      : msgsBye[Math.floor(Math.random() * msgsBye.length)]

    try {
      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: bye,
        mentions: [userJid]
      })

      await new Promise(resolve => setTimeout(resolve, 500)) // Espera breve

      await conn.sendMessage(m.chat, {
        audio: { url: byeAudioUrl },
        mimetype: 'audio/ogg; codecs=opus'
      })
    } catch (e) {
      console.error('Error en mensaje de despedida:', e)
    }
  }
}