var socketIO = require("socket.io");
var Filter = require("bad-words");
var frenchBadwordsList = require("french-badwords-list");
var leoProfanity = require("leo-profanity");
var { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./users");
const playerColors = { 0: "#00aadd", 1: "#32a852", 2: "#d6c71e", 3: "#a83232" };
const userColors = ["#00aadd", "#32a852", "#d6c71e", "#a83232"];

const appName = "--Richesses du Monde--";

const filter = new Filter();
leoProfanity.add(frenchBadwordsList.array);

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
      const usedColors = getRoomUsers(room)
        .filter((user) => user.color)
        .map((user) => user.color);
      const availableColors = userColors.filter(
        (color) => !usedColors.includes(color)
      );
      const userColor = availableColors[0];
      const user = userJoin(
        socket.id,
        username,
        room,
        (money = 17500000),
        (color = userColor),
        (coordinates = { x: 0, y: 0 })
      );
      console.log("Connected: " + user.username);

      // Emit list of users and room in the chat room
      io.to(room).emit("roomUsers", {
        room: room,
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
        for (i = 0; i < getRoomUsers(socket.room).length; i++) {
          if (getRoomUsers(socket.room)[i].id != user.id) {
            socket.emit("newPlayer", {
              id: getRoomUsers(socket.room)[i].id,
              coordinates: getRoomUsers(socket.room)[i].coordinates,
              color: getRoomUsers(socket.room)[i].color,
            });
          }
          io.to(socket.room).emit("updatePawns", {
            id: getRoomUsers(socket.room)[i].id,
            coordinates: getRoomUsers(socket.room)[i].coordinates,
          });
        }
      }
    });

    socket.on("mouse_activity", (data) => {
      const user = getCurrentUser(socket.id);
      if (user) {
        socket.broadcast.emit("all_mouse_activity", {
          session_id: socket.id,
          coords: data,
          color: user.color,
        });
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

        io.to(user.room).emit("removePawn", (id = user.id));
        io.to(user.room).emit("removeCursor", (session_id = socket.id));
      }
    });
  });
}

module.exports = socketApp;
