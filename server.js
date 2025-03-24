const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

const users = {}; // Guardar los usuarios y sus colores

// Generar color aleatorio para cada usuario
function generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

io.on('connection', (socket) => {
    let userName = '';

    // El usuario se une y se asigna un color único
    socket.on('user-joined', (name) => {
        userName = name;
        users[socket.id] = { username: name, color: generateColor() };
        io.emit('chat-message', { username: 'Sistema', message: `${name} se ha unido al chat`, color: '#000000' });
    });

    // Recibir un mensaje y emitirlo con el nombre del usuario
    socket.on('chat-message', (data) => {
        const user = users[socket.id];
        if (user) {
            io.emit('chat-message', { username: user.username, message: data.message, color: user.color });
        }
    });

    // El usuario se desconecta
    socket.on('disconnect', () => {
        if (userName) {
            io.emit('chat-message', { username: 'Sistema', message: `${userName} ha salido del chat`, color: '#000000' });
            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
