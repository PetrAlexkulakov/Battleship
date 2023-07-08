import WebSocket, { WebSocketServer } from 'ws';

const playerDatabase: { [key: string]: { name: string, password: string } } = {};

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

function handleRequest(ws: WebSocket, requestData: any) {
    const { type, data, id } = requestData;

    switch (type) {
      case 'reg':
        handleRegistration(ws, data, id);
        break;
      default:
        console.log('Unknown request type:', type);
    }
}

function handleRegistration(ws: WebSocket, data: any, id: number) {
    const { name, password } = data;
    let error = false;
    let errorText = '';

    if (playerDatabase[name]) {
      error = true;
      errorText = 'Username already exists';
    } else {
      playerDatabase[name] = { name, password };
    }

    const response = {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: 0, // Placeholder value, replace with actual index
        error,
        errorText,
      }),
      id,
    };

    console.log(JSON.stringify(response))
    ws.send(JSON.stringify(response));
}
