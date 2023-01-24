let users = [];

function userJoin(id, username, room, money, color, coordinates) {
  const user = { id, username, room, money, color, coordinates };
  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  var current_users = users.filter((user) => user.room === room);
  return current_users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
