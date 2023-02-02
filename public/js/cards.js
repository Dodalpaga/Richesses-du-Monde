var container = document.getElementById("cards-container");
var card_stage = new Konva.Stage({
  container: "cards-container",
  width: container.clientWidth - 20,
  height: container.clientHeight - 20,
});

var card_layer = new Konva.Layer();
card_stage.add(card_layer);

var previousX = card_stage.width();
var previousY = card_stage.height();

var ratio = 16;
var width = container.clientWidth / ratio;
var height = width / 1.3706;

function resizeCards() {
  previousX = card_stage.width();
  previousY = card_stage.height();
  card_stage.width(container.clientWidth - 20);
  card_stage.height(container.clientHeight - 20);
  var shapes = card_stage.find("Image");

  // apply transition to all nodes in the array
  shapes.forEach(function (shape) {
    shape.x((shape.x() / previousX) * card_stage.width());
    shape.y((shape.y() / previousY) * card_stage.height());
    shape.width(container.clientWidth / ratio);
    shape.height(container.clientWidth / ratio / 1.3706);
  });
}

$(window).resize(function () {
  resizeCards();
});

function createCard(client, id, path, x, y) {
  var cardObj = new Image();
  cardObj.onload = function () {
    var card = new Konva.Image({
      id: id,
      x: x * card_stage.width(),
      y: y * card_stage.height(),
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
    card.on("pointerdown", () => {
      card.moveToTop();
      card.scaleX(3);
      card.scaleY(3);
      card.x(card.x() - card.width());
      card.y(card.y() - card.height());
    });
    card.on("pointerup", () => {
      card.scaleX(1);
      card.scaleY(1);
      card.x(card.x() + card.width());
      card.y(card.y() + card.height());
    });
    card.on("dragmove", () => {
      card.y(Math.max(card.y(), 0));
      card.y(Math.min(card.y(), card_stage.height() - card.height()));
      card.x(Math.max(card.x(), 0));
      card.x(Math.min(card.x(), card_stage.width() - card.width()));
    });
    card.on("dragend", () => {
      card.moveToTop();
      card.scaleX(1);
      card.scaleY(1);
      card.x(card.x() + card.width());
      card.y(card.y() + card.height());
      client.emit("dragCard", {
        id: card.id(),
        x: card.x() / card_stage.width(),
        y: card.y() / card_stage.height(),
      });
    });

    card_layer.add(card);
    card_stage.add(card_layer);
  };
  cardObj.src = path;
}

function updateCards(card) {
  var movedCard = card_stage.findOne("#" + card.id);
  movedCard.x(card.coordinates.x * card_stage.width());
  movedCard.y(card.coordinates.y * card_stage.height());
  card_stage.add(card_layer);
}

export { createCard, updateCards };
