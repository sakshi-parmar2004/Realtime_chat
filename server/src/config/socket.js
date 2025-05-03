import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

const userSocketMap = {}; // Store userId to socketId mapping

export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId] || null; // Return socketId for the given userId
}
io.on('connection', (socket) => {
    console.log('New client connected',socket.id);
const userId = socket.handshake.query.userId; // Assuming userId is sent in the query params
if(userId) {
        userSocketMap[userId] = socket.id; // Map userId to socketId
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
        io.emit('userConnected', Object.keys(userSocketMap)); // Notify all clients about the new connection
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        delete userSocketMap[userId]; // Remove userId from mapping
        io.emit('userDisconnected', Object.keys(userSocketMap)); // Notify all clients about the disconnection
    });
    
});

export {io, server , app};