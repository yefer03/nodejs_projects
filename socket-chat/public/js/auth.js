
const miFormulario = document.querySelector('form');
const boton = document.querySelector('.btn');

const correo = document.querySelector('.correo'); 
const password = document.querySelector('.password');

boton.onclick = ( ev ) =>{
    ev.preventDefault();
    const formData = {correo, password};

    if (correo.value.length > 0 && password.value.length > 0) {
        formData.correo = correo.value;
        formData.password = password.value;
        console.log(formData);
    }

    fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: { 'Content-Type': 'application/json' },
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => { 
        if ( msg ) {
            return console.error( msg );    
        }
        localStorage.setItem( 'token', token );
        window.location = 'chat.html';
    })
    .catch( err => {    
        console.log(err);
    });    

}

function handleCredentialResponse( response ) {
    // Google Token : ID_TOKEN
    
    const body = { id_token: response.credential };

    fetch('http://localhost:8080/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
    })
        .then( resp => resp.json() )
        .then( ({ token })  => { 
            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        })
        .catch( console.warn );
    }

    const button = document.getElementById('google_signout');

    button.onclick = async() =>{
        console.log( google.accounts.id );
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke( localStorage.getItem( 'correo' ), done => {
        localStorage.clear();
        location.reload();
        } );
    }
