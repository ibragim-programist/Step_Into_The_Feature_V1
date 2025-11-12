import axios from "axios";

const BaseUrl = 'http://localhost:7523';


console.log('=========================================');

console.log('/register')

await axios.post(`${BaseUrl}/register`, {
    name: "Ibragim",
    email: "test@example.com",
    password: "test1493"
}).then(d => console.log(d.data)).catch((e) => { console.log(e) });

console.log('=========================================');

console.log('/logIn');

await axios.post(`${BaseUrl}/logIn`, {
    email: "test@example.com",
    password: "test1493"
}).then(d => console.log(d.data)).catch((e) => { console.log(e) });


console.log('=========================================');

console.log('/rooms/addRoom')

await axios.post(`${BaseUrl}/rooms/addRoom`, {
    nameRoom: "Abdurahman",
    passRoom: "123456789"
}).then(d => console.log(d.data)).catch((e) => { console.log(e) });


console.log('=========================================');

console.log('/room/Amir/1235');

await axios.get(`${BaseUrl}/room/Amir/1235`)
    .then(d => console.log(d.data)).catch((e) => { console.log(e) });

console.log('=========================================');

console.log('/rooms')

await axios.get(`${BaseUrl}/rooms`)
    .then(d => console.log(d.data)).catch((e) => { console.log(e) });

console.log('=========================================');

console.log('/rooms/removeRoom');

await axios.post(`${BaseUrl}/rooms/removeRoom`, {
    name: "Amir",
    pass: '1235'
}).then(d => console.log(d.data)).catch((e) => { console.log(e) });


console.log('=========================================');

console.log('/room/Ibragim/addMessage`');

await axios.post(`${BaseUrl}/room/Ibragim/addMessage`, {
    msg: "Salam Aleykum Amir!",
    owner: "Ibragim"
}).then(d => console.log(d.data)).catch((e) => { console.log(e) });

console.log('=========================================')

console.log('/room/Ibragim/messages');


await axios.get(`${BaseUrl}/room/Ibragim/messages`)
    .then(r => {
        console.log('Status:', r.status);
        console.log('Response:', r.data);
        console.log('Messages:', r.data.messages); 
    })
    .catch(e => {
        console.error('Full error:', {
            status: e.response?.status,
            data: e.response?.data,
            message: e.message
        });
    });




