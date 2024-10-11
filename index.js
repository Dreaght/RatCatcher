require('dotenv').config();

const mineflayer = require('mineflayer');

const Discord = require("discord-user-bots");
const client = new Discord.Client();

const catcherName = process.env.CATCHER_NAME || 'defaultCatcherName';
const ratName = process.env.RAT_NAME.toLowerCase() || 'defaultRatName';
const ratDiscordChannelID = process.env.RAT_DISCORD_CHANNEL_ID || 'defaultChannelID';
const catcherDiscordToken = process.env.CATCHER_DISCORD_TOKEN || 'defaultDiscordToken';

let ratIsSupposedToBeOnline = false;
let ratIsSupposedToBeCompletelyOffline = false
let ratIsCompletelyOffline = false

var sendingLimit = 0

const bot = mineflayer.createBot({
    host: 'mc.hypixel.net',
    username: catcherName,
    auth: 'microsoft',
    version: "1.8.9",
});

bot.once("spawn", () => {
    console.log("Catcher has joined!");
    console.log("Starting spectating on " + ratName)
    setTimeout(startFriendListing, 2000 + Math.floor(Math.random() * 200));
});

bot.on('message', (message) => {
    const messageText = message.getText().toLowerCase();
    if (messageText.includes(ratName)) {
        if (messageText.includes("joined")) {
            ratIsSupposedToBeOnline = true;
            ratIsSupposedToBeCompletelyOffline = false
            ratIsCompletelyOffline = false
            ratHasJoined()
        } else if (messageText.includes("left")) {
            ratIsSupposedToBeOnline = false;
            ratIsSupposedToBeCompletelyOffline = true
            ratIsCompletelyOffline = true
            ratHasLeft()
        }
    }

    if (message.text === "-----------------------------------------------------") {
        if (message.extra) { // Check if message.extra exists
            let matchLines = message.extra.filter(value =>
                value.getText().toLowerCase().includes(ratName));
            if (matchLines.length > 0) {
                let matchLine = matchLines[matchLines.length - 1].getText().toLowerCase();
                let isOnline = !matchLine.includes("offline");
                let isInLimbo = matchLine.includes("limbo");

                if (ratIsSupposedToBeOnline && !isOnline) {
                    ratIsCaughtOnOfflineStatus();
                }
                if (!ratIsSupposedToBeOnline && !isOnline) {
                    ratIsSupposedToBeCompletelyOffline = true
                }
                if (ratIsSupposedToBeOnline && isOnline) {
                    ratIsSupposedToBeCompletelyOffline = false
                }
                if (ratIsSupposedToBeCompletelyOffline && isOnline && !ratIsSupposedToBeOnline && !isInLimbo && !ratIsCompletelyOffline) {
                    ratIsSupposedToBeCompletelyOffline = false;
                    ratIsSupposedToBeOnline = true
                    ratIsCaughtOnTogglingOnlineStatus()
                }
            }
        }
    }
});

async function startFriendListing() {
    setInterval(async () => {
        bot.chat("/fl");
    }, 1000 + Math.floor(Math.random() * 100))
}

async function ratIsCaughtOnOfflineStatus() {
    console.log("Rat is caught on offline status!");

    if (sendingLimit === 0) {
        client.send(ratDiscordChannelID, {
            content: "Enable online status back! You are acting bad to me :(",
        });
        sendingLimit += 50;
    } else {
        sendingLimit -= 1;
    }
}

async function ratIsCaughtOnTogglingOnlineStatus() {
    console.log("Rat has toggled it's online status!");

    client.send(ratDiscordChannelID, {
        content: "Why have u been hiding that you are playing without me?",
    });
}

async function ratHasJoined() {
    console.log("The rat has joined!");

    client.send(ratDiscordChannelID, {
        content: "You've joined, brother, wish me to join too?",
    });
}

async function ratHasLeft() {
    console.log("The rat has left!");
}

bot.on('kicked', console.log)
bot.on('error', console.log)

client.login(catcherDiscordToken);
