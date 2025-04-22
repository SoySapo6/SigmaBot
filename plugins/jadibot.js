import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command)

  async function reportError(e) {
    await m.reply(`❌ Ocurrió un error.`)
    console.log(e)
  }

  switch (true) {
    case isCommand1:
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
      let uniqid = `${who.split`@`[0]}`
      const path = `./${jadi}/${uniqid}`

      if (!await fs.existsSync(path)) {
        await conn.sendMessage(m.chat, {
          text: `⚠️ Usted no tiene una sesión. Use:\n${usedPrefix + command}\n\nSi tiene una ID:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\``
        }, { quoted: m })
        return
      }

      if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {
        text: `⚠️ Use este comando en el *Bot principal*.\n\nhttps://wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}`
      }, { quoted: m })
      else {
        await conn.sendMessage(m.chat, { text: `✅ Tu sesión como *Sub-Bot* se ha eliminado` }, { quoted: m })
      }

      try {
        fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
        await conn.sendMessage(m.chat, { text: `✅ Has cerrado sesión y se borró todo.` }, { quoted: m })
      } catch (e) {
        reportError(e)
      }
      break

    case isCommand2:
      if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `⚠️ Solo *Sub-Bots* pueden pausar.`, m)
      else {
        await conn.reply(m.chat, `⏸️ ${botname} desactivada.`, m)
        conn.ws.close()
      }
      break

    case isCommand3:
      function convertirMsADiasHorasMinutosSegundos(ms) {
        var segundos = Math.floor(ms / 1000);
        var minutos = Math.floor(segundos / 60);
        var horas = Math.floor(minutos / 60);
        var días = Math.floor(horas / 24);
        segundos %= 60;
        minutos %= 60;
        horas %= 24;
        var resultado = "";
        if (días) resultado += `${días} días, `;
        if (horas) resultado += `${horas} horas, `;
        if (minutos) resultado += `${minutos} minutos, `;
        if (segundos) resultado += `${segundos} segundos`;
        return resultado;
      }

      const nombresRandom = [
        '👑 MARX 👑', '• Scar •', '★ Tu Pana Miguel ★', '~ La Tuya ~', '✞ JHOSMAR ✞', '𝙻𝚊 𝙿𝚊𝚝𝚛𝚘𝚗𝚊', 'TuPa √',
        '✘ Santiago ✘', '★ Daniela ★', 'ღ Mía ღ', '✿ Kevin ✿', '♛ Esteban ♛', '✪ Sofía ✪', 'ツ Alex ツ',
        '⚡ Camila ⚡', '☠ Erick ☠', '✈ Mateo ✈', '♟️ Diana ♟️', '✘ Luna ✘', '✰ Isaac ✰', '꧁ Andrés ꧂',
        '꧁♡ Valentina ♡꧂', '✦ Gabriel ✦', '➻❥ Felipe', '★ Samuel ★', '✧ Michelle ✧', '⛧ Alison ⛧', '⎊ Angel',
        '✞ Dominic ✞', 'ツ Thiago  tu panaaaaa ツ', '♚ Carolina ♚', 'ღ Naomi ღ', '♤ Pablo ♤', '⩺ Jorge ⩺', '✺ Estrella ✺',
        '✎ Mariana ✎', '✰ Axel ✰', '✩ Génesis ✩', '✾ Andrés ✾', '✠ Brenda ✠', '✿ Luz ✿', '☾ Max ☽', '☼ Oscar ☼',
        '☁️ Zoe ☁️', '♒ Aitana ♒', '☯ Dylan ☯', '♛ Fernando ♛', '★ Evelyn ★', '♠️ Javier ♠️', '♣️ Nicole ♣️',
        '♤ Adrián ♤', '☄️ Juan ☄️', '✺ Diego ✺', ' PENEEE  🍆', '✧ Fatima ✧', '⧉ Ariana ⧉', '⟆ Francisco ⟆',
        '꧁ Emmanuel ꧂', '꧁ Anabella ꧂', '✎ Emiliano ✎', '✧ Melody ✧', '⚘ Dayana ⚘', '➻❥ Valeria'
      ]
      
      let fakeUsers = []
      for (let i = 2; i <= 62; i++) {
        const nombre = nombresRandom[Math.floor(Math.random() * nombresRandom.length)]
        const numero = `52${Math.floor(Math.random() * 1000000000 + 100000000)}`
        const tiempo = `${Math.floor(Math.random() * 10) + 1} Minutos`
        fakeUsers.push(`• 「 ${i} 」\n📎 Wa.me/${numero}?text=${usedPrefix}estado\n👤 Usuario: ${nombre}\n🕑 Online: ${tiempo}`)
      }

      const users = [...new Set([...global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)])]
      const reales = users.map((v, index) => `• 「 ${index + 1} 」\n📎 Wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado\n👤 Usuario: ${v.user.name || 'Sub-Bot'}\n🕑 Online: ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`)

      const total = reales.length + fakeUsers.length
      const finalMessage = `🤖 LISTA DE *SUB-BOTS* ACTIVOS\n\n🔗 PUEDES PEDIR QUE UN SUB-BOT ENTRE A TU GRUPO\n\n\`\`\`Cada Sub-Bot tiene sus propias funciones, el número principal no se responsabiliza del mal uso.\`\`\`\n\n*SUB-BOTS CONECTADOS:* ${total}\n\n${[...reales, ...fakeUsers].join('\n\n__________________________\n\n')}`

      await _envio.sendMessage(m.chat, { text: finalMessage, mentions: _envio.parseMention(finalMessage) }, { quoted: m })
      break
  }
}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler
