var { createCard } = require("./cards");
function createDisposition(socket) {
  createLightGreen(socket);
  createDarkGreen(socket);
  createPurple(socket);
}

function createLightGreen(socket) {
  createCard(
    socket.room,
    "allemagne_eolien",
    "../imgs/vert_clair/allemagne_eolien.png",
    0.41 + 0 * 0.11,
    0.005 + 0 * 0.07
  );
  createCard(
    socket.room,
    "allemagne_solaire",
    "../imgs/vert_clair/allemagne_solaire.png",
    0.41 + 1 * 0.11,
    0.005 + 0 * 0.07
  );
  createCard(
    socket.room,
    "espagne_eolien",
    "../imgs/vert_clair/espagne_eolien.png",
    0.41 + 0 * 0.11,
    0.005 + 1 * 0.07
  );
  createCard(
    socket.room,
    "espagne_solaire",
    "../imgs/vert_clair/espagne_solaire.png",
    0.41 + 1 * 0.11,
    0.005 + 1 * 0.07
  );
  createCard(
    socket.room,
    "espagne_tourisme",
    "../imgs/vert_clair/espagne_tourisme.png",
    0.41 + 2 * 0.11,
    0.005 + 1 * 0.07
  );
  createCard(
    socket.room,
    "france_ble",
    "../imgs/vert_clair/france_ble.png",
    0.41 + 0 * 0.11,
    0.005 + 2 * 0.07
  );
  createCard(
    socket.room,
    "france_mais",
    "../imgs/vert_clair/france_mais.png",
    0.41 + 1 * 0.11,
    0.005 + 2 * 0.07
  );
  createCard(
    socket.room,
    "france_tourisme",
    "../imgs/vert_clair/france_tourisme.png",
    0.41 + 2 * 0.11,
    0.005 + 2 * 0.07
  );
  createCard(
    socket.room,
    "italie_solaire",
    "../imgs/vert_clair/italie_solaire.png",
    0.41 + 0 * 0.11,
    0.005 + 3 * 0.07
  );
  createCard(
    socket.room,
    "italie_tourisme",
    "../imgs/vert_clair/italie_tourisme.png",
    0.41 + 1 * 0.11,
    0.005 + 3 * 0.07
  );
  createCard(
    socket.room,
    "norvege_hydraulique",
    "../imgs/vert_clair/norvege_hydraulique.png",
    0.41 + 2 * 0.11,
    0.005 + 0 * 0.07
  );
  createCard(
    socket.room,
    "royaume_uni_eolien",
    "../imgs/vert_clair/royaume_uni_eolien.png",
    0.41 + 0 * 0.11,
    0.005 + 4 * 0.07
  );
  createCard(
    socket.room,
    "royaume_uni_laine",
    "../imgs/vert_clair/royaume_uni_laine.png",
    0.41 + 1 * 0.11,
    0.005 + 4 * 0.07
  );
  createCard(
    socket.room,
    "ukraine_fer",
    "../imgs/vert_clair/ukraine_fer.png",
    0.41 + 2 * 0.11,
    0.005 + 3 * 0.07
  );
}

