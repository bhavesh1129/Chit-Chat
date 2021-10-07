const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const app = express();
const formatMsg = require('./public/utils/messages');
const { userJoin, getCurrentUser, userLeave, getUserRoom } = require("./public/utils/users");


const server = http.createServer(app);
const io = socketio(server);


//Set static directory
app.use(express.static(path.join(__dirname, "public")));
var userAdmin = "Admin";

//Run when clients connect
io.on("connection", (socket) => {

    socket.on("joinRoom", ({ username, room }) => {

        //Room chat
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome the current user
        socket.emit("message", formatMsg(userAdmin, "Welcome to ChatApp"));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit("message", formatMsg(userAdmin, `${user.username} has joined the chat`));

        //Send user and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getUserRoom(user.room)
        });
    });

    //Listen for chat message
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMsg(user.username, msg));
    });

    //Runs when user left the chat
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMsg(userAdmin, `${user.username} has left the chat`));

            //Send user and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getUserRoom(user.room)
            });
        }
    });
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});