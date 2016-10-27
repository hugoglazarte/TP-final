function Artista(id, nombre, imagen) {

  this.id = id;
  this.nombre = nombre;
  this.imagen = imagen;

}




var Spotify = (function () {

  // Atributos privados
  var artistas = [];
  var claveLocalStorage = 'artistas';

  /*
  Permite precargar las peliculas por localstorage
  */
var precargarArtistas = function () {

    var datos = localStorage.getItem(claveLocalStorage);

    if (datos !== null) {

      artistas = JSON.parse(datos);

      for (i = 0; i < artistas.length; i++) {

      dibujarArtista(artistas[i]);

      }

    }

  }

var agregarArtista = function (artista) {

    artistas.push(artista);

    guardarArtistas();

    //dibujarPelicula(pelicula);

  }

var guardarArtistas = function () {

    var datos = JSON.stringify(artistas);
    localStorage.setItem(claveLocalStorage, datos);

  }


  // URL: http://www.omdbapi.com/?s=Batman

var buscarArtista = function () {

	// debugger;

      var artistaAbuscar = $('#buscadorArtistas').val();
      var api = 'https://api.spotify.com/v1/';

      $.ajax({
  
        url: "https://api.spotify.com/v1/search?type=artist&q=" + artistaAbuscar ,
        crossDomain: true,
        dataType: "json"

      }).done(function (datos) { // el parametro datos es lo que se recibe desde el servidor

        // Se ejecutara esta seccion si todo salio bien
        var resultados = datos.artists;

        limpiarArtistasDOM();

        console.log(resultados);

        for(obj in resultados.items){

        	var id = resultados.items[obj].id;

        	var nombre = resultados.items[obj].name;

        	var imagen = resultados.items[obj].images[0].url;

        	console.log(id);

        	var artista = new Artista(id,nombre,imagen);

        	dibujarArtista(artista);

        }


      }).fail(function (jqXHR, textStatus) {

        // Se ejecutara esta seccion si hubo algun problema
        console.error("ocurrio un error inesperado...");


      });
          
}

var obtenerPosicionArtista = function (id) {
		debugger;
        var posicion = -1; 
        
        // La condicion del for lee: 'Mientras haya elementos en el array de noticias por recorrer y la posicion sea -1
        for(i = 0; i < artistas.length && posicion === -1; i++) { 

            if (artistas[i].id === id) { 
                
                // Si los ids coinciden me guardo el contenido de la variable i en la variable posicion
                posicion = i; 

            }

        }

        return posicion;

}

// Chequear en fav

var buscarEnfavoritos = function (artista) {
		debugger;

		var posicion = obtenerPosicionArtista(artista.id);

		var estado = -1 ;

		if( posicion === -1) {

			//$('#estado-'+tarea.id).html('íncompleto');
			var claseIcono = 'glyphicon glyphicon-star-empty';

		} else {

			//$('#estado-'+tarea.id).html('completo');
			var claseIcono = 'glyphicon glyphicon-star';

		}

		return claseIcono;


	}


var vincularBuscador = function () {

    $('#buscarArtistas').on('click', function () {

        buscarArtista();

    })

}

var vincularFavorito = function () {

	$('#linkFavoritos').on('click', function () {

		$(this).parent().addClass('active');

		$('#linkBuscador').parent().removeClass('active');

		limpiarArtistasDOM();

		precargarArtistas();

	})

}

var limpiarArtistasDOM = function () {

    $('#resultadoArtistas').empty();

}


  /*
  Dibuja en el DOM la pelicula pasada como parametro
  */
var dibujarArtista = function (artista) {


    $('<li/>')
      .attr('id', artista.id)
      .addClass('list-group-item')
      .appendTo('#resultadoArtistas');


    $('<h3/>').html(artista.nombre).appendTo('#' + artista.id);

    $('<img/>').attr('src', artista.imagen).appendTo('#' + artista.id);


    var divFavorito = $('<div/>').attr('style', 'margin-top: 10px;').appendTo('#' + artista.id);

    $('<span/>')
       .addClass(buscarEnfavoritos(artista)) //'glyphicon glyphicon-star-empty'
       .appendTo(divFavorito)
       .on('click', function(){ 

       		agregarArtista(artista);
       		$('this').removeClass('glyphicon glyphicon-star-empty').addClass('glyphicon glyphicon-star');

       });

    $('<label/>').html(" Guardar como Favorito").appendTo(divFavorito);

  }



	var vincularEventos = function () {

    // $('#mostrarOcultarListado').on('click', mostrarOcultarListado);
    $('#buscarArtistas').on('click', buscarArtista);
    // $('#borrarSeleccionados').on('click', borrarSeleccionados);

	}


  var iniciar = function () {

  	// precargarArtistas();
    vincularEventos();
    vincularFavorito(); 
    
  }

  return {

    iniciar: iniciar

  };

})()



$(document).ready(function () {

  Spotify.iniciar();

});