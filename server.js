var {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
var { getRoomCards, moveCard, wipeCards } = require("./utils/cards");
var { createDisposition } = require("./utils/disposition");
const path = require("path");
const http = require("http");
const express = require("express");
let app = express();
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  transports: ["polling"],
});

var fs = require("fs");
var array = fs.readFileSync("utils/actualites.txt").toString().split(";");
var actualites = [];
actualites.push(array[0]);
// for all element in arrray 1 to array.length, add element except first line to actualites
for (i = 1; i < array.length - 1; i++) {
  actualites.push(array[i].slice(1));
}

const userColors = ["#d9534f", "#5cb85c", "#5bc0de", "#f0ad4e"];

io.on("connection", (client) => {
  // Listen to join event
  client.on("join", ({ username, room }) => {
    client.room = room;

    // If username if not yet used in the room, and if the room is not full and if the game has already started join the room
    if (getRoomUsers(room).length >= 4) {
      client.emit("roomFull");
      return;
    } else {
      if (
        getRoomUsers(room).find(
          (ppl) => ppl.username === username && ppl.room === room
        )
      ) {
        client.emit("usernameAlreadyUsed");
        return;
      } else {
        client.join(room);
      }
    }
    // If i am the first player in the room :
    if (getRoomUsers(room).length === 0) {
      // Wipe the board
      wipeCards(client.room);
      // Create the cards
      createDisposition(client);
    }

    const usedColors = getRoomUsers(room)
      .filter((user) => user.color)
      .map((user) => user.color);
    const availableColors = userColors.filter(
      (color) => !usedColors.includes(color)
    );
    const userColor = availableColors[0];
    const userCoords = { x: 0.93, y: 0.92 };
    const user = userJoin(
      client.id,
      username,
      room,
      (money = 17500000),
      (color = userColor),
      (coordinates = userCoords)
    );
    console.log("Connected: " + user.username);

    // Emit list of users and room in the chat room
    io.to(room).emit("roomUsers", {
      room: room,
      users: getRoomUsers(room),
    });

    io.to(room).emit("updatePlayers", {
      users: getRoomUsers(room),
    });
  });

  client.on("dragPawn", (pawn) => {
    const user = getCurrentUser(client.id);
    if (user) {
      user.coordinates.x = pawn.x;
      user.coordinates.y = pawn.y;
      io.to(client.room).emit("updatePawns", {
        id: pawn.id,
        coordinates: user.coordinates,
      });
    }
  });

  client.on("dragCard", (card) => {
    console.log("Card from server : ", card);
    moveCard(client.room, card.id, card.x, card.y);
    io.to(client.room).emit("updateCard", {
      id: card.id,
      ImgPath: card.ImgPath,
      x: card.x,
      y: card.y,
    });
  });

  client.on("newPlayer", () => {
    const user = getCurrentUser(client.id);
    if (user) {
      io.to(user.room).emit("newPlayer", {
        id: user.id,
        coordinates: {
          x: user.coordinates.x,
          y: user.coordinates.y,
        },
        color: user.color,
      });
      for (player = 0; player < getRoomUsers(client.room).length; player++) {
        if (getRoomUsers(client.room)[player].id != user.id) {
          client.emit("newPlayer", {
            id: getRoomUsers(client.room)[player].id,
            coordinates: getRoomUsers(client.room)[player].coordinates,
            color: getRoomUsers(client.room)[player].color,
          });
        }
        io.to(client.room).emit("updatePawns", {
          id: getRoomUsers(client.room)[player].id,
          coordinates: getRoomUsers(client.room)[player].coordinates,
        });
      }
      for (i = 0; i < getRoomCards(client.room).length; i++) {
        var card = getRoomCards(client.room)[i];
        client.emit("createCard", {
          id: card.id,
          ImgPath: card.ImgPath,
          x: card.x,
          y: card.y,
        });
      }
    }
  });

  // client.on("mouse_activity", (data) => {
  //   const user = getCurrentUser(client.id);
  //   if (user) {
  //     client.broadcast.emit("all_mouse_activity", {
  //       session_id: client.id,
  //       coords: data,
  //       color: user.color,
  //     });
  //   }
  // });

  client.on("makeTransaction", (transaction) => {
    const user = getCurrentUser(client.id);
    if (user) {
      getRoomUsers(client.room).forEach((user) => {
        if (user.username == transaction.player1) {
          user.money = parseInt(user.money) - parseInt(transaction.amount);
        }
        if (user.username == transaction.player2) {
          user.money = parseInt(user.money) + parseInt(transaction.amount);
        }
      });
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
      if (transaction.player1 == user.username) {
        io.to(user.room).emit("shareTransaction", {
          player1: transaction.player1,
          player2: transaction.player2,
          maker: transaction.player1,
          amount: transaction.amount,
        });
      } else {
        if (transaction.player2 == user.username) {
          io.to(user.room).emit("shareTransaction", {
            player1: transaction.player1,
            player2: transaction.player2,
            maker: transaction.player2,
            amount: transaction.amount,
          });
        } else {
          io.to(user.room).emit("shareTransaction", {
            player1: transaction.player1,
            player2: transaction.player2,
            maker: user.username,
            amount: transaction.amount,
          });
        }
      }
    }
  });

  client.on("roll user", () => {
    var roll = Math.floor(Math.random() * 6) + 1;
    const user = getCurrentUser(client.id);
    if (user) {
      var rollData = {
        username: user.username,
        roll: roll,
      };

      client.emit("user rolled", rollData);
      client.broadcast.emit("user rolled", rollData);
    }
  });

  client.on("news", () => {
    var random = Math.floor(Math.random() * actualites.length);
    // Create a variable to store the news
    var news =
      "<div class='news-item' style='text-align:center'><h3>" +
      actualites[random] +
      "</h3><p>";
    const user = getCurrentUser(client.id);
    if (user) {
      io.to(user.room).emit("news", news);
    }
  });

  // When client disconnects
  client.on("disconnect", (reason) => {
    const user = userLeave(client.id);
    if (user) {
      client.disconnect(reason);
      console.log("Disconnected " + user.username + " : " + reason);
      // Emit list of users and room in the chat room
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
      io.to(user.room).emit("updatePlayers", {
        users: getRoomUsers(user.room),
      });
      io.to(user.room).emit("removePawn", (id = user.id));
      io.to(user.room).emit("removeCursor", (session_id = client.id));
    }
  });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Application running on port ${PORT}...`);
});
