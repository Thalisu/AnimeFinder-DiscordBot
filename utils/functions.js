const timeoutDelete = (interaction) => {
  setTimeout(() => {
    interaction.deleteReply() || interaction.delete();
  }, 5000);
};

module.exports = { timeoutDelete };
