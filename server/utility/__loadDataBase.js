import fs from 'fs/promises';
import { fullCheckName, fullCheckPassword }
    from './security/__security.js';
import { checkValidId }
    from './security/__checkValidData.js';
import { paths } from '../utility/getPaths.js';

const {
  users: pathToUsers,
  rooms: pathToRooms,
  messagesDir: pathToMessages
} = paths;



/* get Users, Rooms, Messages */

async function getUsers() {
    try {
        const data = await fs.readFile(pathToUsers, 'utf-8');
        return data.trim().split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const [name, email, password, id] = line.split('_');
                return { name, email, password, id };
            });
    } catch(e) {
        console.error('Ошибка чтения пользователей:', e);
        return [];
    }
}

async function getRooms() {
    try {
        const data = await fs.readFile(pathToRooms, 'utf-8');
        return data.split('\n');
    } catch(e) {
        console.error('Error in getRooms:', e);
        return [];
    }
}

async function getMessages(nameRoom) {
    console.log('\n--- getMessages called ---');
    console.log('Room name:', nameRoom);
    console.log('Expected file path:', `${pathToMessages}/${nameRoom}.txt`);

    if (!nameRoom || typeof nameRoom !== 'string') {
        console.error('Invalid room name');
        return [];
    }

    try {
        const formattedPath = `${pathToMessages}/${nameRoom}.txt`;
        
        try {
            await fs.access(formattedPath);
            console.log('File exists');
        } catch (e) {
            console.log('File does NOT exist');
            return [];
        }

        const data = await fs.readFile(formattedPath, 'utf-8');
        console.log('File content:', data);

        if (!data.trim()) {
            console.log('File is empty');
            return [];
        }

        const messages = data
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const parts = line.split('_');
                return {
                    msg: parts[0] || '',
                    owner: parts[1] || '',
                    id: parts[2] ? parts[2].trim() : ''
                };
            })
            .filter(msg => msg.msg && msg.owner && msg.id);

        console.log('Parsed messages:', messages);
        return messages;

    } catch (e) {
        console.error('Error in getMessages:', e);
        return [];
    }
}


/* get User, Room */



async function getUser(id) {
    if(checkValidId(id)) {
        let result = { };
        try {
            const data = await getUsers();
            for(let i = 0; i < data.length; i++) {
                const [userName, userEmail, userPassword, userId] = data[i].split('_');
                if(id == userId) {
                    result = {
                        name: userName,
                        email: userEmail,
                        id: userId
                    }

                    return result;
                }
            }

            return result;
        } catch(e) {
            throw new Error('Error in getting user from db');
        }
    } else {
        throw new Error('Not valid data');
    }
}


async function getRoom(id) {
    if(checkValidId(id)) {
        let result = { };
        try {
            const data = await getRooms();
            for(let i = 0; i < data.length; i++) {
                const [roomName, roomPassword, roomId] = data[i].split('_');
                if(id == roomId) {
                    result = {
                        nameRoom: roomName,
                        id: roomId
                    }
                    
                    return result;
                }
            }

            return result;
        } catch(e) {
            throw new Error('Error in getting user from db');
        }
    } else {
        throw new Error('Not valid data');
    }
}



/* getLast User, Room, Message */



async function getLastUser() {
    try {
        const data = await getUsers();
        if (!data || data.length === 0) {
            return { id: 0 };
        }
        
        const lastUser = data[data.length - 1];
        if (!lastUser || lastUser.split('_').length < 4) {
            throw new Error('Invalid user data format');
        }
        
        const [userName, userEmail, userPassword, userId] = lastUser.split('_');
        return {
            name: userName,
            email: userEmail,
            id: parseInt(userId) || 0
        };
    } catch(e) {
        console.error('Error in getLastUser:', e);
        throw new Error('Error in getting user from db');
    }
}


async function getLastRoom() {
    try {
        const data = await getRooms();
        const validRooms = data.filter(room => room.trim() !== '');
        
        if (validRooms.length === 0) {
            return { id: 0 };
        }

        const lastRoom = validRooms[validRooms.length - 1];
        const parts = lastRoom.split('_');
        
        if (parts.length < 3) {
            throw new Error('Invalid room data format');
        }

        const [roomName, roomPassword, roomId] = parts;
        return {
            name: roomName,
            password: roomPassword,
            id: parseInt(roomId) || 0
        };
    } catch(e) {
        console.error('Error in getLastRoom:', e);
        throw new Error('Error getting last room: ' + e.message);
    }
}


async function getLastMessage() {
    let result = { };
    try {
        const data = await getMessages();
        const [msg, owner, msgId] = data[data.length - 1].split('_');
        result = {
            msg: msg,
            owner: owner,
            idMsg: msgId
        }
        return result;
    } catch(e) {
        throw new Error('Error in getting user from db');
    }
}


/* checkExist User, Room */

async function checkExistUser(email, password) {
    try {
        if(!email || !password) {
            throw new Error('Требуется email и пароль');
        }

        const users = await getUsers();
        const user = users.find(u => 
            u.email.trim() === email.trim() && 
            u.password.trim() === password.trim()
        );

        if(!user) return null;

        return {
            name: user.name,
            email: user.email,
            id: user.id
        };
    } catch(e) {
        console.error('Ошибка проверки пользователя:', e);
        throw new Error('Ошибка авторизации');
    }
}


async function checkExistRoom(room, password) {
    if(fullCheckName(room) && fullCheckPassword(password)) {
        try {
            const data = await getRooms();
            
            for(let i = 0; i < data.length; i++) {
                const [roomname, roompassword, roomId] = data[i].split('_');
                if(room === roomname && password === roompassword) {
                    return {
                        name: roomname,
                        password: roompassword,
                        id: roomId
                    };
                }
            }
            
            return null;
        } catch(e) {
            throw new Error('Error checking room exist');
        }
    } else {
        throw new Error('Not valid data');
    }
}

export { getUsers, getRooms, getMessages,
    getUser, getRoom, getLastUser, 
    getLastRoom, getLastMessage, checkExistRoom, checkExistUser };