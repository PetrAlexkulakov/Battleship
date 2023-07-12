import { WebSocket } from "ws";
import { gameRooms } from "./roomsRequests.js";
import { ICell, IShip } from "../inerfaces/interfaces.js";
import { sendTurn } from "./gamesRequests.js";
import { playerDatabase } from "./usersRequests.js";

export function handleAddShips(ws: WebSocket, data: string, id: number) {
    const { gameId, ships } = JSON.parse(data);

    if (gameRooms[gameId].shipPositions.player1.length === 0) {
        gameRooms[gameId].shipPositions.player1 = ships;
    } else {
        gameRooms[gameId].shipPositions.player2 = ships;
        
        gameRooms[gameId].players.forEach((player, index) => {
            const response = {
                type: "start_game",
                data:
                    JSON.stringify({
                        ships: Object.values(gameRooms[gameId].shipPositions)[index],
                        currentPlayerIndex: Object.values(playerDatabase).find((el) => el.ws === player)?.index /* id of the player in the current game who have sent his ships */
                    }),
                id: 0,
            }
    
            player.send(JSON.stringify(response)); 
        })
        gameRooms[gameId].turnId = gameRooms[gameId].playersId[0]
        placeShipOnField(gameRooms[gameId].shipPositions.player1, gameRooms[gameId].gameField.player1)
        placeShipOnField(gameRooms[gameId].shipPositions.player2 || [], gameRooms[gameId].gameField.player2)
        sendTurn(gameRooms[gameId].players[0], gameRooms[gameId].playersId[0])
        sendTurn(gameRooms[gameId].players[1], gameRooms[gameId].playersId[0])
    }
}

function placeShipOnField(ships: IShip[], field: ICell[][]) {
    ships.forEach((ship) => {
        if (ship.direction === true) {
            for (let i = 0; i < ship.length; i++) 
              field[ship.position.x][ship.position.y + i] = {hasShip: true, isHit: false, ship: ship};
        } else {
            for (let i = 0; i < ship.length; i++) 
              field[ship.position.x + i][ship.position.y] = {hasShip: true, isHit: false, ship: ship};
        }
    })
}