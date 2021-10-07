const users = [];

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);
    return user;
}

//Get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//User leaves the chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get user room
function getUserRoom(room) {
    return users.filter(user => user.romm === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getUserRoom };