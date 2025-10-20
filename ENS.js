/*
───────────────────────────────────────────────────────────────
 ⚠️  Respeite o trabalho — NÃO REMOVA O WATERMARK
───────────────────────────────────────────────────────────────
 👤 Autor     : Shasleep
 📩 Telegram  : t.me/Shaasleep
 ▶️ YouTube   : @shaasleep
 😴 Hobby     : TURU BJIL
───────────────────────────────────────────────────────────────
 ✦ É proibido remover ou reivindicar este código como seu.
 ✦ Licença: uso permitido com créditos;
   entre em contato para parcerias ou distribuição.
───────────────────────────────────────────────────────────────
*/
const { Telegraf, Markup, session } = require("telegraf");
const fs = require("fs-extra");
const path = require("path");
const JsConfuser = require("js-confuser");
const axios = require("axios");
const crypto = require("crypto");
const config = require("./config");

if (!config || !config.BOT_TOKEN) {
  console.error("ERROR: setup.js belum diisi. Tambahkan BOT_TOKEN dan ADMIN_ID.");
  process.exit(1);
}

const log = (message, error = null) => {
  const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");
  const prefix = `\x1b[36m[ Estrela Encryption ]\x1b[0m`;
  const timeStyle = `\x1b[33m[${timestamp}]\x1b[0m`;
  const msgStyle = `\x1b[32m${message}\x1b[0m`;
  console.log(`${prefix} ${timeStyle} ${msgStyle}`);
  if (error) {
    const errorStyle = `\x1b[31m✖ Error: ${error.message || error}\x1b[0m`;
    console.error(`${prefix} ${timeStyle} ${errorStyle}`);
    if (error.stack) console.error(`\x1b[90m${error.stack}\x1b[0m`);
  }
};

const USERS_FILE = path.join(__dirname, "membs.json");
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
    }
    return new Set();
  } catch (e) {
    log("Gagal memuat membs.json", e);
    return new Set();
  }
}
function saveUsers(set) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify([...set], null, 2), "utf8");
  } catch (e) {
    log("Gagal menyimpan membs.json", e);
  }
}
let users = loadUsers();

const bot = new Telegraf(config.BOT_TOKEN);
bot.use(session());

let webcrack = null;
try {
  webcrack = require("webcrack").webcrack;
  log("webcrack: loaded");
} catch (e) {
  webcrack = async (code) => ({ code });
  log("webcrack: not installed, using fallback");
}

