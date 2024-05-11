const { apiUrl } = require("../../utils/config");
const { axiosGet } = require("../../utils/functions");

const search = async (anime) => {
  const response = await axiosGet(
    `${apiUrl}/anime/search/${anime.replace(" ", "+")}`
  );
  return response;
};

const searchEps = async (anime) => {
  const response = await axiosGet(`${apiUrl}/anime/eps/${anime}`);
  return response;
};

const getVideo = async (anime) => {
  const response = await axiosGet(`${apiUrl}/anime/see/${anime}`);
  return response;
};

module.exports = {
  search,
  searchEps,
  getVideo,
};
