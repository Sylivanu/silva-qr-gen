const express = require("express");
const app = express();

const pino = require("pino");
let { toBuffer } = require("qrcode");
const path = require("path");
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");
const PORT = process.env.PORT || 5000;
const MESSAGE =
  process.env.MESSAGE ||
  `
*✅sᴇssɪᴏɴ ᴄᴏɴɴᴇᴄᴛᴇᴅ✅*
*Made With 💜*
*By 𝑺𝒊𝒍𝒗𝒂 𝒕𝒆𝒄𝒉💜*
______________________________
╔════◇
║『 𝐘𝐎𝐔 ARE CONNECTED TO 𝑺𝒊𝒍𝒗𝒂 𝒕𝒆𝒄𝒉 』
║ You've Completed the First Step
║ to Deploy a Whatsapp Bot.
╚══════════════╝
╔═════◇
║ 『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ 𝐘𝐨𝐮𝐭𝐮𝐛𝐞: _tiktok.com/@silva.edits6_
║❒ 𝐎𝐰𝐧𝐞𝐫: _https://wa.me/message/254700143167_
║❒ 𝐑𝐞𝐩𝐨: _https://github.com/SilvaTechB/SilvaGifted_
║❒ 𝐖𝐚𝐆𝐫𝐨𝐮𝐩: _https://chat.whatsapp.com/ExdDIwx7j36Ci7VP0TbCYw_
║❒ 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥: _https://whatsapp.com/channel/0029VaYauR9ISTkHTj4xvi1l_
║❒ 𝐖𝐚𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲: _https://chat.whatsapp.com/JzEI5zUtHSh01rxYL1bkmy_
║ 💜💜💜
╚══════════════╝ 
 *©²⁰²⁴ 𝑺𝒊𝒍𝒗𝒂 𝒕𝒆𝒄𝒉*
______________________________

Don't Forget To Give Star⭐ To My Repo
`;

if (fs.existsSync("./gifted_baileys")) {
  fs.emptyDirSync(__dirname + "/gifted_baileys");
}

app.use("/", async (req, res) => {
  const {
    default: GiftedWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    DisconnectReason,
    makeInMemoryStore,
  } = require("@whiskeysockets/baileys");
  const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });
  async function GIFTED() {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/gifted_baileys",
    );
    try {
      let Smd = GiftedWASocket({
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: ["Gifted", "GiftedQrScan", ""],
        auth: state,
      });

      Smd.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect, qr } = s;
        if (qr) {
          res.end(await toBuffer(qr));
        }

        if (connection == "open") {
          await delay(3000);
          let user = Smd.user.id;
          let CREDS = fs.readFileSync(
            __dirname + "/gifted_baileys/creds.json",
          );
          var Scan_Id = Buffer.from(CREDS).toString("base64");
          // res.json({status:true,Scan_Id })
          console.log(`
====================  SESSION ID  ==========================                   
SESSION-ID ==> ${Scan_Id}
-------------------   SESSION CLOSED   -----------------------
`);

          let msgsss = await Smd.sendMessage(user, {
            text: `Gifted;;;${Scan_Id}`,
          });
          await Smd.sendMessage(user, { text: MESSAGE }, { quoted: msgsss });
          await delay(1000);
          try {
            await fs.emptyDirSync(__dirname + "/gifted_baileys");
          } catch (e) {}
        }

        Smd.ev.on("creds.update", saveCreds);

        if (connection === "close") {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
          // console.log("Reason : ",DisconnectReason[reason])
          if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed!");
            // GIFTED().catch(err => console.log(err));
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server!");
            //  GIFTED().catch(err => console.log(err));
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            GIFTED().catch((err) => console.log(err));
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut!");
            // GIFTED().catch(err => console.log(err));
          } else {
            console.log("Connection closed with bot. Please run again.");
            console.log(reason);
            //process.exit(0)
          }
        }
      });
    } catch (err) {
      console.log(err);
      await fs.emptyDirSync(__dirname + "/gifted_baileys");
    }
  }

  GIFTED().catch(async (err) => {
    console.log(err);
    await fs.emptyDirSync(__dirname + "/gifted_baileys");

    //// MADE BY GIFTED TECH INC - 2024
  });
});

app.listen(PORT, () =>
  console.log(`Gifted-Qr Server Running on Port http://localhost:${PORT}`),
);
