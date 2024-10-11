# Rat Catcher

Tired when your friend playing without u on Hypixel and hiding that?
This can help you catch him xD

# Usage

Create `.env` file, put there these credentials:
```dotenv
CATCHER_DISCORD_TOKEN=<your discord user token goes here>
CATCHER_NAME=<bot nickname>
RAT_DISCORD_CHANNEL_ID=<friend's channel ID where u want to send messages>
RAT_NAME=<your friend name>
```

Run:
```shell
npm init
npm install
node index.js
```
# How it works

It compares the `/fl` command result with "join" and "left" messages.

If player joined and now offline in `/fl` and thereby it flags your friend as he switched to offline.
If player was offline in `/fl`
and now appeared without join message it means friend toggled online and was offline.
