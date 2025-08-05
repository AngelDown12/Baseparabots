let handler = async (m, { conn }) => {
  const lower = m.text.toLowerCase().trim()

  let isClose = {
    abrir: "not_announcement",
    cerrar: "announcement",
    "grupo abrir": "not_announcement",
    "grupo cerrar": "announcement",
    open: "not_announcement",
    close: "announcement",
    "grupo open": "not_announcement",
    "grupo close": "announcement",
  }[lower]

  if (!isClose) return

  await conn.groupSettingUpdate(m.chat, isClose)
  m.reply("☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦")
}

handler.command = /^(grupo\s)?(abrir|cerrar|open|close)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler