import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.send('something');
});
//# sourceMappingURL=websocket_server.js.map