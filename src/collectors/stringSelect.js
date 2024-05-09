const { ComponentType } = require("discord.js");

const { found, searching, error } = require("../../utils/embeds");
const { timeoutDelete } = require("../../utils/functions");
const createDDLActionRow = require("../../utils/ddlActionRow");

const animeService = require("../services/animeService");

const messageCollector = require("./message");

module.exports = async (interaction, animes) => {
  const actionRow = createDDLActionRow(interaction, animes);

  const reply = await interaction.editReply({
    embeds: [found(animes, 0)],
    components: [actionRow],
  });

  const animeCollector = await reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i) => i.customId === interaction.id,
    time: 30 * 1000,
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

    i.deferUpdate();

    interacted = true;
    animeCollector.stop();

    const formatedCurrentAnime =
      i.values.join().charAt(0).toUpperCase() +
      i.values.join().slice(1).replaceAll("-", " ");

    const currentAnime = i.values.join();

    await reply.edit({
      embeds: [searching(formatedCurrentAnime, 1)],
      components: [],
    });

    const eps = await animeService.searchEps(currentAnime);

    if (eps instanceof Error) {
      await reply.edit({ embeds: [error(animes, 0)] });
      timeoutDelete(reply);
      return;
    }

    await reply.edit({
      embeds: [found(eps, 1)],
    });

    await messageCollector(interaction, eps, formatedCurrentAnime);
  });
};
