const { Client, IntentsBitField } = require("discord.js");
const { token } = require("../utils/config");

const getFiles = require("../utils/getFiles");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

getFiles(client, `${__dirname}/events`);


client.login(token);
