const { EmbedBuilder, ComponentType } = require("discord.js");

const calendarService = require("../services/calendarService");

const buttonsActionRow = require("../../utils/buttonsActionRow");
const { searching } = require("../../utils/embeds");
const { timeoutDelete } = require("../../utils/functions");

module.exports = async (interaction) => {
  await interaction.reply({ embeds: [searching(`calendario`, 3)] });

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
};
