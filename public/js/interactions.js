function logDice(message) {
  var $el = $("<li style='height:10px'>").text(" ");
  $diceResults.prepend($el);
  var $el = $("<li>").text(message);
  $diceResults.prepend($el);
}

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
var $diceResults = $(".resultsArea"); // The dice roll results div
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

function outputRoomDetails(roomDetails) {
  document.getElementById("room-name").innerText = roomDetails.room;
  document.getElementById("users").innerHTML = `${roomDetails.users
    .map(
      (user) =>
        `<p><i class="fas fa-dot-circle" style="color:${user.color}"></i> ${user.username}<br>(${user.money} $)</p>`
    )
    .join("")}`;
}

export { logDice, outputPlayersList, shareTransaction, outputRoomDetails };
