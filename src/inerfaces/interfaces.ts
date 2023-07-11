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
}

export interface IGameField {
  player1: ICell[][],
  player2: ICell[][]
}

export interface IGameRooms { 
  [key: number]: { 
    players: WebSocket[], 
    gameField: IGameField, 
    shipPositions: IShipPositions,
    playersId: number[],
    turnId: number
  } 
}
[
    {
      position: { x: 7, y: 5 },
      direction: true,
      type: 'huge',
      length: 4
    },
    {
      position: { x: 4, y: 4 },
      direction: true,
      type: 'large',
      length: 3
    },
    {
      position: { x: 0, y: 7 },
      direction: false,
      type: 'large',
      length: 3
    },
    {
      position: { x: 2, y: 3 },
      direction: true,
      type: 'medium',
      length: 2
    },
    {
      position: { x: 6, y: 1 },
      direction: false,
      type: 'medium',
      length: 2
    },
    {
      position: { x: 0, y: 9 },
      direction: false,
      type: 'medium',
      length: 2
    },
    {
      position: { x: 0, y: 3 },
      direction: false,
      type: 'small',
      length: 1
    },
    {
      position: { x: 9, y: 7 },
      direction: false,
      type: 'small',
      length: 1
    },
    {
      position: { x: 4, y: 2 },
      direction: false,
      type: 'small',
      length: 1
    },
    {
      position: { x: 4, y: 0 },
      direction: true,
      type: 'small',
      length: 1
    }
]
  