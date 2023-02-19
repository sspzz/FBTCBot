var punks = require("../punks/punks.json");

module.exports = {
  getPunks: function getPunks() {
    return punks.data;
  },
  getPunk: function getPunk(ordinalId) {
    return this.getPunks().find((p) => p.id == ordinalId);
  },
};
