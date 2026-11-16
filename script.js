/* Selección de elementos DOM */
/* Trae el botón y el contenedor donde se mostrarán las noticias */
const botonRefrescar = document.getElementById('btn-refresh');
const contenedorNoticias = document.getElementById('contenedor-noticias');

/* API KEY de NewsData.io (La que me compartiste) */
const API_KEY = 'pub_708023beb20844169a62b5d76d094da6'; 

/* Función principal: Cargar Noticias con Fetch */
function cargarNoticias() {
    /* Muestra el mensaje de "Cargando..." mientras la API responde */
    contenedorNoticias.innerHTML = '<p style="color:white; text-align:center; font-size:20px; font-weight:bold; margin-top:20px;">Actualizando el feed de noticias...</p>';

    /* URL de la API (Noticias de México en español) */
    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=mx&language=es`;

    /* Función fetch (Lección 10) */
    fetch(url)
        .then(function(respuesta) {
            /* Verifica si la respuesta HTTP fue exitosa */
            if (!respuesta.ok) {
                throw new Error('No se pudo conectar con el servidor de noticias.');
            }
            /* Convierte la respuesta a formato JSON */
            return respuesta.json();
        })
        .then(function(datos) {
            /* NewsData.io devuelve las noticias en el arreglo 'results' */
            if (datos.results && datos.results.length > 0) {
                /* Se llama a la función que muestra las noticias en el HTML */
                mostrarNoticias(datos.results);
            } else {
                /* Si no hay noticias se muestra aviso */
                contenedorNoticias.innerHTML = '<p style="color:white; text-align:center; font-size:20px; margin-top:20px;">No hay noticias disponibles en este momento.</p>';
            }
        })
        .catch(function(error) {
            /* Manejo de errores: si falla el internet o la API */
            contenedorNoticias.innerHTML = `
                <div style="background-color: red; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin-top: 20px; border: 2px solid white;">
                    Error de conexión: ${error.message} <br> 
                    <span style="font-size: 14px; font-weight: normal;">(Verifica tu API Key o tu conexión a internet).</span>
                </div>`;
        });
}

/* Función para mostrar las noticias */
function mostrarNoticias(noticias) {
    /* Limpia el contenedor */
    contenedorNoticias.innerHTML = '';

    /* Recorre el arreglo de noticias con un bucle */
    for (let i = 0; i < noticias.length; i++) {
        /* Guarda la noticia en una variable */
        const noticia = noticias[i];
        
        /* Crea un nuevo elemento <div> para la tarjeta */
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-noticia'; 

        /* NewsData.io usa 'link' para el enlace y a veces la descripción es nula */
        const enlace = noticia.link;
        const descripcion = noticia.description ? noticia.description : "Sin descripción disponible.";

        /* Se envuelve el título en un enlace <a> para que al hacer clic abra la noticia */
        tarjeta.innerHTML = `
            <a href="${enlace}" target="_blank" style="text-decoration: none; color: #1e3a8a;">
                <h2>${noticia.title}</h2>
            </a>
            <p>${descripcion}</p>
            <a href="${enlace}" target="_blank">Leer noticia completa</a>
        `;

        /* Agrega la tarjeta al contenedor principal */
        contenedorNoticias.appendChild(tarjeta);
    }
}

/* Evento para el botón */
/* Cuando el usuario haga clic en el botón, se ejecuta la función cargarNoticias() */
botonRefrescar.addEventListener('click', cargarNoticias);
