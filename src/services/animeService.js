const axios = require("axios");
const { apiUrl } = require("../../utils/config");

const search = async (anime) => {
  const { data } = await axios.get(
    `${apiUrl}/search/${anime.replace(" ", "+")}`
  );
  return data;
};

const searchEps = async (anime) => {
  const { data } = await axios.get(`${apiUrl}/eps/${anime}`);
  return data;
};

const getVideo = async (anime) => {
  const { data } = await axios.get(`${apiUrl}/see/${anime}`);
  return data;
};

module.exports = {
  search,
  searchEps,
  getVideo,
};