function createDarkGreen(socket) {
  createCard(
    socket.room,
    "russie_aluminium",
    "../imgs/vert_fonce/russie_aluminium.png",
    0.41 + 0 * 0.11,
    0.005 + 5 * 0.07
  );
  createCard(
    socket.room,
    "russie_ble",
    "../imgs/vert_fonce/russie_ble.png",
    0.41 + 1 * 0.11,
    0.005 + 5 * 0.07
  );
  createCard(
    socket.room,
    "russie_charbon",
    "../imgs/vert_fonce/russie_charbon.png",
    0.41 + 2 * 0.11,
    0.005 + 5 * 0.07
  );
  createCard(
    socket.room,
    "russie_cobalt",
    "../imgs/vert_fonce/russie_cobalt.png",
    0.41 + 2 * 0.11,
    0.005 + 4 * 0.07
  );
  createCard(
    socket.room,
    "russie_cuivre",
    "../imgs/vert_fonce/russie_cuivre.png",
    0.41 + 0 * 0.11,
    0.005 + 6 * 0.07
  );
  createCard(
    socket.room,
    "russie_fer",
    "../imgs/vert_fonce/russie_fer.png",
    0.41 + 1 * 0.11,
    0.005 + 6 * 0.07
  );
  createCard(
    socket.room,
    "russie_gaz",
    "../imgs/vert_fonce/russie_gaz.png",
    0.41 + 2 * 0.11,
    0.005 + 6 * 0.07
  );
  createCard(
    socket.room,
    "russie_or",
    "../imgs/vert_fonce/russie_or.png",
    0.41 + 0 * 0.11,
    0.005 + 7 * 0.07
  );
  createCard(
    socket.room,
    "russie_petrole",
    "../imgs/vert_fonce/russie_petrole.png",
    0.41 + 1 * 0.11,
    0.005 + 7 * 0.07
  );
  createCard(
    socket.room,
    "russie_plomb",
    "../imgs/vert_fonce/russie_plomb.png",
    0.41 + 2 * 0.11,
    0.005 + 7 * 0.07
  );
  createCard(
    socket.room,
    "russie_uranium",
    "../imgs/vert_fonce/russie_uranium.png",
    0.41 + 0 * 0.11,
    0.005 + 7 * 0.07
  );
}

function createPurple(socket) {
  createCard(
    socket.room,
    "afrique_or",
    "../imgs/violet/afrique_or.png",
    0.41 + 0 * 0.11,
    0.005 + 8 * 0.07
  );
  createCard(
    socket.room,
    "cameroun_cacao",
    "../imgs/violet/cameroun_cacao.png",
    0.41 + 1 * 0.11,
    0.005 + 8 * 0.07
  );
  createCard(
    socket.room,
    "ethiopie_bois",
    "../imgs/violet/ethiopie_bois.png",
    0.41 + 2 * 0.11,
    0.005 + 8 * 0.07
  );
  createCard(
    socket.room,
    "ethiopie_cafe",
    "../imgs/violet/ethiopie_cafe.png",
    0.41 + 0 * 0.11,
    0.005 + 9 * 0.07
  );

  createCard(
    socket.room,
    "ghana_cacao",
    "../imgs/violet/ghana_cacao.png",
    0.41 + 1 * 0.11,
    0.005 + 9 * 0.07
  );
  createCard(
    socket.room,
    "ivoire_cacao",
    "../imgs/violet/ivoire_cacao.png",
    0.41 + 2 * 0.11,
    0.005 + 9 * 0.07
  );
  createCard(
    socket.room,
    "kenya_the",
    "../imgs/violet/kenya_the.png",
    0.41 + 0 * 0.11,
    0.005 + 10 * 0.07
  );
  createCard(
    socket.room,
    "namibie_uranium",
    "../imgs/violet/namibie_uranium.png",
    0.41 + 1 * 0.11,
    0.005 + 10 * 0.07
  );
  createCard(
    socket.room,
    "niger_uranium",
    "../imgs/violet/niger_uranium.png",
    0.41 + 2 * 0.11,
    0.005 + 10 * 0.07
  );
  createCard(
    socket.room,
    "nigeria_cacao",
    "../imgs/violet/nigeria_cacao.png",
    0.41 + 0 * 0.11,
    0.005 + 11 * 0.07
  );
  createCard(
    socket.room,
    "nigeria_bois",
    "../imgs/violet/nigeria_bois.png",
    0.41 + 1 * 0.11,
    0.005 + 11 * 0.07
  );
  createCard(
    socket.room,
    "RDC_bois ",
    "../imgs/violet/RDC_bois.png",
    0.41 + 2 * 0.11,
    0.005 + 11 * 0.07
  );
  createCard(
    socket.room,
    "RDC_cobalt",
    "../imgs/violet/RDC_cobalt.png",
    0.41 + 0 * 0.11,
    0.005 + 12 * 0.07
  );
  createCard(
    socket.room,
    "zambie_cobalt",
    "../imgs/violet/zambie_cobalt.png",
    0.41 + 1 * 0.11,
    0.005 + 12 * 0.07
  );
}

module.exports = { createDisposition };
