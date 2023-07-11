import WebSocket from "ws";
import { gameRooms } from "./roomsRequests.js";

export function handleAttack(ws: WebSocket, data: string, id: number) {
    const { gameId, x, y, indexPlayer } = JSON.parse(data);

    if (indexPlayer === gameRooms[gameId].turnId) {
      const response = {
        type: 'attack',
        data: JSON.stringify({
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer, /* id of the player in the current game */
          status: sayAttackResult(gameId, x, y, indexPlayer),
        }),
        id,
      };

      gameRooms[gameId].players[0].send(JSON.stringify(response));
      gameRooms[gameId].players[1].send(JSON.stringify(response));

      const idOfTurn = indexPlayer === gameRooms[gameId].playersId[0] ? 
      gameRooms[gameId].playersId[1] : 
      gameRooms[gameId].playersId[0]

      gameRooms[gameId].turnId = idOfTurn
      sendTurn(gameRooms[gameId].players[0], idOfTurn)
      sendTurn(gameRooms[gameId].players[1], idOfTurn)
    }
}

function sayAttackResult(gameId: number, x: number, y: number, indexPlayer: number) {
  const gameField = indexPlayer === gameRooms[gameId].playersId[0] ? gameRooms[gameId].gameField.player1 : gameRooms[gameId].gameField.player2

  if (gameField[x][y].hasShip === true && gameField[x][y].isHit === false) {
    if ( 
      (x > 0 && gameField[x - 1][y].hasShip && !gameField[x - 1][y].isHit) ||
      (x < 9 && gameField[x + 1][y].hasShip && !gameField[x + 1][y].isHit) ||
      (y > 0 && gameField[x][y - 1].hasShip && !gameField[x][y - 1].isHit) ||
      (y < 9 && gameField[x][y + 1].hasShip && !gameField[x][y + 1].isHit)
    )
    return "shot"
    else {
      console.log("killed")
      return "killed"
    }
  }
  return "miss"
}

export function sendTurn(ws: WebSocket, playerId: number) {
  const response = {
      type: "turn",
      data: JSON.stringify({
          currentPlayer: playerId,
        }),
      id: 0,
  };

  ws.send(JSON.stringify(response));
  console.log(response);
}