async function checkChannelMembership(ctx) {
  const channelId = "@aboutmeshaa";
  try {
    if (!ctx.from || !ctx.from.id) return false;
    const member = await ctx.telegram.getChatMember(channelId, ctx.from.id);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (e) {
    log("checkChannelMembership error", e);
    return false;
  }
}

async function downloadFileText(url) {
  const res = await axios.get(String(url), { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(res.data).toString("utf8");
}

const createProgressBar = (percentage) => {
  const total = 12;
  const filled = Math.round((percentage / 100) * total);
  return "▰".repeat(filled) + "▱".repeat(total - filled);
};
async function updateProgress(ctx, message, percentage, status = "") {
  if (!message || !message.message_id) return;
  const bar = createProgressBar(percentage);
  const levelText = percentage === 100 ? "✅ Selesai" : `⚙️ ${status}`;
  const text =
    "```css\n" +
    "🔒 EncryptBot\n" +
    ` ${levelText} (${percentage}%)\n` +
    ` ${bar}\n` +
    "```\n" +
    "_Powered by Baby - Shaa_";
  try {
    await ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, text, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
    await new Promise((r) => setTimeout(r, Math.min(700, percentage * 6)));
  } catch (e) {
    log("updateProgress edit failed", e);
  }
}

function encodeInvisible(text) {
  try {
    return "\u200B" + Buffer.from(String(text), "utf8").toString("base64");
  } catch (e) {
    return text;
  }
}
function decodeInvisible(encoded) {
  try {
    if (!encoded || typeof encoded !== "string") return encoded;
    if (!encoded.startsWith("\u200B")) return encoded;
    return Buffer.from(encoded.slice(1), "base64").toString("utf8");
  } catch (e) {
    return encoded;
  }
}

function generateShortXName() {
  return `xZ${crypto.randomBytes(4).toString("hex")}`;
}
function getXObfuscationConfig() {
  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateShortXName,
    stringCompression: true,
    stringConcealing: true,
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.9,
    flatten: true,
    shuffle: true,
    rgf: true,
    deadCode: true,
    opaquePredicates: true,
    dispatcher: true,
    globalConcealing: true,
    objectExtraction: true,
    duplicateLiteralsRemoval: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true },
  };
}
function getOpmStyle() {
  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    stringCompression: true,
    movedDeclarations: true,
    hexadecimalNumbers: true,
    stringEncoding: true,
    stringConcealing: true,
    stringSplitting: 1.0,
    controlFlowFlattening: 0.98,
    flatten: true,
    shuffle: { hash: 9.0, true: 9.0 },
    identifierGenerator: generateShortXName,
    duplicateLiteralsRemoval: true,
    deadCode: 1.0,
    calculator: true,
    dispatcher: true,
    opaquePredicates: 1.0,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true },
  };
}
function gOp() {
  return {
    target: "node",
    calculator: true,
    compact: true,
    hexadecimalNumbers: true,
    controlFlowFlattening: 0.95,
    deadCode: true,
    dispatcher: true,
    duplicateLiteralsRemoval: true,
    flatten: true,
    globalConcealing: true,
    identifierGenerator: generateShortXName,
    minify: true,
    movedDeclarations: true,
    objectExtraction: true,
    opaquePredicates: true,
    renameVariables: true,
    renameGlobals: true,
    shuffle: { hash: true, true: true },
    stringConcealing: true,
    stringCompression: true,
    stringEncoding: ["base64", "rc4"],
    stringSplitting: true,
    rgf: true,
    lock: { integrity: true, selfDefending: true, antiDebug: true, tamperProtection: true },
  };
}
function Gn() {
  return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: "zeroWidth",
    stringEncoding: true,
    stringSplitting: true,
    controlFlowFlattening: 0.95,
    shuffle: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true },
  };
}
function Ep() {
  function sanitizeOriginal(input) {
    return String(input).replace(/[^a-zA-Z\/\*\^\(\)\-_]/g, "");
  }
  function randomString(len) {
    let out = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  }
  return {
    target: "node",
    preset: "high",
    compact: true,
    minify: true,
    flatten: true,
    identifierGenerator: () => sanitizeOriginal("𝐄𝐬𝐭𝐫𝐞𝐥𝐚𝐍𝐚𝐲𝐚𝀭𠬍") + randomString(3),
    renameVariables: true,
    renameGlobals: true,
    stringEncoding: 0.01,
    stringSplitting: 0.2,
    stringConcealing: true,
    stringCompression: true,
    duplicateLiteralsRemoval: true,
    controlFlowFlattening: false,
    opaquePredicates: false,
    deadCode: false,
    dispatcher: true,
    rgf: true,
    calculator: true,
    movedDeclarations: true,
    objectExtraction: true,
    globalConcealing: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true },
  };
}

async function obfuscateTimeLocked(fileContent, days = 7, preset = Ep()) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days, 10));
  const expiryTimestamp = expiryDate.getTime();
  const wrapper = `(function(){\n  const expiry = ${expiryTimestamp};\n  if (new Date().getTime() > expiry) throw new Error('Script expired');\n  ${fileContent}\n})();`;
  const ob = await JsConfuser.obfuscate(wrapper, preset);
  return typeof ob === "string" ? ob : ob.code || String(ob);
}

async function obfuscateCode(code, preset) {
  const ob = await JsConfuser.obfuscate(code, preset);
  return typeof ob === "string" ? ob : ob.code || String(ob);
}

