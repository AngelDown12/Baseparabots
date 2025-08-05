let handler = async (m, { conn }) => {
  if (!m.sticker || !m.fileSha256) return
  let id = m.fileSha256.toString('base64')
  m.reply(`🆔 Este sticker tiene el ID:\n\n${id}`)
}
handler.customPrefix = () => true
handler.command = new RegExp
export default handler