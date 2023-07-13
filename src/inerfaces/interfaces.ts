import WebSocket from "ws";

export interface IShipPositions {
  player1: IShip[],
  player2?: IShip[]
}

export interface IShip {
  position: {
      x: number,
      y: number,
  },
  direction: boolean,
  length: number,
  type: "small"|"medium"|"large"|"huge",
}

export interface ICell {
  hasShip: boolean;
  isHit: boolean; 
  ship: IShip;
}

export interface IGameField {
  player1: ICell[][],
  player2: ICell[][]
}

export interface IGameRoom { 
  players: WebSocket[], 
  gameField: IGameField, 
  shipPositions: IShipPositions,
  playersId: number[],
  turnId: number
}

export interface IGameRooms { 
  [key: number]: IGameRoom
}
