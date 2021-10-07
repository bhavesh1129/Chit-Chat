const moment = require("moment");

function formatMsg(username, textMsg) {
    return {
        username,
        textMsg,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMsg;