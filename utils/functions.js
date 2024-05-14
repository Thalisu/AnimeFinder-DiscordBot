const axios = require("axios");

const timeoutDelete = (interaction) => {
  setTimeout(() => {
    if (typeof interaction.deleteReply === "function") {
      interaction.deleteReply();
    } else if (typeof interaction.delete === "function") interaction.delete();
  }, 5000);
};

const refetch = async (url, retries = 3, err, delay = 3000) => {
  if (retries > 0) {
    console.log("refetching");
    await new Promise((resolve) => setTimeout(resolve, delay));
    return axiosGet(url, retries - 1);
  }

  return new Error(err.message);
};

const axiosGet = async (url, retries = 3) => {
  try {
    const response = await axios.get(url);
    return response.data.length === 0 && retries > 0
      ? await refetch(url, retries)
      : response.data;
  } catch (err) {
    return refetch(url, retries, err);
  }
};

module.exports = { timeoutDelete, axiosGet };
