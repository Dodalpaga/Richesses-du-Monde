const clientIO = io();
import { createPawn, updatePawns, removePawn } from "./pawns.js";
import { createCard, updateCard } from "./client_cards.js";
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

clientIO.on("removePawn", (id) => {
  removePawn(id);
});

clientIO.on("removeCursor", (session_id) => {
  let divToRemove = document.querySelector(
    '.pointer[session_id="' + session_id + '"]'
  );
  if (divToRemove) {
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

clientIO.on("updatePlayers", (playersList) => {
  outputPlayersList(playersList);
});
function outputPlayersList(playersList) {
  var playersList1 = document.getElementById("player1");
  var playersList2 = document.getElementById("player2");
  $("#player1").empty();
  $("#player2").empty();
  var element1 = document.createElement("option");
  var element2 = document.createElement("option");
  element1.innerText = "Select option";
  element2.innerText = "Select option";
  element1.style.cssText =
    "background:#0563af;font-weight:bold;font-size:20px;";
  element2.style.cssText =
    "background:#0563af;font-weight:bold;font-size:20px;";
  playersList1.append(element1);
  playersList2.append(element2);
  var element1 = document.createElement("option");
  var element2 = document.createElement("option");
  element1.innerText = "BANK";
  element2.innerText = "BANK";
  element1.style.cssText =
    "background:#3d3d3d;font-weight:bold;font-size:20px;";
  element2.style.cssText =
    "background:#3d3d3d;font-weight:bold;font-size:20px;";
  playersList1.append(element1);
  playersList2.append(element2);
  for (var i = 0; i < playersList["users"].length; i++) {
    let color = playersList["users"][i].color;
    var element1 = document.createElement("option");
    var element2 = document.createElement("option");
    element1.innerText = playersList["users"][i].username;
    element2.innerText = playersList["users"][i].username;
    element1.style.cssText =
      "background:" + color + ";font-weight:bold;font-size:20px;";
    element2.style.cssText =
      "background:" + color + ";font-weight:bold;font-size:20px;";
    playersList1.append(element1);
    playersList2.append(element2);
  }
}

clientIO.on("updateCard", (card) => {
  updateCard(card);
});

clientIO.on("shareTransaction", (transaction) => {
  shareTransaction(transaction);
});
function shareTransaction(transaction) {
  var $el = $("<li style='height:10px'>").text(" ");
  $diceResults.prepend($el);
  var $el = $("<li>").text(
    transaction.maker +
      " " +
      "made a transaction : " +
      transaction.player1 +
      " gave " +
      transaction.player2 +
      " " +
      transaction.amount +
      " $"
  );
  $diceResults.prepend($el);
}

clientIO.on("user rolled", function (data) {
  logDice(data.username + " rolled: " + data.roll);
});
function logDice(message) {
  var $el = $("<li style='height:10px'>").text(" ");
  $diceResults.prepend($el);
  var $el = $("<li>").text(message);
  $diceResults.prepend($el);
}

function makeTransaction() {
  var player1 = document.getElementById("player1").value;
  var player2 = document.getElementById("player2").value;
  var amount = document.getElementById("amount").value;
  if (player1 == "Select option" || player2 == "Select option") {
    alert("Please select a player");
  } else if (player1 == player2) {
    alert("Please select different players");
  } else if (amount == "") {
    alert("Please enter an amount");
  } else {
    clientIO.emit("makeTransaction", {
      player1: player1,
      player2: player2,
      amount: amount,
    });
    document.getElementById("amount").value = "";
    document.getElementById("player1").value = "Select option";
    document.getElementById("player2").value = "Select option";
  }
}

document.getElementById("submit").addEventListener("click", makeTransaction);

$rollButton.click(function () {
  clientIO.emit("roll user");
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

var i = 0;

function myLoop() {
  //  create a loop function
  setTimeout(function () {
    //  call a 3s setTimeout when the loop is called
    i++; //  increment the counter
    if (i <= 1) {
      //24
      //  if the counter < 10, call the loop function
      for (var j = 0; j < 4; j++) {
        //6
        createCard(
          clientIO,
          "card" + (6 * i - 5 + j),
          "../imgs/card.png",
          0.66 + j * 0.06,
          0.005 + (i - 1) * 0.05
        );
      }
      myLoop();
    }
  }, 20);
}
myLoop();
