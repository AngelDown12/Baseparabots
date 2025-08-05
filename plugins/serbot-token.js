import fs from 'fs'

const handler = async (m, { conn, usedPrefix }) => {
  if (!m.msg || m.mtype !== 'stickerMessage') return

  const sha = m.msg.fileSha256?.toString('base64')
  if (!sha) return

  const file = './comandos.json'
  if (!fs.existsSync(file)) return

  let db = {}
  try {
    db = JSON.parse(fs.readFileSync(file))
  } catch {
    db = {}
  }

  const comando = db[sha]
  if (!comando) return

  m.text = usedPrefix + comando
  return await conn.handleMessage(m, m)
}

export default handler