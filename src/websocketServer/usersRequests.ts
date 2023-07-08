import WebSocket from "ws";

const playerDatabase: { [key: string]: { name: string, password: string } } = {};

export function handleRegistration(ws: WebSocket, data: any, id: number) {
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
        index: 0, // placeholder value
        error,
        errorText,
      }),
      id,
    };

    console.log(JSON.stringify(response))
    ws.send(JSON.stringify(response));
}

export function handleUpdateWinners(ws: WebSocket, id: number) {
    const winnersData = [
      {
        name: 'Player 1',
        wins: 5,
      },
      {
        name: 'Player 2',
        wins: 3,
      },
    ];

    const response = {
      type: 'update_winners',
      data: winnersData,
      id,
    };

    ws.send(JSON.stringify(response));
}