const axios = require("axios");
const { apiUrl } = require("../../utils/config");

const refetch = async (url, retries = 3, err, delay = 3000) => {
  if (retries > 0) {
    console.log("refetching");
    await new Promise((resolve) => setTimeout(resolve, delay));
    return axiosGet(url, retries - 1);
  }

  return new Error(err.message);
};

const axiosGet = async (url, retries = 3, delay) => {
  try {
    const response = await axios.get(url);
    return response.data.length === 0 && retries > 0
      ? await refetch(url, retries)
      : response.data;
  } catch (err) {
    return refetch(url, retries, err);
  }
};

const search = async (anime) => {
  const response = await axiosGet(
    `${apiUrl}/search/${anime.replace(" ", "+")}`
  );
  return response;
};

const searchEps = async (anime) => {
  const response = await axiosGet(`${apiUrl}/eps/${anime}`);
  return response;
};

const getVideo = async (anime) => {
  const response = await axiosGet(`${apiUrl}/see/${anime}`);
  return response;
};

module.exports = {
  search,
  searchEps,
  getVideo,
};
