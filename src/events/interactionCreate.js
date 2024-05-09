const { searching } = require("../../utils/embeds");

const animeService = require("../services/animeService");

const stringSelectCollector = require("../collectors/stringSelect");

const isError = require("../handlers/error");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "search")
    return;

  const animeRequest = interaction.options.getString("anime");

  await interaction.reply({ embeds: [searching(animeRequest, 0)] });

  const animes = await animeService.search(animeRequest);

  if (await isError(interaction, animes, animeRequest)) return;

  await stringSelectCollector(interaction, animes);

  return;
};
