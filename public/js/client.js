const clientIO = io();
const timer = 40000;
const appName = "--Richesses du Monde--";

const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

clientIO.emit("join", { username, room });

document.getElementById("greet-user").innerText = `${username}`;

clientIO.on("connect", () => {
  console.log("Connected to server...");
  clientIO.emit("newPlayer");
});

clientIO.on("newPlayer", (data) => {
  createPawn(data.id, data.coordinates.x, data.coordinates.y, data.color);
  console.log("New player :", data.id, data.coordinates.x, data.coordinates.y);
});

clientIO.on("updatePawns", (pawn) => {
  updatePawns(pawn);
});

clientIO.on("updateCards", (pawn) => {
  updateCards(pawn);
});

clientIO.on("removePawn", (id) => {
  removePawn(id);
});

clientIO.on("removeCursor", (session_id) => {
  console.log(session_id);
  let divToRemove = document.querySelector(
    '.pointer[session_id="' + session_id + '"]'
  );
  if (divToRemove) {
    console.log("remove");
    divToRemove.parentNode.removeChild(divToRemove);
  }
});

clientIO.on("disconnect", (reason) => {
  alert("Disconnected from server : " + reason);
  location.href = "/";
});

clientIO.on("usernameAlreadyUsed", () => {
  alert("Username already used");
  location.href = "/";
});

clientIO.on("roomFull", () => {
  alert("Room is full");
  location.href = "/";
});

clientIO.on("roomUsers", (roomDetails) => {
  outputRoomDetails(roomDetails);
});

function outputRoomDetails(roomDetails) {
  document.getElementById("room-name").innerText = roomDetails.room;
  document.getElementById("users").innerHTML = `${roomDetails.users
    .map(
      (user) =>
        `<p><i class="fas fa-dot-circle" style="color:${user.color}"></i> ${user.username}<br>(${user.money} $)</p>`
    )
    .join("")}`;
}

$(document).on("mousemove", function (e) {
  clientIO.emit("mouse_activity", { x: e.pageX, y: e.pageY });
});

clientIO.on("all_mouse_activity", function (data) {
  if ($('.pointer[session_id="' + data.session_id + '"]').length <= 0) {
    $("body").append(
      '<i class="pointer fas fa-mouse-pointer fa-3x" ' +
        'session_id="' +
        data.session_id +
        '" style="color:' +
        data.color +
        '"></i>'
    );
  }
  var $pointer = $('.pointer[session_id="' + data.session_id + '"]');

  $pointer.css("left", data.coords.x);
  $pointer.css("top", data.coords.y);
});

var Game = new Konva.Stage({
  container: "container",
  width: document.getElementById("game-container").clientWidth,
  height: document.getElementById("game-container").clientHeight,
});

var cardBoard = new Konva.Stage({
  container: "cards-container",
  width: document.getElementById("cardBoard").clientWidth,
  height: document.getElementById("cardBoard").clientHeight,
});

var GameLayer = new Konva.Layer();
var CardsLayer = new Konva.Layer();

var radius = 20;
var width = 100;
var height = 50;
var pawnX = Game.width() / 2 - radius;
var pawnY = Game.height() / 2 - radius;
var rectX = cardBoard.width() / 2 - width;
var rectY = cardBoard.height() / 2 - height;

function createPawn(id, x = pawnX, y = pawnY, color = "grey") {
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
    clientIO.emit("dragPawn", {
      id: box.id(),
      x: box.x(),
      y: box.y(),
    });
  });

  GameLayer.add(box);
  Game.add(GameLayer);
}

function updatePawns(pawn) {
  var movedPawn = Game.findOne("#" + pawn.id);
  movedPawn.x(pawn.coordinates.x);
  movedPawn.y(pawn.coordinates.y);
  GameLayer.draw();
  Game.add(GameLayer);
}

function updateCards(card) {
  var movedCard = Game.findOne("#" + card.id);
  movedCard.x(card.coordinates.x);
  movedCard.y(card.coordinates.y);
  CardsLayer.draw();
  cardBoard.add(CardsLayer);
}

function removePawn(pawn_id) {
  var pawn = Game.findOne("#" + pawn_id);
  pawn.destroy();
  GameLayer.draw();
  Game.add(GameLayer);
}

function createCard(id, x = rectX, y = rectY, color = "brown") {
  var card = new Konva.Rect({
    id: id,
    x: x,
    y: y,
    width: width,
    height: height,
    fill: color,
    stroke: "dark-brown",
    strokeWidth: 4,
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
    clientIO.emit("dragCard", {
      id: card.id(),
      x: card.x(),
      y: card.y(),
    });
  });

  CardsLayer.add(card);
  cardBoard.add(CardsLayer);
}

createCard("card1");
