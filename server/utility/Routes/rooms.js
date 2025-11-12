import { Router } from "express";
import { getRooms } from "../__loadDataBase.js";
const RoomsRouter = Router();

RoomsRouter.get('/rooms', async (req, res) => {
    try {
        const data = await getRooms();
        const formattedData = data
            .filter(room => room.trim() !== '')
            .map(room => {
                const [name, password, id] = room.trim().split('_');
                return { name, id };
            });
        res.status(200).json({ success: formattedData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default RoomsRouter;