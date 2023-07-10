import WebSocket from "ws";
import { wss } from "./websocketServer.js";
import { playerDatabase } from "./usersRequests.js";
import { IGameRooms } from "../interfaces.js";

export const gameRooms: IGameRooms = {};

function generateRoomId(): number {
    return Math.floor(Math.random() * 1000);
}

export function handleCreateRoom(ws: WebSocket, id: number) {
    const roomId = generateRoomId();
    gameRooms[roomId] = {
      players: [ws],
      gameField: null, // Placeholder
      shipPositions: {player1: []} 
    };
    
    wss.clients.forEach((client) => {
      const response = { 
        type: 'update_room',
        data: JSON.stringify([
          {
              roomId: roomId,
              roomUsers: Object.entries(playerDatabase).map(([key, value]) => {
                  return {
                      name: value.name,
                      index: value.index, 
                  };
              })
          },
      ],),
        id,
      };
      client.send(JSON.stringify(response));
    })
}

export function handleAddPlayerToRoom(ws: WebSocket, data: any, id: number) {
    const { indexRoom } = JSON.parse(data);
    const room = gameRooms[indexRoom];

    if (room) {
      room.players.push(ws);
    }
    
    room.players.forEach((player, index) => {
      const response = {
        type: 'create_game',
        data: JSON.stringify({
          idGame: indexRoom,
          idPlayer: index,
        }),
        id,
      };
  
      player.send(JSON.stringify(response));
    })
}