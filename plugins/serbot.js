let handler = async (m, { conn, args, usedPrefix, command }) => {
  let sticker = m.quoted?.fileSha256
  if (!sticker) throw '✳️ Responde a un sticker para usar este comando.'

  let cmd = (args[0] || '').toLowerCase()
  if (!cmd) throw `📌 Escribe el nombre de un comando existente.\n\nEjemplo: ${usedPrefix + command} kick`

  let id = sticker.toString('base64')

  // Buscar comando real en los plugins
  let plugin = Object.values(global.plugins).find(
    p => p?.command && (typeof p.command === 'string'
      ? p.command === cmd
      : p.command instanceof RegExp
        ? p.command.test(cmd)
        : Array.isArray(p.command)
          ? p.command.includes(cmd)
          : false)
  )

  if (!plugin) throw `❌ El comando "*${cmd}*" no existe en los plugins.`

  // Guardar el comando real asociado al sticker
  global.db.data.stickercmds = global.db.data.stickercmds || {}
  global.db.data.stickercmds[id] = {
    command: cmd,
    addedBy: m.sender,
    date: Date.now()
  }

  await m.reply(`✅ El sticker fue vinculado al comando *${cmd}* correctamente.`)
}
handler.help = ['add <comando>']
handler.tags = ['tools']
handler.command = ['add']
handler.register = true

export default handler