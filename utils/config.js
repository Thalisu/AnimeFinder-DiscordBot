require("dotenv").config();
const token = process.env.TOKEN;
const apiUrl = process.env.API;
const guildId = process.env.GUILD_ID;
const clientId = process.env.CLIENT_ID;

module.exports = {
  token,
  apiUrl,
  guildId,
  clientId,
};
