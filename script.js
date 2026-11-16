/* Leonardo Egea Rodríguez */
/* Selección de elementos DOM */
/* Trae el botón y el contenedor donde se mostrarán las noticias */
const botonRefrescar = document.getElementById('btn-refresh');
const contenedorNoticias = document.getElementById('contenedor-noticias');

/* API KEY para enlazar con GNEWS */
const API_KEY = '59ceab18a2d20af1771529a8cebabf84'; 

/* Función principal: Cargar Noticias con Fetch */
function cargarNoticias() {
    /* Muestra el mensaje de "Cargando..." mientras la API responde */
    contenedorNoticias.innerHTML = '<p style="color:white; text-align:center; font-size:20px; font-weight:bold; margin-top:20px;">Actualizando el feed de noticias...</p>';

    /* Se definió la URL de la API de GNews con noticias de México en idioma español */
    const urlOriginal = `https://gnews.io/api/v4/search?lang=es&country=mx&max=10&apikey=${API_KEY}`;
    
    /* Usamos un proxy público (allorigins) para evitar el bloqueo de seguridad CORS */
    const urlProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(urlOriginal)}`;

    /* Función fetch  apuntando al proxy */
    fetch(urlProxy)
        .then(function(respuesta) {
            /* Verifica si la respuesta HTTP fue exitosa */
            if (!respuesta.ok) {
                throw new Error('No se pudo conectar con el servidor de noticias.');
            }
            /* Convierte la respuesta a formato JSON */
            return respuesta.json();
        })
        .then(function(datos) {
            /* El proxy devuelve los datos de GNews como texto en 'contents'. 
               Usamos JSON.parse para convertirlo en un objeto de JavaScript. */
            const noticiasJSON = JSON.parse(datos.contents);
            
            /* Verifica si el arreglo 'articles' tiene contenido */
            if (noticiasJSON.articles && noticiasJSON.articles.length > 0) {
                /* Se llama a la función que muestra las noticias en el HTML */
                mostrarNoticias(noticiasJSON.articles);
            } else {
                /* Si no hay noticias se muestra aviso de que no hay noticias actuales */
                contenedorNoticias.innerHTML = '<p style="color:white; text-align:center; font-size:20px; margin-top:20px;">No hay noticias disponibles en este momento.</p>';
            }
        })
        .catch(function(error) {
            /* Manejo de errores: si falla el internet, la API o la clave */
            /* Se muestra un mensaje de alerta */
            contenedorNoticias.innerHTML = `
                <div style="background-color: red; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin-top: 20px; border: 2px solid white;">
                    Error de conexión: ${error.message} <br> 
                    <span style="font-size: 14px; font-weight: normal;">(Verifica tu API Key o tu conexión a internet).</span>
                </div>`;
        });
}

/* Función para mostrar las noticias */
function mostrarNoticias(noticias) {
    /* Limpia el contenedor para quitar el mensaje de "Cargando..." */
    contenedorNoticias.innerHTML = '';

    /* Recorre el arreglo de noticias con un bucle */
    for (let i = 0; i < noticias.length; i++) {
        /* Guarda la noticia en una variable */
        const noticia = noticias[i];
        
        /* Crea un nuevo elemento <div> para la tarjeta */
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-noticia'; 

       /* Se envuelve el título en un enlace <a> para que al hacer clic abra la noticia */
        tarjeta.innerHTML = `
            <a href="${noticia.url}" target="_blank" style="text-decoration: none; color: #1e3a8a;">
                <h2>${noticia.title}</h2>
            </a>
            <p>${noticia.description}</p>
            <a href="${noticia.url}" target="_blank">Leer noticia completa</a>
        `;

        /* Agrega la tarjeta al contenedor principal */
        contenedorNoticias.appendChild(tarjeta);
    }
}

/* Evento para el botón */
/* Cuando el usuario haga clic en el botón, se ejecuta la función cargarNoticias() */
botonRefrescar.addEventListener('click', cargarNoticias);
