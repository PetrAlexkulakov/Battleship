import WebSocket from "ws";
import { handleCreateRoom } from "./roomsRequests.js";
import { handleRegistration, handleUpdateWinners } from "./usersRequests.js";

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
      default:
        console.log('Unknown request type:', type);
    }
}
