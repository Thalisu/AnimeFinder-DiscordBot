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
    components: [buttonsActionRow(ep.label, eps.length)],
  });

  const buttonsCollector = await reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    idle: 1_800_000,
  });

  buttonsCollector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      const r = await i.reply({
        content: `Somente **${interaction.user.username}** pode interagir com esses botões!`,
        ephemeral: true,
      });
      timeoutDelete(r);
      return;
    }

    await i.deferUpdate();
    const prevOrNext = i.customId === "next" ? 1 : -1;
    ep = eps.find((prev) => prev.label === ep.label + prevOrNext);
    await reply.edit({
      embeds: [searching(formatedCurrentAnime, 2, ep.label)],
      components: [],
    });
    const url = await animeService.getVideo(ep.value);
    await reply.edit({
      embeds: [video(url, formatedCurrentAnime, ep.label)],
      components: [buttonsActionRow(ep.label, eps.length)],
    });

    buttonsCollector.resetTimer();
    return;
  });

  buttonsCollector.on("end", async () => {
    await reply.delete();
    return;
  });
  return;
};
