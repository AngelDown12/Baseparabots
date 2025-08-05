let handler = async (m, { conn, args }) => {
  let sticker = m.quoted?.fileSha256
  if (!sticker) return m.reply('✳️ Responde a un sticker.')

  let cmd = (args[0] || '').toLowerCase()
  if (!cmd) return m.reply('📌 Escribe el comando que deseas vincular.')

  let plugin = Object.values(global.plugins).find(p =>
    p.command && (
      typeof p.command === 'string' ? p.command === cmd :
      p.command instanceof RegExp ? p.command.test(cmd) :
      Array.isArray(p.command) ? p.command.includes(cmd) : false
    )
  )

  if (!plugin) return m.reply(`❌ El comando "*${cmd}*" no existe.`)

  let id = sticker.toString('base64')
  global.db.data.stickercmds = global.db.data.stickercmds || {}
  global.db.data.stickercmds[id] = {
    command: cmd,
    addedBy: m.sender,
    date: Date.now()
  }

  m.reply(`✅ Sticker vinculado al comando *${cmd}*`)
}
handler.command = ['add']
handler.help = ['add <comando>']
handler.tags = ['tools']
handler.register = true
export default handler