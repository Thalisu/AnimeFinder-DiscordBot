const axios = require("axios");
const { apiUrl } = require("../../utils/config");

const search = async (anime, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(
      `${apiUrl}/search/${anime.replace(" ", "+")}`
    );
    return response.data;
  } catch (err) {
    if (retries > 0) {
      console.time("t");
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.timeEnd("t");
      return search(anime, retries - 1, delay);
    }
    return new Error(err);
  }
};

const searchEps = async (anime, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(`${apiUrl}/eps/${anime}`);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log("retry");
      await new Promise((resolve) => setTimeout(resolve, delay));
      return searchEps(anime, retries - 1, delay);
    }
    return new Error(err);
  }
};

const getVideo = async (anime, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(`${apiUrl}/see/${anime}`);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log("retry");
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getVideo(anime, retries - 1, delay);
    }
    return new Error(err);
  }
};

module.exports = {
  search,
  searchEps,
  getVideo,
};
