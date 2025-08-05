import fs from 'fs'
import path from 'path'

const FILE = './comandos.json'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
    return conn.reply(m.chat, '❌ *Responde a un sticker para vincularlo con un comando.*', m)
  }

  let cmd = args[0]
  if (!cmd) return conn.reply(m.chat, `⚠️ *Debes escribir el comando a ejecutar.*\n\n📌 Ejemplo:\n${usedPrefix + command} ping`, m)

  let sha = m.quoted.fileSha256?.toString('base64')
  if (!sha) return conn.reply(m.chat, '❌ *No se pudo obtener el ID del sticker.*', m)

  let json = {}
  if (fs.existsSync(FILE)) {
    try {
      json = JSON.parse(fs.readFileSync(FILE))
    } catch {
      json = {}
    }
  }

  json[sha] = cmd
  fs.writeFileSync(FILE, JSON.stringify(json, null, 2))
  conn.reply(m.chat, `✅ *Sticker vinculado correctamente al comando:* \`${cmd}\``, m)
}

handler.command = ['addco']
handler.help = ['addco <comando>']
handler.tags = ['tools']
handler.register = true

export default handler