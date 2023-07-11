import { httpServer } from "./http_server/index.js";
import { createWssServer } from "./websocketServer/websocketServer.js";
const HTTP_PORT = 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
createWssServer();
//# sourceMappingURL=index.js.map