function makeAntiBypassWrapper(obfCode, days = null) {
  const codeHash = crypto.createHash("sha256").update(obfCode, "utf8").digest("hex");
  const payload = Buffer.from(obfCode, "utf8").toString("base64");
  const expiry = days ? Date.now() + days * 86400000 : null;

  const banner = `
 ▄▄▄▄    ▄▄▄       ▄▄▄▄ ▓██   ██▓     ██████  ██░ ██  ▄▄▄      ▄▄▄      
▓█████▄ ▒████▄    ▓█████▄▒██  ██▒   ▒██    ▒ ▓██░ ██▒▒████▄   ▒████▄    
▒██▒ ▄██▒██  ▀█▄  ▒██▒ ▄██▒██ ██░   ░ ▓██▄   ▒██▀▀██░▒██  ▀█▄ ▒██  ▀█▄  
▒██░█▀  ░██▄▄▄▄██ ▒██░█▀  ░ ▐██▓░     ▒   ██▒░▓█ ░██ ░██▄▄▄▄██░██▄▄▄▄██ 
░▓█  ▀█▓ ▓█   ▓██▒░▓█  ▀█▓░ ██▒▓░   ▒██████▒▒░▓█▒░██▓ ▓█   ▓██▒▓█   ▓██▒
░▒▓███▀▒ ▒▒   ▓▒█░░▒▓███▀▒ ██▒▒▒    ▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒ ▒▒   ▓▒█░▒▒   ▓▒█░
▒░▒   ░   ▒   ▒▒ ░▒░▒   ░▓██ ░▒░    ░ ░▒  ░ ░ ▒ ░▒░ ░  ▒   ▒▒ ░ ▒   ▒▒ ░
 ░    ░   ░   ▒    ░    ░▒ ▒ ░░     ░  ░  ░   ░  ░░ ░  ░   ▒    ░   ▒   
 ░            ░  ░ ░     ░ ░              ░   ░  ░  ░      ░  ░     ░  ░
      ░                 ░░ ░                                            
𝐍𝐠𝐚𝐩𝐚𝐢𝐧 𝐤𝐚𝐮 𝐝𝐞𝐤 𝐬𝐨𝐤² 𝐚𝐧 𝐦𝐚𝐮 𝐛𝐲𝐩𝐚𝐬𝐬 𝐧𝐣𝐚𝐲𝐲
- 𝐏𝐫𝐨𝐭𝐞𝐜𝐭 𝐛𝐲 𝐁𝐚𝐛𝐲 𝐒𝐡𝐚𝐚
`;

  return `(function(){
    const _kill = () => {
      try { if (typeof console !== 'undefined') { console.clear && console.clear(); console.log(\`${banner}\`); } } catch(e){}
      const until = Date.now() + 5000;
      while (Date.now() < until) { /* busy hang */ }
      try { process.exit(0); } catch(e) { for(;;); }
    };
    try {
      const code = Buffer.from("${payload}","base64").toString("utf8");

      let h = null;
      try { h = require('crypto').createHash('sha256').update(code,'utf8').digest('hex'); } catch(e){}

      if (h && h !== "${codeHash}") _kill();

      const exp = ${expiry};
      if (exp && Date.now() > exp) _kill();

      const t = Date.now(); debugger;
      if (Date.now() - t > 150) _kill();

      try {
        const s = (function(){ return (arguments.callee+'') })();
        if (!s.includes("${codeHash.slice(0,6)}")) _kill();
      } catch(e) { _kill(); }

      (function(){ eval(code); })();
    } catch(e) { _kill(); }
  })();`;
}

async function safeDeleteMessage(ctx, messageId) {
  try { if (!messageId) return; await ctx.deleteMessage(messageId).catch(()=>{}); } catch(e) {}
}
async function safeUnlink(filePath) {
  try { if (!filePath) return; if (await fs.pathExists(filePath)) await fs.unlink(filePath); } catch(e) {}
}

bot.start(async (ctx) => {
  users.add(String(ctx.from.id));
  saveUsers(users);
  await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

  const keyboard = Markup.inlineKeyboard([
    [
      { text: "Canal", url: "https://t.me/aboutmeshaa" },
      { text: "Owner", url: "https://t.me/Shaasleep" }
    ],
    [
      Markup.button.callback("Info", "info")
    ]
  ]);

  await ctx.replyWithPhoto("https://files.catbox.moe/cyzevj.jpg", {
    caption: `<blockquote> Olá! <i>Prazer, eu sou Estrela Naya.
Sou um bot do Telegram untuk ofuscação/criptografia de scripts.
Criado por: Baby - Shaa.</i></blockquote>
<blockquote><b>柊 Comandos de Ofuscação 柊</b></blockquote>
<blockquote>▪ encnaya  — Hardened Lotus
▪ encx       — X Invisible
▪ encdays    — Time Locked
▪ deobfuscate— Deobfuscate (webcrack)
▪ encold     — Old Hardened
▪ encnull       — Null Style
▪ encop      — Op Hardened
────────────────✧ </blockquote>\nEstrela Naya`,
    parse_mode: "HTML",
    reply_markup: keyboard.reply_markup
  });
});

bot.action("info", async (ctx) => {
  try {
    await ctx.editMessageCaption(`<blockquote> <b><i>Estrela Naya — Bot de Ofuscação</i></b></blockquote>
<blockquote>────────────────
▪ Status: Online
▪ Criador: @Shaasleep
────────────────</blockquote>
<blockquote>Proteja seu código com <b>Estrela Naya</b></blockquote>`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Canal", url: "https://t.me/aboutmeshaa" },
          { text: "Owner", url: "https://t.me/Shaasleep" }],
          [{ text: "Voltar", callback_data: "menu" }]
        ]
      }
    });
  } catch (e) {
    log("action info error", e);
  }
});

