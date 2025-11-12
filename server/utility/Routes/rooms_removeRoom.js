import { Router } from "express";
import { removeRoom } from "../_setDataBase.js";
import { getRooms } from "../__loadDataBase.js";
const roomRemoveRoomRouter = Router();

roomRemoveRoomRouter.post('/rooms/removeRoom', async (req, res) => {
    try {
        const { name, pass } = req.body;
        let idRoom = null;
        const data = await getRooms();

        for(let i = 0; i < data.length; i++) {
            const [roomName, roomPass, roomId] = data[i].split('_');
            if(roomName === name && roomPass === pass) {
                idRoom = roomId;
                break;
            }
        }
        
        if (!idRoom) throw new Error('Room not found');
        
        const result = await removeRoom(idRoom);
        res.status(200).json({ success: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default roomRemoveRoomRouter;