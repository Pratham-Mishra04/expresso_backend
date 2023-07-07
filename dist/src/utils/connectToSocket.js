"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const chatModel_1 = require("../models/chatModel");
const connectToSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: 'http://localhost:3000',
        },
    });
    io.on('connection', (socket) => {
        console.log('connection established');
        socket.on('join_chat', (chatID) => {
            socket.join(chatID);
            console.log(socket.id + ' joined Chat: ' + chatID);
        });
        socket.on('new_message', async (message) => {
            console.log("new Message Recieved. Broadcasting it in Room: " + message.chat);
            const chat = await chatModel_1.default.findById(message.chat);
            socket.to(chat.id).emit('message_received', message);
        });
    });
};
exports.default = connectToSocket;
//# sourceMappingURL=connectToSocket.js.map