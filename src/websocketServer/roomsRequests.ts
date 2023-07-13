import WebSocket from "ws";
import { wss } from "./websocketServer.js";
import { playerDatabase } from "./usersRequests.js";
import { IGameRooms } from "../inerfaces/interfaces.js";

export const gameRooms: IGameRooms = {};

function generateRoomId(): number {
  let i = 0
  do {
    i = Math.floor(Math.random() * 1000);
  } while (Object.keys(gameRooms).find((el) => Number(el) === i))
  return i;
}

export function handleCreateRoom(ws: WebSocket, id: number) {
    const roomId = generateRoomId();
    gameRooms[roomId] = {
      players: [ws],
      gameField: {
       player1: Array.from({ length: 10 }, () => Array(10).fill({hasShip: false, isHit: false})),
       player2: Array.from({ length: 10 }, () => Array(10).fill({hasShip: false, isHit: false}))
      },
      shipPositions: {player1: []},
      playersId: [],
      turnId: 0,
    };
    
    wss.clients.forEach((client) => {
      handleUpdateRoom(roomId, client);
    })
}

export function handleAddPlayerToRoom(ws: WebSocket, data: string, id: number) {
    const { indexRoom } = JSON.parse(data);
    const room = gameRooms[indexRoom];

    if (room) {
      room.players.push(ws);
    }
    
    room.players.forEach((player) => {
      const index = Object.values(playerDatabase).find((el) => el.ws === player)?.index
      const response = {
        type: 'create_game',
        data: JSON.stringify({
          idGame: indexRoom,
          idPlayer: index,
        }),
        id,
      };
      room.playersId.push(Object.values(playerDatabase).find((el) => el.ws === player)!.index)
      player.send(JSON.stringify(response));
    })
}

export function handleUpdateRoom(roomId: number, client: WebSocket){
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
    id: 0,
  };
  client.send(JSON.stringify(response));
}