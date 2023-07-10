import WebSocket from "ws";
import { handleAddPlayerToRoom, handleCreateRoom } from "./roomsRequests.js";
import { handleRegistration, handleUpdateWinners } from "./usersRequests.js";
import { handleAddShips } from "./shipsRequests.js";

export function handleRequest(ws: WebSocket, requestData: any) {
    const { type, data, id } = requestData;

    switch (type) {
      case 'reg':
        handleRegistration(ws, data, id);
        break;
      case 'update_winners':
        handleUpdateWinners(ws, id);
        break;
      case 'create_room':
        handleCreateRoom(ws, id);
        break;
      case 'add_user_to_room':
        handleAddPlayerToRoom(ws, data, id);
        break;
      case 'add_ships':
        handleAddShips(ws, data, id);
        break;
      default:
        console.log('Unknown request type:', type);
    }
}
