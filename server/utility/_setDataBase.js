import fs from 'fs/promises';
import { fullCheckEmail, fullCheckName, fullCheckPassword }
    from './security/__security.js';
import { paths } from '../utility/getPaths.js';
import { getUsers, getRooms, getMessages, getLastRoom }
    from './__loadDataBase.js';

const {
  users: pathToUsers,
  rooms: pathToRooms,
  messagesDir: pathToMessages
} = paths;

/*   Clear File     */


async function clearFile(filePath) {
    try {
        await fs.truncate(filePath, 0);
        return true;
    } catch (e) {
        console.error('Failed to clear file:', filePath, e);
        return false;
    }
}




/*  add User, Room, Message  */

async function addUser(username, useremail, userpassword) {
    if(!fullCheckName(username) || !fullCheckEmail(useremail) || !fullCheckPassword(userpassword)) {
        throw new Error('Not valid data');
    }

    try {
        const users = await getUsers();
        
        const userExists = users.some(user => user.email === useremail);
        
        if (userExists) {
            throw new Error('User with this email already exist');
        }
        
        const lastId = users.length > 0 ? 
            parseInt(users[users.length-1].id) : 0;
        const newId = lastId + 1;
        
        const formattedData = `${username}_${useremail}_${userpassword}_${newId}\n`;
        await fs.appendFile(pathToUsers, formattedData);
        return true;
    } catch(e) {
        console.error('Error in addUser:', e);
        throw new Error(e.message);
    }
}


async function addRoom(nameRoom, password) {
    if(fullCheckName(nameRoom) && fullCheckPassword(password)) {
        try {
            const rooms = await getRooms();
            const roomExists = rooms.some(room => {
                const [roomName] = room.split('_');
                return roomName === nameRoom;
            });
            
            if (roomExists) {
                throw new Error('Room with this name already exists');
            }
            
            let newId = 1;
            const lastRoom = await getLastRoom();
            newId = lastRoom ? lastRoom.id + 1 : 1;
            
            const formattedData = `${nameRoom}_${password}_${newId}\n`;
            await fs.appendFile(pathToRooms, formattedData);
            return true;
        } catch(e) {
            console.error('Error in addRoom:', e);
            throw new Error('Error in adding room to db: ' + e.message);
        }
    } else {
        throw new Error('Not valid data');
    }
}



async function addMessage(msg, owner, room) {
    try {
        await fs.mkdir(pathToMessages, { recursive: true });
        
        const msgPath = `${pathToMessages}/${room}.txt`;
        const messages = await getMessages(room);
        const newId = messages.length > 0 ? 
            parseInt(messages[messages.length-1].id) + 1 : 1;
        
        await fs.appendFile(msgPath, `${msg}_${owner}_${newId}\n`);
        return true;
    } catch (e) {
        console.error("Ошибка добавления сообщения:", e);
        throw new Error('Failed to add message');
    }
}


/*  Remove Room  */


async function removeRoom(idRoom) {
    try {
        const data = await getRooms();
        const dataWithoutWaste = [];
        let nameRoom = '';
        
        for(let i = 0; i < data.length; i++) {
            const [roomName, roomPassword, roomId] = data[i].split('_');
            if(roomId != idRoom) {
                dataWithoutWaste.push(`${roomName}_${roomPassword}_${roomId}\n`);
            } else {
                nameRoom = roomName;
            }
        }

        await fs.writeFile(pathToRooms, '');
        for(const roomData of dataWithoutWaste) {
            await fs.appendFile(pathToRooms, roomData);
        }

        let endDeleteFile = false;
        if (nameRoom) {
            const messagePath = `${pathToMessages}/${nameRoom}.txt`;
            try {
                await fs.access(messagePath);
                await fs.unlink(messagePath);
                endDeleteFile = true;
            } catch (e) {
                console.log('Message file not found, skipping deletion');
            }
        }
        
        return [true];
    } catch(e) {
        console.error('Error in removeRoom:', e);
        throw new Error('Cannot delete file with messages of this room');
    }
}

export { addUser, addMessage, addRoom, removeRoom };