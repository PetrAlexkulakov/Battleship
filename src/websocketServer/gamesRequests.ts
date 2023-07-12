import WebSocket from "ws";
import { gameRooms } from "./roomsRequests.js";
import { ICell, IGameRoom, IShip } from "../inerfaces/interfaces.js";

export function handleAttack(ws: WebSocket, data: string, id: number) {
    const { gameId, x, y, indexPlayer } = JSON.parse(data);

    if (indexPlayer === gameRooms[gameId].turnId) {
      const attackResult = sayAttackResult(gameId, x, y, indexPlayer)
      const response = {
        type: 'attack',
        data: JSON.stringify({
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer, /* id of the player in the current game */
          status: attackResult,
        }),
        id,
      };

      sendResponseToBothPlayers(gameRooms[gameId], response)

      let idOfTurn = indexPlayer
      
      if (attackResult === "killed") {
        createShipKilled(gameId, x, y, indexPlayer);
      }

      if (attackResult === "miss") {
        idOfTurn = indexPlayer === gameRooms[gameId].playersId[0] ? 
        gameRooms[gameId].playersId[1] : 
        gameRooms[gameId].playersId[0]
      }
      gameRooms[gameId].turnId = idOfTurn
      sendTurn(gameRooms[gameId].players[0], idOfTurn)
      sendTurn(gameRooms[gameId].players[1], idOfTurn)
    }
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
}

function createShipKilled(gameId: number, x: number, y: number, indexPlayer: number){
  const gameField = sayGameField(gameId, x, y, indexPlayer)
  const ship = gameField[x][y].ship;
  x = ship.position.x
  y = ship.position.y

  const shipLength = ship.type === "small" ? 1 :
  ship.type === "medium" ? 2 :
  ship.type === "large" ? 3 : 4;

  const response = {
    type: 'attack',
    data: JSON.stringify({
      position:
      {
        x: x,
        y: y,
      },
      currentPlayer: indexPlayer, /* id of the player in the current game */
      status: 'killed',
    }),
    id: 0,
  };

  for (let i = 0; i < shipLength; i++ ) {
    let data: any = { position: { x: x, y: y }, currentPlayer: indexPlayer, status: 'killed' };
    if (ship.direction) {
      data.position = { x: x, y: y + i } 
      createMissAround(x, y + i); 
    } else {
      data.position = { x: x + i, y: y } 
      createMissAround(x + i,  y);
    }
    data = JSON.stringify(data);
    response.data = data

    sendResponseToBothPlayers(gameRooms[gameId], response)
  }
  
  function createMissAround(x: number, y: number ) {
    for (let i = -1; i < 2; i++ ) {
      for (let j = -1; j < 2; j++ ) {
        let data: any = { position: { x: x, y: y }, currentPlayer: indexPlayer, status: 'miss' };
        const aroundCellX = x + i
        const aroundCellY = y + j
        if ( 
          gameField[ aroundCellX ] !== undefined &&
          gameField[ aroundCellX ][ aroundCellY ] !== undefined &&
          gameField[ aroundCellX ][ aroundCellY ].isHit === false
        ){
          data.position = { x: aroundCellX, y: aroundCellY } 
          data = JSON.stringify(data);
          response.data = data
          sendResponseToBothPlayers(gameRooms[gameId], response)
        }
      }
    }
  }
}

function sayAttackResult(gameId: number, x: number, y: number, indexPlayer: number) {
  const gameField = sayGameField(gameId, x, y, indexPlayer)

  if (gameField[x][y].hasShip === true && gameField[x][y].isHit === false) {
    gameField[x][y].ship.length--
    if (gameField[x][y].ship.length !== 0)
    {
      gameField[x][y].isHit = true;
      return "shot"
    }else {
      gameField[x][y].isHit = true;
      return "killed"
    }
  }
  return "miss"
}

function sayGameField(gameId: number, x: number, y: number, indexPlayer: number){
  return indexPlayer === gameRooms[gameId].playersId[0] ? gameRooms[gameId].gameField.player1 : gameRooms[gameId].gameField.player2
}

function sendResponseToBothPlayers(gameRoom: IGameRoom, response: Object) {
  gameRoom.players[0].send(JSON.stringify(response));
  gameRoom.players[1].send(JSON.stringify(response));
}