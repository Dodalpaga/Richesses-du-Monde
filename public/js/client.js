const clientIO = io();
const timer = 40000;
const appName = "--Richesses du Monde--";

const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

var stage = new Konva.Stage({
  container: "container",
  width: document.getElementById("game-container").clientWidth,
  height: document.getElementById("game-container").clientHeight,
});

var layer = new Konva.Layer();
var radius = 20;
var rectX = stage.width() / 2 - radius;
var rectY = stage.height() / 2 - radius;

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

clientIO.on("removePawn", (id) => {
  removePawn(id);
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

const chatMessages = document.querySelector(".chat-messages");
clientIO.on("message", (messageObj) => {
  outputMessage(messageObj);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

clientIO.on("roomUsers", (roomDetails) => {
  outputRoomDetails(roomDetails);
});

function outputMessage(messageObj) {
  let div = document.createElement("div");
  div.classList.add("message");

  let message = messageObj.message;
  if (messageObj.username === appName) {
    message = `<strong style='color: orange'>${message}</strong>`;
  }

  div.innerHTML = `<p class="meta">${messageObj.username} <span>${messageObj.time}</span></p><p class="text">${message}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomDetails(roomDetails) {
  document.getElementById("room-name").innerText = roomDetails.room;
  document.getElementById("users").innerHTML = `${roomDetails.users
    .map(
      (user) =>
        `<p><i class="fas fa-dot-circle" style="color:${user.color}"></i> ${user.username}<br>(${user.money} $)</p>`
    )
    .join("")}`;
}

function createPawn(id, x = rectX, y = rectY, color = "grey") {
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
    box.y(Math.min(box.y(), stage.height() - box.radius()));
    box.x(Math.max(box.x(), box.radius()));
    box.x(Math.min(box.x(), stage.width() - box.radius()));
    clientIO.emit("dragging", {
      id: box.id(),
      x: box.x(),
      y: box.y(),
    });
  });

  layer.add(box);
  stage.add(layer);
}

function updatePawns(pawn) {
  // console.log(pawn.id);
  var movedPawn = stage.findOne("#" + pawn.id);
  // console.log(movedPawn);
  movedPawn.x(pawn.coordinates.x);
  movedPawn.y(pawn.coordinates.y);
  layer.draw();
  stage.add(layer);
}

function removePawn(pawn_id) {
  var pawn = stage.findOne("#" + pawn_id);
  pawn.destroy();
  layer.draw();
  stage.add(layer);
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
