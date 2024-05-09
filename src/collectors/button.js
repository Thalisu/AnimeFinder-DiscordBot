const { ComponentType } = require("discord.js");

const { error, searching, video } = require("../../utils/embeds");
const buttonsActionRow = require("../../utils/buttonsActionRow");
const { timeoutDelete } = require("../../utils/functions");

const animeService = require("../services/animeService");

module.exports = async (interaction, eps, ep, formatedCurrentAnime) => {
  const url = await animeService.getVideo(ep.value);

  if (url instanceof Error) {
    await interaction.editReply({ embeds: [error(animes, 0)] });
    timeoutDelete(interaction);
    return;
  }

  const reply = await interaction.editReply({
    embeds: [video(url, formatedCurrentAnime, ep.label)],
    components: [buttonsActionRow(ep, eps)],
  });

  const buttonsCollector = await reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 30 * 60000,
  });

  buttonsCollector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      const r = await i.reply({
        content: `Only **${interaction.user.username}** can interact with these buttons!`,
        ephemeral: true,
      });
      timeoutDelete(r);
      return;
    }

    await i.deferUpdate();
    const prevOrNext = i.customId === "next" ? 1 : -1;
    ep = eps.find((prev) => prev.label === ep.label + prevOrNext);
    await interaction.editReply({
      embeds: [searching(formatedCurrentAnime, 2, ep.label)],
      components: [],
    });
    const url = await animeService.getVideo(ep.value);
    await interaction.editReply({
      embeds: [video(url, formatedCurrentAnime, ep.label)],
      components: [buttonsActionRow(ep, eps)],
    });

    buttonsCollector.resetTimer();
  });

  buttonsCollector.on("end", async () => {
    await interaction.deleteReply();
    return;
  });
};
