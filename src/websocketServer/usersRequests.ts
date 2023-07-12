import WebSocket from "ws";

export const playerDatabase: { [key: string]: { name: string, password: string, index: number, ws: WebSocket } } = {};

function generateUserId(): number {
  let i = 0
  do {
    i = Math.floor(Math.random() * 1000);
  } while (Object.values(playerDatabase).find((el) => el.index === i))
  return i;
}

export function handleRegistration(ws: WebSocket, data: string, id: number) {
    const { name, password } = JSON.parse(data);
    let error = false;
    let errorText = '';
    
    if (playerDatabase[name]) {
      error = true;
      errorText = 'Username already exists';
    } else {
      const index = generateUserId();
      playerDatabase[name] = { name, password, index, ws };
    }

    const response = {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: playerDatabase[name].index, 
        error,
        errorText,
      }),
      id,
    };

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