bot.action("menu", async (ctx) => {
  try {
    await ctx.editMessageCaption(`<blockquote> Olá! <i>Prazer, eu sou Estrela Naya.
Sou um bot do Telegram untuk ofuscação/criptografia de scripts.
Criado por: Baby - Shaa.</i></blockquote>
<blockquote><b>柊 Comandos de Ofuscação 柊</b></blockquote>
<blockquote>▪ encnaya  — Hardened
▪ encx       — X Invisible
▪ encdays    — Time Locked
▪ deobfuscate— Deobfuscate
▪ encold     — Old Hardened
▪ encnull       — Null Style
▪ encop      — Op Hardened
────────────────✧ </blockquote>\n<blockquote>Estrela Naya</blockquote>`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Canal", url: "https://t.me/aboutmeshaa" },
            { text: "Owner", url: "https://t.me/Shaasleep" }
          ],
          [
            { text: "Info", callback_data: "info" }
          ]
        ]
      }
    });
  } catch (e) {
    log("action menu error", e);
  }
});

bot.command("broadcast", async (ctx) => {
  users.add(String(ctx.from.id));
  saveUsers(users);
  if (String(ctx.from.id) !== String(config.ADMIN_ID)) {
    return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Hanya admin yang bisa menggunakan perintah ini!");
  }
  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) return ctx.replyWithMarkdown("❌ *Error:* Gunakan: `/broadcast Halo semua!`");
  let ok = 0, fail = 0;
  for (const u of users) {
    try {
      await bot.telegram.sendMessage(u, message, { parse_mode: "Markdown" });
      ok++;
    } catch (e) {
      fail++;
      log("broadcast send failed", e);
    }
  }
  await ctx.replyWithMarkdown(`📢 *Broadcast selesai*\n- ✅ Berhasil: ${ok}\n- ❌ Gagal: ${fail}`);
});

async function fetchRepliedFileContent(ctx) {
  if (!ctx.message?.reply_to_message?.document) throw new Error("Balas file .js ke pesan ini terlebih dulu.");
  const doc = ctx.message.reply_to_message.document;
  if (!doc.file_name || !doc.file_name.endsWith(".js")) throw new Error("Hanya file berekstensi .js yang didukung.");
  const link = await ctx.telegram.getFileLink(doc.file_id);
  const text = await downloadFileText(String(link));
  return { filename: doc.file_name, content: text };
}

async function runObfuscationFlow(ctx, presetFactoryOrObj, filenamePrefix = "out", options = {}) {
  const { validateAfter = true, wrapperTransform = null, days = null } = options;
  const { filename, content } = await fetchRepliedFileContent(ctx);
  const outPath = path.join(__dirname, `${filenamePrefix}-${filename}`);
  const progressMsg = await ctx.replyWithMarkdown("```css\n🔒 EncryptBot\n⚙️ Memulai (1%)\n" + createProgressBar(1) + "\n```\n_Powered by Baby - Shaa_");

  try {
    await updateProgress(ctx, progressMsg, 10, "Validasi kode & unduh");
    try { new Function(content); } catch { /* lanjut walau syntax error */ }

    await updateProgress(ctx, progressMsg, 30, "Inisialisasi obfuscation");
    const preset = (typeof presetFactoryOrObj === "function") ? presetFactoryOrObj() : presetFactoryOrObj;

    let obfCode;
    if (days !== null) {
      obfCode = await obfuscateTimeLocked(content, days, preset);
    } else {
      obfCode = await obfuscateCode(content, preset);
    }

    let finalCode = obfCode;
    if (wrapperTransform) {
      try { finalCode = wrapperTransform(finalCode); } catch (e) { log("wrapperTransform failed", e); }
    }

    finalCode = makeAntiBypassWrapper(finalCode, days !== null ? days : 0);
    obfCode = finalCode;

    await updateProgress(ctx, progressMsg, 65, "Validasi hasil");
    if (validateAfter) {
      try { new Function(obfCode); } catch (e) { log("Hasil obfuscation kemungkinan tidak valid", e); }
    }

    await fs.writeFile(outPath, obfCode, "utf8");
    await updateProgress(ctx, progressMsg, 90, "Mengirim file");
    await ctx.replyWithDocument({ source: outPath, filename: `${filenamePrefix}-${filename}` }, {
      caption: `✅ *File terenkripsi (${filenamePrefix}) siap!*\n_Powered by Baby - Shaa_`,
      parse_mode: "Markdown"
    });
    await updateProgress(ctx, progressMsg, 100, "Selesai");
  } finally {
    try { await safeDeleteMessage(ctx, progressMsg.message_id); } catch(e){}
    try { await safeUnlink(outPath); } catch(e){}
    try { await safeDeleteMessage(ctx, ctx.message?.reply_to_message?.message_id); } catch(e){}
    try { await safeDeleteMessage(ctx, ctx.message?.message_id); } catch(e){}
  }
}

