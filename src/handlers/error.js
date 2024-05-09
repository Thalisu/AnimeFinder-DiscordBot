const { error } = require("../../utils/embeds");
const { timeoutDelete } = require("../../utils/functions");

const sendError = async (interaction, msg, code) => {
  await interaction.editReply({ embeds: [error(msg, code)] });
  timeoutDelete(interaction);
  return true;
};

module.exports = async (interaction, value, request) => {
  let isError = false;
  if (value instanceof Error) {
    isError = await sendError(interaction, value, 0);
  } else if (value.length > 24) {
    isError = await sendError(interaction, request, 1);
  } else if (value.length < 1) {
    isError = await sendError(interaction, request, 2);
  }
  return isError;
};
