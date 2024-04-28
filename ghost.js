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
____________________________
*✅sᴇssɪᴏɴ ᴄᴏɴɴᴇᴄᴛᴇᴅ✅*
____________________________
╔════◇
║『 *YOU'VE CHOSEN GHOST-MD* 』
║ You've Completed the First Step
║ to Deploy a Whatsapp Bot.
╚════════════════╝
╔═════◇
║ 『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ 𝐎𝐰𝐧𝐞𝐫: https://wa.me/254758682666
║❒ 𝐑𝐞𝐩𝐨: https://github.com/Blvckcastro/Ghost-Md
║❒ 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥: https://whatsapp.com/channel/0029VaYVQPxE50UYrUaToj1V
║ 💜💜💜
╚════════════════╝ 
Don't Forget To Give Star⭐ To My Repo
`;

if (fs.existsSync("./ghost_baileys")) {
  fs.emptyDirSync(__dirname + "/ghost_baileys");
}

app.use("/", async (req, res) => {
  const {
    default: GhostWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    DisconnectReason,
    makeInMemoryStore,
  } = require("@whiskeysockets/baileys");
  const store = makeInMemoryStore({
    logger: pino().child({ level: "silent", stream: "store" }),
  });
  async function GHOST() {
    const { state, saveCreds } = await useMultiFileAuthState(
      __dirname + "/ghost_baileys",
    );
    try {
      let Smd = GhostWASocket({
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: ["GhostMd", "GhostQrScan", ""],
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
            __dirname + "/ghost_baileys/creds.json",
          );
          var Scan_Id = Buffer.from(CREDS).toString("base64");
          // res.json({status:true,Scan_Id })
          console.log(`
====================  SESSION ID  ==========================                   
SESSION-ID ==> ${Scan_Id}
-------------------   SESSION CLOSED   -----------------------
`);

          let msgsss = await Smd.sendMessage(user, {
            text: `GHOST-MD=>;;;${Scan_Id}`,
          });
          await Smd.sendMessage(user, { text: MESSAGE }, { quoted: msgsss });
          await delay(1000);
          try {
            await fs.emptyDirSync(__dirname + "/ghost_baileys");
          } catch (e) {}
        }

        Smd.ev.on("creds.update", saveCreds);

        if (connection === "close") {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
          // console.log("Reason : ",DisconnectReason[reason])
          if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed!");
            // GHOST().catch(err => console.log(err));
          } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server!");
            //  GHOST().catch(err => console.log(err));
          } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...");
            GHOST().catch((err) => console.log(err));
          } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut!");
            // GHOST().catch(err => console.log(err));
          } else {
            console.log("Connection closed with bot. Please run again.");
            console.log(reason);
            //process.exit(0)
          }
        }
      });
    } catch (err) {
      console.log(err);
      await fs.emptyDirSync(__dirname + "/ghost_baileys");
    }
  }

  GHOST().catch(async (err) => {
    console.log(err);
    await fs.emptyDirSync(__dirname + "/ghost_baileys");

    //// MADE BY BLACK CASTRO INC - 2024
  });
});

app.listen(PORT, () =>
  console.log(`Ghost-Qr Server Running on Port http://localhost:${PORT}`),
);
