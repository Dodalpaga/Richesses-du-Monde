const clientIO = io();
import { createPawn, updatePawns, removePawn } from "./pawns.js";
import { createCard, updateCards } from "./cards.js";
var $rollButton = $(".roll-button"); // The roll dice button
var $diceResults = $(".resultsArea"); // The dice roll results div
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
  createPawn(
    clientIO,
    data.id,
    data.coordinates.x,
    data.coordinates.y,
    data.color
  );
  console.log("New player :", data.id, data.coordinates.x, data.coordinates.y);
});

clientIO.on("updatePawns", (pawn) => {
  updatePawns(pawn);
});

clientIO.on("updateCards", (card) => {
  updateCards(card);
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

clientIO.on("playersList", (playersList) => {
  outputPlayersList(playersList);
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

function outputPlayersList(playersList) {
  var playersList1 = document.getElementById("player1");
  var playersList2 = document.getElementById("player2");
  $("#player1").empty();
  $("#player2").empty();
  var element1 = document.createElement("option");
  var element2 = document.createElement("option");
  element1.innerText = "Select an option";
  element2.innerText = "Select an option";
  element1.style.cssText =
    "background:${color};font-weight:bold;font-size:20px;";
  element2.style.cssText =
    "background:${color};font-weight:bold;font-size:20px;";
  playersList1.append(element1);
  playersList2.append(element2);
  for (var i = 0; i < playersList["users"].length; i++) {
    let color = playersList["users"][i].color;
    var element1 = document.createElement("option");
    var element2 = document.createElement("option");
    element1.innerText = playersList["users"][i].username;
    element2.innerText = playersList["users"][i].username;
    element1.style.cssText =
      "background:${color};font-weight:bold;font-size:20px;";
    element2.style.cssText =
      "background:${color};font-weight:bold;font-size:20px;";
    playersList1.append(element1);
    playersList2.append(element2);
  }
}

$rollButton.click(function () {
  clientIO.emit("roll user");
});

function logDice(message) {
  var $el = $("<li>").text(message);
  $diceResults.prepend($el);
}

clientIO.on("user rolled", function (data) {
  logDice("User " + data.username + " rolled: " + data.roll);
});

// $(document).on("mousemove", function (e) {
//   clientIO.emit("mouse_activity", {
//     x: e.pageX / window.innerWidth,
//     y: e.pageY / window.innerHeight,
//   });
// });

// clientIO.on("all_mouse_activity", function (data) {
//   if ($('.pointer[session_id="' + data.session_id + '"]').length <= 0) {
//     $("body").append(
//       '<i class="pointer fas fa-mouse-pointer fa-3x" ' +
//         'session_id="' +
//         data.session_id +
//         '" style="color:' +
//         data.color +
//         '"></i>'
//     );
//   }
//   var $pointer = $('.pointer[session_id="' + data.session_id + '"]');

//   $pointer.css("left", data.coords.x * window.innerWidth + 15);
//   $pointer.css("top", data.coords.y * window.innerHeight + 15);
// });

createCard(clientIO, "card1", "../imgs/card.png", 300, 300);
