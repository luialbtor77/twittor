

// Archivo auxiliar del ServiceWorker para cierta lógica


// función para guardar en el cache dinámico
function actualizaCacheDinamico( dynamicCache, req, res ) {

    //si la respuesta se hizo, tengo data que almacenar
    if ( res.ok ) {
        //retorna una promesa
        return caches.open( dynamicCache ).then( cache => {

            // almacenar en el cache la request
            // clonar la respuesta recibida
            cache.put( req, res.clone() );
            //retornar el clone de la respuesta
            return res.clone();
        });
    } else {
        //no viene nada (fallo el cache y fallo la red)
        return res; //vendrá un 404, error de conexión o otro error de no poder recuperar el registro
        

    }
 }