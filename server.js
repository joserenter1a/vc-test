const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
// using socket.io for web real time communication
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// establish a connection between two users through their socket ID
io.on("connection", (socket) => {
    // my connection & socket id
    socket.emit("me", socket.id)
    // disconnection event handler
    
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    })

    socket.on("callUser", (data)=>{
        
        // call user functionality
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name});
    })

    socket.on("answerCall", (data) => io.to(data.to).emit("callAccepted"), data.signal);
})

server.listen(5000, () => console.log("server is running on port 5000"));