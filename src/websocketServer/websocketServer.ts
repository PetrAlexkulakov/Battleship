import WebSocket, { WebSocketServer } from 'ws';
import { handleRequest } from './handleRequest.js';

export function createWssServer() {
    const wss = new WebSocketServer({ port: 3000 });
    const clients = {};

    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
            const requestData = JSON.parse(String(data));
            handleRequest(ws, requestData);
        });
    });
}

