import WebSocket from "ws";

export const gameRooms: { [key: number]: { players: WebSocket[], gameField: any, shipPositions: any } } = {};

export function handleCreateRoom(ws: WebSocket, id: number) {
    const roomId = generateRoomId();
    gameRooms[roomId] = {
      players: [ws],
      gameField: null, // Placeholder
      shipPositions: null, // Placeholder 
    };

    const response = {
      type: 'create_game',
      data: JSON.stringify({
        idGame: roomId,
        idPlayer: 0, // placeholder
      }),
      id,
    };

    ws.send(JSON.stringify(response));
}

function generateRoomId(): number {
    return Math.floor(Math.random() * 1000);
}