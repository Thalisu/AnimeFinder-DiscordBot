const { apiUrl } = require("../../utils/config");
const { axiosGet } = require("../../utils/functions");

const getAll = async () => {
  const response = await axiosGet(`${apiUrl}/recents`);
  return response;
};

module.exports = {
  getAll,
};
