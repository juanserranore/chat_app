// Importamos dependencias
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos
app.use(express.static("public"));

// Manejo de conexiones de Socket.io
io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");
    
    socket.on("mensaje", (msg) => {
        io.emit("mensaje", msg); // Reenvía el mensaje a todos
    });
    
    socket.on("disconnect", () => {
        console.log("Un usuario se ha desconectado");
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});