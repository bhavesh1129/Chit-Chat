const chatDetails = document.getElementById("chat-form");
const msg = document.getElementById("msg");
const chatMsg = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const userList = document.getElementById("users");
const socket = io();

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chat room
socket.emit('joinRoom', { username, room });

//Gt room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUserName(users);
});

//Message from server
socket.on("message", (message) => {
    console.log(message);
    outputMsg(message);

    //Scroll down
    chatMsg.scrollTop = chatMsg.scrollHeight;

    //Clear Msg Box
    msg.value = "";
    msg.focus();
});

//Message submit
chatDetails.addEventListener('submit', (event) => {
    event.preventDefault();

    //Message Text
    const message = msg.value;

    //emit mesage to the server
    socket.emit("chatMessage", message);
});

//Output message from DOM

function outputMsg(msg) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
        <p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">${msg.textMsg}</p>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}

//Get room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add user to DOM
function outputUserName(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}