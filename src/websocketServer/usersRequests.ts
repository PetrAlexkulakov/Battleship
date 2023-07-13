import WebSocket from "ws";
import { wss } from "./websocketServer.js";

export const playerDatabase: { [key: string]: { name: string, password: string, index: number, ws: WebSocket, wins: number } } = {};

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
      playerDatabase[name] = { name, password, index, ws, wins: 0 };
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

export function handleUpdateWinners() {
    const winnersData = Object.values(playerDatabase).filter((player) => {
      return player.wins > 0
    }).map((player) => {
      return {name: player.name, wins: player.wins}
    });

    const response = {
      type: 'update_winners',
      data: JSON.stringify(winnersData),
      id: 0,
    };
    
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(response));
    });
}