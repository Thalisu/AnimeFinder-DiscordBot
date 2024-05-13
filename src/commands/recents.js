const { searching, found, video } = require("../../utils/embeds");
const createDDLActionRow = require("../../utils/ddlActionRow");

const animeService = require("../services/animeService");
const recentService = require("../services/recentService");

const { timeoutDelete } = require("../../utils/functions");
const { ComponentType } = require("discord.js");

module.exports = async (interaction) => {
  await interaction.reply({ embeds: [searching(`recentes`, 3)] });

  const animes = await recentService.getAll();

  const actionRow = createDDLActionRow(interaction, animes);

  const reply = await interaction.editReply({
    embeds: [found(animes, 0)],
    components: [actionRow],
  });

  const animeCollector = await reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i) => i.customId === interaction.id,
    idle: 30_000,
  });

  let interacted = false;

  animeCollector.on("end", async () => {
    if (!interacted) {
      await reply.edit({
        content: "timeout try again",
        embeds: [],
        components: [],
      });

      timeoutDelete(reply);
      return;
    }
  });

  animeCollector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      const r = await i.reply({
        content: `Only **${interaction.user.username}** can interact with that list!`,
        ephemeral: true,
      });
      timeoutDelete(r);
      return;
    }

    const selectedAnime = animes.find((a) => a.value === i.values.join()).label;

    i.deferUpdate();
    interacted = true;
    animeCollector.stop();

    await reply.edit({
      embeds: [searching(selectedAnime, 1)],
      components: [],
    });

    const url = await animeService.getVideo(i.values.join());

    await reply.edit({
      embeds: [video(url, selectedAnime)],
    });
    setTimeout(() => {
      reply.delete();
    }, 30 * 1000);
    return;
  });
};
