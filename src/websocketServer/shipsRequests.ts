import { WebSocket } from "ws";
import { gameRooms } from "./roomsRequests.js";
import { IShip } from "../interfaces.js";

export function handleAddShips(ws: WebSocket, data: any, id: number) {
    const { gameId, ships } = JSON.parse(data);

    if (gameRooms[gameId].shipPositions.player1.length === 0) {
        gameRooms[gameId].shipPositions.player1 = ships as IShip[];
    } else {
        gameRooms[gameId].shipPositions.player2 = ships as IShip[];
        
        gameRooms[gameId].players.forEach((player, index) => {
            const response = {
                type: "start_game",
                data:
                    JSON.stringify({
                        ships: Object.values(gameRooms[gameId].shipPositions)[index],
                        currentPlayerIndex: index /* id of the player in the current game who have sent his ships */
                    }),
                id: 0,
            }
    
            player.send(JSON.stringify(response));
        })
    }
}