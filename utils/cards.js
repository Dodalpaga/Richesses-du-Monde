let cards = [];

function createCard(room, id, ImgPath, x, y) {
  const card = { room, id, ImgPath, x, y };
  cards.push(card);
}

function getCard(id) {
  return cards.find((card) => card.id === id);
}

function moveCard(id, x, y) {
  var movedCard = getCard(id);
  if (movedCard) {
    movedCard.x = x;
    movedCard.y = y;
  }
}

function getRoomCards(room) {
  var current_cards = cards.filter((card) => card.room === room);
  return current_cards;
}

function wipeCards() {
  cards = [];
}

module.exports = {
  createCard,
  getCard,
  moveCard,
  getRoomCards,
  wipeCards,
};
