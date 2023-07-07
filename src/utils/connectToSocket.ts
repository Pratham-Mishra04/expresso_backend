import { Server } from 'socket.io';
import Chat from '../models/chatModel';

const connectToSocket = (server) =>{
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: 'http://localhost:3000',
        },
    });
    
    io.on('connection', (socket) => {
        console.log('connection established');
    
        socket.on('join_chat', (chatID) => {
            socket.join(chatID);
            console.log(socket.id+' joined Chat: ' + chatID);
        });
    
        socket.on('new_message', async (message) => {
            console.log("new Message Recieved. Broadcasting it in Room: "+message.chat)
            const chat = await Chat.findById(message.chat);
            socket.to(chat.id).emit('message_received', message);
        });
    });
}

export default connectToSocket;