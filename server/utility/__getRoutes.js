import logInRouter from './Routes/login.js';
import registerRouter from './Routes/register.js';
import roomNameAddMessageRouter from './Routes/room_name_addMessage.js';
import roomNameMessageRouter from './Routes/room_name_message.js';
import roomNamePassRouter from './Routes/room_name_pass.js';
import roomsRouter from './Routes/rooms.js';
import roomAddRoomRouter from './Routes/rooms_addroom.js';
import roomRemoveRoomRouter from './Routes/rooms_removeRoom.js';

const routes = [
    logInRouter,
    registerRouter,
    roomNameAddMessageRouter,
    roomNameMessageRouter,
    roomNamePassRouter,
    roomsRouter,
    roomAddRoomRouter,
    roomRemoveRoomRouter
];

export default routes;