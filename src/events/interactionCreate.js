const { EmbedBuilder, ComponentType } = require("discord.js");
const { searching } = require("../../utils/embeds");
const buttonsActionRow = require("../../utils/buttonsActionRow");

const animeService = require("../services/animeService");
const calendarService = require("../services/calendarService");

const stringSelectCollector = require("../collectors/stringSelect");

const isError = require("../handlers/error");
const { timeoutDelete } = require("../../utils/functions");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "search") {
    const animeRequest = interaction.options.getString("anime");

    await interaction.reply({ embeds: [searching(animeRequest, 0)] });

    const animes = await animeService.search(animeRequest);

    if (await isError(interaction, animes, animeRequest)) return;

    await stringSelectCollector(interaction, animes);

    return;
  } else if (interaction.commandName === "calendar") {
    await interaction.reply({ embeds: [searching(`calendar`, 3)] });

    const response = await calendarService.getAll();
    let index = 0;

    const calendar = new EmbedBuilder()
      .setTitle(response[index].day)
      .setDescription(
        response[index].data.map((d) => `\`\`\`${d.title}\`\`\``).join("")
      );

    const reply = await interaction.editReply({
      embeds: [calendar],
      components: [buttonsActionRow(index + 1, response.length)],
    });

    const paginationCollector = await reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    paginationCollector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        const r = await i.reply({
          content: `Somente **${interaction.user.username}** pode interagir com esses botões!`,
          ephemeral: true,
        });
        timeoutDelete(r);
        return;
      }

      await i.deferUpdate();
      index += i.customId === "next" ? 1 : -1;
      calendar
        .setTitle(response[index].day)
        .setDescription(
          response[index].data.map((d) => `\`\`\`${d.title}\`\`\``).join("")
        );

      await interaction.editReply({
        embeds: [calendar],
        components: [buttonsActionRow(index + 1, response.length)],
      });
      paginationCollector.resetTimer();
    });

    paginationCollector.on("end", async () => {
      await interaction.deleteReply();
      return;
    });
  }
  return;
};
