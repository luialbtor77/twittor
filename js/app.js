
/**
 * Solución para evitar error 404 al registrar el Service Worker
 * 
 * Error: "Failed to register a ServiceWorker for scope ('https://luialbtor77.github.io/') 
 * with script ('https://luialbtor77.github.io/sw.js'): A bad HTTP response code (404)"
 * 
 * En GitHub Pages, la URL de la aplicación es:
 * https://luialbtor77.github.io/twittor/
 * 
 * La raíz del proyecto es: /twittor/
 * 
 * En teoría el Service Worker debería estar en el directorio
 * https://https://luialbtor77.github.io/twittor/
 * 
 * Si usamos swLocation = '/sw.js', el navegador busca en:
 * https://luialbtor77.github.io/sw.js (raíz del dominio) ❌
 * 
 * Solución: usar swLocation = '/twittor/sw.js' para que busque en:
 * https://luialbtor77.github.io/twittor/sw.js ✓
 * y ahí no se encuentra el Service Worker
 * 
 * En desarrollo (localhost), el directorio raíz sí es /sw.js
 */


//Validación previa para adaptarse al lugar de despliegue
//obtener el url que tengo en el navegador web
// si es localhost estoy en desarrollo
// si es otra coas estoy en producción
let url = window.location.href; // obtiene todo el URL

// path donde se encuentra el Service Worker
let swLocation = '/twittor/sw.js';



// Registrar el service worker en el app.js
if ( navigator.serviceWorker ) {

    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    // navigator.serviceWorker.register('/sw.js');
    navigator.serviceWorker.register(swLocation);
}


// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario, contiene el ID del héroe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
   modal.animate({ 
       marginTop: '+=1000px',
       opacity: 0
    }, 200, function() {
        modal.addClass('oculto');
        txtMensaje.val('');
    });
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    crearMensajeHTML( mensaje, usuario );

});