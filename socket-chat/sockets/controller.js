const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models/chat-mensajes");

const chatMensajes = new ChatMensajes();


const socketController = async( socket = new Socket(), io ) => {
    
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if ( !usuario ) {
        return socket.disconnect();
    }
    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    
    // Limpiar cuando alguien se desconecta

    socket.on('disconnect', () =>{
        socket.disconnect();
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    });

    socket.on('enviar-mensaje', ( { uid, mensaje } ) => {
        chatMensajes.enviarMensaje( usuario.uid, usuario.nombre, mensaje );
        io.emit('recibir-mensaje', chatMensajes.ultimos10 );
    });
}

module.exports = {
    socketController
}