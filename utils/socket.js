var socketIO = require("socket.io");
var { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./users");
var {
  getRoomCards,
  getCard,
  createCard,
  moveCard,
  wipeCards,
} = require("./cards");
const userColors = ["#d9534f", "#5cb85c", "#5bc0de", "#f0ad4e"];
const userCoordinates = [
  { x: 0.91, y: 0.9 },
  { x: 0.95, y: 0.9 },
  { x: 0.95, y: 0.95 },
  { x: 0.91, y: 0.95 },
];

function socketApp(server) {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    // Listen to join event
    socket.on("join", ({ username, room }) => {
      socket.room = room;

      // If username if not yet used in the room, and if the room is not full and if the game has already started join the room
      if (getRoomUsers(room).length >= 4) {
        socket.emit("roomFull");
        return;
      } else {
        if (
          getRoomUsers(room).find(
            (ppl) => ppl.username === username && ppl.room === room
          )
        ) {
          socket.emit("usernameAlreadyUsed");
          return;
        } else {
          socket.join(room);
        }
      }
      // If i am the first player in the room :
      if (getRoomUsers(room).length === 0) {
        // Wipe the board
        wipeCards();
        // Create the cards
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
                  socket.room,
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
      }

      const usedColors = getRoomUsers(room)
        .filter((user) => user.color)
        .map((user) => user.color);
      const availableColors = userColors.filter(
        (color) => !usedColors.includes(color)
      );
      const userColor = availableColors[0];
      const userCoords = userCoordinates[getRoomUsers(room).length];
      const user = userJoin(
        socket.id,
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

    socket.on("dragPawn", (pawn) => {
      const user = getCurrentUser(socket.id);
      if (user) {
        user.coordinates.x = pawn.x;
        user.coordinates.y = pawn.y;
        io.to(socket.room).emit("updatePawns", {
          id: pawn.id,
          coordinates: user.coordinates,
        });
      }
    });

    socket.on("dragCard", (card) => {
      console.log("Card from server : ", card);
      moveCard(card.id, card.x, card.y);
      io.to(socket.room).emit("updateCard", {
        id: card.id,
        x: card.x,
        y: card.y,
      });
    });

    socket.on("newPlayer", () => {
      const user = getCurrentUser(socket.id);
      if (user) {
        io.to(user.room).emit("newPlayer", {
          id: user.id,
          coordinates: {
            x: user.coordinates.x,
            y: user.coordinates.y,
          },
          color: user.color,
        });
        for (player = 0; player < getRoomUsers(socket.room).length; player++) {
          if (getRoomUsers(socket.room)[player].id != user.id) {
            socket.emit("newPlayer", {
              id: getRoomUsers(socket.room)[player].id,
              coordinates: getRoomUsers(socket.room)[player].coordinates,
              color: getRoomUsers(socket.room)[player].color,
            });
          }
          io.to(socket.room).emit("updatePawns", {
            id: getRoomUsers(socket.room)[player].id,
            coordinates: getRoomUsers(socket.room)[player].coordinates,
          });
        }
        for (i = 0; i < getRoomCards(socket.room).length; i++) {
          var card = getRoomCards(socket.room)[i];
          socket.emit("updateCard", {
            id: card.id,
            ImgPath: card.ImgPath,
            x: card.x,
            y: card.y,
          });
        }
      }
    });

    // socket.on("mouse_activity", (data) => {
    //   const user = getCurrentUser(socket.id);
    //   if (user) {
    //     socket.broadcast.emit("all_mouse_activity", {
    //       session_id: socket.id,
    //       coords: data,
    //       color: user.color,
    //     });
    //   }
    // });

    socket.on("makeTransaction", (transaction) => {
      const user = getCurrentUser(socket.id);
      if (user) {
        getRoomUsers(socket.room).forEach((user) => {
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

    socket.on("roll user", () => {
      var roll = Math.floor(Math.random() * 6) + 1;
      const user = getCurrentUser(socket.id);
      if (user) {
        var rollData = {
          username: user.username,
          roll: roll,
        };

        socket.emit("user rolled", rollData);
        socket.broadcast.emit("user rolled", rollData);
      }
    });

    // When client disconnects
    socket.on("disconnect", (reason) => {
      const user = userLeave(socket.id);
      if (user) {
        socket.emit("disconnect", reason);
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
        io.to(user.room).emit("removeCursor", (session_id = socket.id));
      }
    });
  });
}

module.exports = socketApp;
