const { apiUrl } = require("../../utils/config");
const { axiosGet } = require("../../utils/functions");

const getAll = async () => {
  const response = await axiosGet(`${apiUrl}/calendar`);
  return response;
};

module.exports = {
  getAll,
};
