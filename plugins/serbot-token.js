import fs from 'fs'
const FILE = './comandos.json'

export async function before(m, { conn, usedPrefix }) {
  if (!m.sticker || !m.msg?.fileSha256) return

  let sha = m.msg.fileSha256.toString('base64')
  if (!sha) return

  if (!fs.existsSync(FILE)) return
  let db = JSON.parse(fs.readFileSync(FILE))
  let cmd = db[sha]
  if (!cmd) return

  // Buscar el plugin correspondiente en global.plugins
  let plugin = Object.values(global.plugins).find(p => {
    if (!p.command) return false
    if (typeof p.command === 'string') return p.command === cmd
    if (p.command instanceof RegExp) return p.command.test(cmd)
    if (Array.isArray(p.command)) return p.command.includes(cmd)
    return false
  })

  if (!plugin) {
    return conn.reply(m.chat, `⚠️ *El comando vinculado \`${cmd}\` no fue encontrado en ningún plugin.*`, m)
  }

  // Crear una copia del mensaje y ejecutarlo como si fuera el comando
  let fake = Object.create(m)
  fake.text = usedPrefix + cmd
  fake.args = cmd.split(' ')
  fake.command = cmd
  fake.plugin = plugin

  try {
    await plugin(fake, { conn, args: [], usedPrefix, command: cmd })
  } catch (e) {
    await conn.reply(m.chat, `❌ *Error al ejecutar el comando vinculado:* ${e}`, m)
  }
}