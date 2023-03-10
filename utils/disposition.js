var { createCard } = require("./cards");
var fs = require("fs");
var files = fs.readdirSync("./public/imgs/liste_cartes_png_red");
function createDisposition(socket) {
  // for each file in the directory, create a card up to 9 on the same row
  files.forEach((file, index) => {
    createCard(
      socket.room,
      file,
      "./imgs/liste_cartes_png_red/" + file,
      0.0051 + (index % 9) * 0.11,
      0.005 + Math.floor(index / 9) * 0.047
    );
  });
}

module.exports = { createDisposition };
