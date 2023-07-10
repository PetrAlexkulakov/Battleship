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

export interface IGameRooms { 
    [key: number]: { 
        players: WebSocket[], 
        gameField: any, 
        shipPositions: IShipPositions,
    } 
}