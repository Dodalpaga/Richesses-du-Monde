const clientIO = io({
  transports: ["polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});
import { createPawn, updatePawns, removePawn } from "./pawns.js";
import { createCard, updateCard } from "./client_cards.js";
import {
  logDice,
  outputPlayersList,
  shareTransaction,
  outputRoomDetails,
} from "./interactions.js";
var $rollButton = $(".roll-button"); // The roll dice button
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

clientIO.on("updatePlayers", (playersList) => {
  outputPlayersList(playersList);
});

clientIO.on("updateCard", (card) => {
  updateCard(card);
});

clientIO.on("createCard", (card) => {
  createCard(clientIO, card.id, card.ImgPath, card.x, card.y);
});

clientIO.on("shareTransaction", (transaction) => {
  shareTransaction(transaction);
});

clientIO.on("user rolled", function (data) {
  logDice(data.username + " rolled: " + data.roll);
});

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
// Create a function so that the news can be displayed on the page when news-button is clicked

function displayNews() {
  var newsArray = [
    { title: "News 1", content: "Content 1" },
    { title: "News 2", content: "Content 2" },
  ];
  // Create a variable to store the news
  // Create a for loop to loop through the news array
  const random = Math.floor(Math.random() * newsArray.length);
  var news = "";

  // Create a variable to store the news
  news =
    news +
    "<div class='news-item' style='text-align:center'><h3>" +
    newsArray[random].title +
    "</h3><p>" +
    newsArray[random].content +
    "</p></div>";

  console.log(news);

  // Display the news on the page
  document.getElementById("newsArea").innerHTML = news;
}

document.getElementById("news-button").addEventListener("click", displayNews);
document
  .getElementById("submitTransaction")
  .addEventListener("click", makeTransaction);

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
