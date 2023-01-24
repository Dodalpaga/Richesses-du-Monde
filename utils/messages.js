const moment = require('moment');

function createMessage(username, message) {
    return {
        username,
        message,
        time: moment().format("h:mm a")
    }
}

module.exports = createMessage;