bot.command("encnaya", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    await runObfuscationFlow(ctx, getOpmStyle, "naya", { validateAfter: true });
  } catch (e) {
    log("encnaya failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("encx", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    await runObfuscationFlow(ctx, getXObfuscationConfig, "x-encrypted", {
      wrapperTransform: (code) => {
        const hidden = encodeInvisible(code);
        const b64 = Buffer.from(hidden, "utf8").toString("base64");
        return `(function(){try{const h=Buffer.from("${b64}","base64").toString("utf8");const decoded=h.startsWith("\\u200B")?Buffer.from(h.slice(1),"base64").toString("utf8"):h;eval(decoded);}catch(e){console.error("exec err",e);}})();`;
      },
    });
  } catch (e) {
    log("encx failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("encnull", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    await runObfuscationFlow(ctx, Gn, "Null", { validateAfter: true });
  } catch (e) {
    log("encnull failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("encold", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    await runObfuscationFlow(ctx, Ep, "old", { validateAfter: true });
  } catch (e) {
    log("encold failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("encop", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    await runObfuscationFlow(ctx, gOp, "op", { validateAfter: true });
  } catch (e) {
    log("encop failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("encdays", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    const args = ctx.message.text.split(" ").slice(1);
    if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > 365) return ctx.reply("❌ Gunakan format `/encdays [1-365]`!");
    const days = parseInt(args[0], 10);
    await runObfuscationFlow(ctx, Ep, `timeenc-${days}d`, { days, validateAfter: true });
  } catch (e) {
    log("encdays failed", e);
    ctx.reply(`❌ Error: ${e.message || e}`);
  }
});

bot.command("deobfuscate", async (ctx) => {
  try {
    users.add(String(ctx.from.id)); saveUsers(users);
    if (!(await checkChannelMembership(ctx))) return ctx.replyWithMarkdown("❌ *Akses Ditolak:* Join dulu [@aboutmeshaa](https://t.me/aboutmeshaa)!");
    const { filename, content } = await fetchRepliedFileContent(ctx);
    const outPath = path.join(__dirname, `deob-${filename}`);
    const progressMsg = await ctx.replyWithMarkdown("```css\n🔒 EncryptBot\n⚙️ Memulai Deobfuscation (1%)\n" + createProgressBar(1) + "\n```\n_Powered by Baby - Shaa_");
    try {
      await updateProgress(ctx, progressMsg, 10, "Menjalankan webcrack");
      const result = await webcrack(content);
      const code = result?.code || content;
      await fs.writeFile(outPath, code, "utf8");
      await updateProgress(ctx, progressMsg, 80, "Mengirim hasil");
      await ctx.replyWithDocument({ source: outPath, filename: `deobfuscated-${filename}` }, { caption: "✅ Deobfuscation selesai", parse_mode: "Markdown" });
      await updateProgress(ctx, progressMsg, 100, "Selesai");
    } finally {
      await safeDeleteMessage(ctx, progressMsg.message_id);
      await safeUnlink(outPath);
      await safeDeleteMessage(ctx, ctx.message?.reply_to_message?.message_id);
      await safeDeleteMessage(ctx, ctx.message?.message_id);
    }
  } catch (e) { log("deobfuscate failed", e); ctx.reply(`❌ Error: ${e.message || e}`); }
});

bot.command("myid", (ctx) => ctx.reply(`ID: ${ctx.from.id}\nUsername: ${ctx.from.username || "-"}`));

bot.launch()
  .then(() => log("Encrypt Bot by Estrela Naya aktif ✅"))
  .catch((e) => log("Gagal menjalankan bot", e));

process.on("unhandledRejection", (r) => log("UnhandledRejection", r));
process.on("uncaughtException", (e) => log("UncaughtException", e));