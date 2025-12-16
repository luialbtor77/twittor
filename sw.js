//imports
//referencia al fichero sw-utils.js y se va a incluir en el APP_SHELL
importScripts('js/sw-utils.js');


/** Configuración Service Worker */

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// APP_SHELL
// todo lo que es necesario para mi aplicación
// lo que se va a cargar de forma instantánea o lo más rápido posible
// no olvidar la petición '/' que es necesaria
// si falta un fichero no se instalará el APP_SHELL
const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// TODO LO QUE NO SE VA A MODIFICAR Y QUE NO HE HECHO
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

/** PROCESO INSTALACIÓN */
// evento 'install'

self.addEventListener('install', e => {

    //almacenar en el cache el APP_SHELL y el APP_SHELL_INMUTABLE

    //abrir el cache estático (referencia del cache en la promesa)
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache => {
        //añadir al cache el APP_SHELL
        cache.addAll( APP_SHELL );
    });

    //abrir el cache inmutable (referencia del cache en la promesa)
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache => {
        //añadir al cache el APP_SHELL_INMUTABLE
        cache.addAll( APP_SHELL_INMUTABLE );
    });

    //esperar hasta que termine la instalación con las dos promeasas
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));


});

/** PROCESO DE BORRADO DE LOS ANTIGUOS CACHES A CADA CAMBIO DE SW */
// evento 'activate'

self.addEventListener('activate', e => {
    //Si hay una diferencia de versión tengo que borrar el cache estático

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key != STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );


});

/** ESTRATEGIA DE CACHE: Cache con Network Fallback */
// evento 'fetch'

self.addEventListener('fetch', e => {

    // simple cache only
    //verificar en el cache si existe la request
    const respuesta = caches.match( e.request ).then( res => {

        //Si la respuesta existe
        if ( res ) {
            return res
        } else {
            // si la respuesta no existe dará errores porque Fontawesome, Google Fonts en el index.html son solo referencias a recursos descargables
            // console.log( e.request.url );

            // estrategia para el dynamic cache: Cache con Network Fallback
            // necesito realizar el fetch al recurso nuevo
            return fetch( e.request ).then( newRes => {

                //en esta parte podria crecer mucho el dynamic cache entonces voy a utilizar un fichero utils

                //llamar a la función en sw-utils.js y retornarla
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });


        }

    });

    //respuesta
    e.respondWith( respuesta );
});
