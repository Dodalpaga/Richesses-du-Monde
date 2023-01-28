var container = document.getElementById("game-container");
var Game = new Konva.Stage({
  container: "game-container",
  width: container.clientWidth,
  height: container.clientHeight,
});
var previousX = Game.width();
var previousY = Game.height();

function resizeBoard() {
  previousX = Game.width();
  previousY = Game.height();
  Game.width(container.clientWidth);
  Game.height(container.clientHeight);
  var shapes = Game.find("Circle");

  // apply transition to all nodes in the array
  shapes.forEach(function (shape) {
    shape.x((shape.x() / previousX) * Game.width());
    shape.y((shape.y() / previousY) * Game.height());
  });
}
$(window).resize(function () {
  resizeBoard();
});

var GameLayer = new Konva.Layer();
var radius = 20;

function createPawn(client, id, x, y, color = "grey") {
  var box = new Konva.Circle({
    id: id,
    x: x,
    y: y,
    radius: radius,
    fill: color,
    stroke: "black",
    strokeWidth: 4,
    draggable: true,
  });

  // add cursor styling
  box.on("mouseover", function () {
    document.body.style.cursor = "pointer";
  });
  box.on("mouseout", function () {
    document.body.style.cursor = "default";
  });
  box.on("dragmove", () => {
    box.y(Math.max(box.y(), box.radius()));
    box.y(Math.min(box.y(), Game.height() - box.radius()));
    box.x(Math.max(box.x(), box.radius()));
    box.x(Math.min(box.x(), Game.width() - box.radius()));
  });
  box.on("dragend", () => {
    client.emit("dragPawn", {
      id: box.id(),
      x: box.x() / Game.width(),
      y: box.y() / Game.height(),
    });
  });

  GameLayer.add(box);
  Game.add(GameLayer);
}

function updatePawns(pawn) {
  var movedPawn = Game.findOne("#" + pawn.id);
  movedPawn.x(pawn.coordinates.x * Game.width());
  movedPawn.y(pawn.coordinates.y * Game.height());
  GameLayer.draw();
  Game.add(GameLayer);
}

function removePawn(pawn_id) {
  var pawn = Game.findOne("#" + pawn_id);
  pawn.destroy();
  GameLayer.draw();
  Game.add(GameLayer);
}

export { createPawn, updatePawns, removePawn };
