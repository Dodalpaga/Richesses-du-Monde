var container = document.getElementById("cards-container");
var cardBoard = new Konva.Stage({
  container: "cards-container",
  width: container.clientWidth - 20,
  height: container.clientHeight - 20,
});

var previousX = cardBoard.width();
var previousY = cardBoard.height();

function resizeCards() {
  previousX = cardBoard.width();
  previousY = cardBoard.height();
  cardBoard.width(container.clientWidth - 20);
  cardBoard.height(container.clientHeight - 20);
  var shapes = cardBoard.find("Image");

  // apply transition to all nodes in the array
  shapes.forEach(function (shape) {
    shape.x((shape.x() / previousX) * cardBoard.width());
    shape.y((shape.y() / previousY) * cardBoard.height());
    shape.width(container.clientWidth / 6.5);
    shape.height(container.clientWidth / 6.5 / 1.3706);
  });
}

$(window).resize(function () {
  resizeCards();
});

var CardsLayer = new Konva.Layer();

var width = container.clientWidth / 6.5;
var height = width / 1.3706;

function createCard(client, id, path, x, y) {
  var cardObj = new Image();
  cardObj.onload = function () {
    var card = new Konva.Image({
      id: id,
      x: x * cardBoard.width(),
      y: y * cardBoard.height(),
      width: width,
      height: height,
      image: cardObj,
      // cornerRadius: 10,
      draggable: true,
    });
    // add cursor styling
    card.on("mouseover", function () {
      document.body.style.cursor = "pointer";
    });
    card.on("mouseout", function () {
      document.body.style.cursor = "default";
    });
    card.on("dragmove", () => {
      card.y(Math.max(card.y(), 0));
      card.y(Math.min(card.y(), cardBoard.height() - card.height()));
      card.x(Math.max(card.x(), 0));
      card.x(Math.min(card.x(), cardBoard.width() - card.width()));
    });
    card.on("dragend", () => {
      client.emit("dragCard", {
        id: card.id(),
        x: card.x() / cardBoard.width(),
        y: card.y() / cardBoard.height(),
      });
    });

    CardsLayer.add(card);
    cardBoard.add(CardsLayer);
  };
  cardObj.src = path;
}

function updateCards(card) {
  var movedCard = cardBoard.findOne("#" + card.id);
  movedCard.x(card.coordinates.x * cardBoard.width());
  movedCard.y(card.coordinates.y * cardBoard.height());
  CardsLayer.draw();
  cardBoard.add(CardsLayer);
}

export { createCard, updateCards };
