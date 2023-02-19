// const request = require("request");
// const util = require("util");
require("dotenv").config();

module.exports = {
  rgrep: async function rgrep(uri, exp) {
    // get uri, grep for exp
    return uri + exp;
  },
};
