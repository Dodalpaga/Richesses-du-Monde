var { createCard } = require("./cards");
function createDisposition(socket) {
  createCard(
    socket.room,
    "allemagne_eolien",
    "../imgs/vert_clair/allemagne_eolien.png",
    0.66 + 0 * 0.1,
    0.005 + 0 * 0.06
  );
  createCard(
    socket.room,
    "allemagne_solaire",
    "../imgs/vert_clair/allemagne_solaire.png",
    0.66 + 1 * 0.1,
    0.005 + 0 * 0.06
  );
  createCard(
    socket.room,
    "espagne_eolien",
    "../imgs/vert_clair/espagne_eolien.png",
    0.66 + 0 * 0.1,
    0.005 + 1 * 0.06
  );
  createCard(
    socket.room,
    "espagne_solaire",
    "../imgs/vert_clair/espagne_solaire.png",
    0.66 + 1 * 0.1,
    0.005 + 1 * 0.06
  );
}

module.exports = { createDisposition };
