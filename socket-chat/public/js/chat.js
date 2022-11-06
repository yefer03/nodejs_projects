
const url = 'http://localhost:8080/api/auth/';

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuario  = document.querySelector('#ulUsuario');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor'); 
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    console.log( userDB, tokenDB );
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;
    await conectarSocket();
}


const conectarSocket = async(  ) =>{
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('Sockets online');
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline');
        
    });

    socket.on('recibir-mensajes', ( payload ) =>{
        console.log(payload);
    });

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', () =>{
    });
}


const dibujarUsuarios = ( usuarios = [] ) =>{

    let usersHtml = '';
    usuarios.forEach( ({ nombre,uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `    
    });
    ulUsuario.innerHTML = usersHtml;
}


txtMensaje.addEventListener('keyup', ({ code }) =>{

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( code === 13 ){ return; }
    if ( mensaje.length === 0 ) { return; }
    socket.emit('enviar-mensaje', { mensaje, uid });
})

const main = async() =>{
    await validarJWT();
}

main();
