let cards = [];

function createCard(room, id, ImgPath, x, y) {
  const card = { room, id, ImgPath, x, y };
  cards.push(card);
}

function getCard(room, id) {
  return cards.find((card) => card.room === room && card.id === id);
}

function getRoomCards(room) {
  var current_cards = cards.filter((card) => card.room === room);
  return current_cards;
}

function moveCard(room, id, x, y) {
  var movedCard = getCard(room, id);
  if (movedCard) {
    movedCard.x = x;
    movedCard.y = y;
  }
}

function wipeCards(room) {
  // Remove all cards from a room
  cards = cards.filter((card) => card.room !== room);
}

module.exports = {
  createCard,
  moveCard,
  getRoomCards,
  wipeCards,
};
