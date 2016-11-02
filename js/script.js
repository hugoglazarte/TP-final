function Artista(id, nombre, imagen) {

  this.id = id;
  this.nombre = nombre;
  this.imagen = imagen;

}


var Spotify = (function () {

  // Atributos privados
  var artistas = [];

  var claveLocalStorage = 'artistas';



  // GUARDANDO ARTISTAS EN LS 

  var guardarArtistas = function () {

    var datos = JSON.stringify(artistas);

    localStorage.setItem(claveLocalStorage, datos);

  }

  /*
  Permite precargar las peliculas por localstorage
  */

  var precargarArtistas = function () {

    var datos = localStorage.getItem(claveLocalStorage);

    if (datos !== null) {

      artistas = JSON.parse(datos);

      // for (i = 0; i < artistas.length; i++) {

      //   dibujarArtistaFavorito(artistas[i]);

      //   }
      }
  }


  // FUNCION Q AGREGA ARTISTAS A ARRAY ARTISTAS

  var agregarArtista = function (artista) {

    artistas.push(artista);

    guardarArtistas();

  }


  // FUNCION PARA BUSCAR ARTISTAS

  var buscarArtista = function () {

      var artistaAbuscar = $('#buscadorArtistas').val();

      var api = 'https://api.spotify.com/v1/';

      $.ajax({
  
        url: "https://api.spotify.com/v1/search?type=artist&q=" + artistaAbuscar ,
        crossDomain: true,
        dataType: "json"

      }).done(function (datos) { 

        // Se ejecutara esta seccion si todo salio bien
        var resultados = datos.artists;

        limpiarArtistasDOM();

        for(obj in resultados.items){

        	var id = resultados.items[obj].id;

        	var nombre = resultados.items[obj].name;

        	var imagen = resultados.items[obj].images[0].url;

        	var artista = new Artista(id,nombre,imagen);

        	dibujarArtista(artista);

        }

      }).fail(function (jqXHR, textStatus) {
        // Se ejecutara esta seccion si hubo algun problema
        console.error("ocurrio un error inesperado...");

      });       
  }

  // VARIANTE DE CONEXION

  var buscarDiscografia = function (id) {

      var api = 'https://api.spotify.com/v1/';

      $.ajax({
  
        url: 'https://api.spotify.com/v1/artists/' + id + '/albums?album_type=album&' ,
        crossDomain: true,
        dataType: "json"

      }).done(function (datos) { 

        var discografia = datos.items;

        var divArtista = $("#" + id);

        var listadoUl = $('<ul/>').attr('style', 'margin-top: 10px;').appendTo(divArtista);

        for(obj in discografia){

          var idDisco = discografia[obj].id;

          var nombre = discografia[obj].name;

          $('<li/>')
            .attr('id', idDisco)
            .attr('style', 'cursor: pointer;')
            .html(nombre)
            .appendTo(listadoUl)
            .off('click')
            .on('click' , function() {

                $('#dialogDetalleAlbum').modal('show', mostrarDisco($(this).attr('id')));

            });

        }



      }).fail(function (jqXHR, textStatus) {

        // Se ejecutara esta seccion si hubo algun problema
        console.error("ocurrio un error inesperado...");


      });
          
}

  // BUSCANDO DISCOS

  var mostrarDisco = function (id) {

      var api = 'https://api.spotify.com/v1/';

      $.ajax({
  
        url: 'https://api.spotify.com/v1/albums/' + id  ,
        crossDomain: true,
        dataType: "json"

      }).done(function (datos) { // el parametro datos es lo que se recibe desde el servidor

        var disco = datos;

        var modal = $('#dialogDetalleAlbum');

        //modal.empty();

        $('.modal-title').empty();
        $('.modal-body').empty();

        $('.modal-title').html(disco.name);

        var cuerpoModal = $('.modal-body');

        $('<h5/>').html(disco.release_date).appendTo(cuerpoModal);

        $('<img/>').attr('src', disco.images[0].url).attr('style', 'width: 300px;').appendTo(cuerpoModal);

        var listaTemas = $('<table/>').addClass('table table-hover').appendTo(cuerpoModal);

        var tbodyLista = $('<tbody/>').appendTo(listaTemas);

        

        //console.log(disco.tracks.items);

        var temas = disco.tracks.items;

        for(obj in temas){

            var numeroTrack = temas[obj].track_number;

            var nombre = temas[obj].name;

            var audio = temas[obj].preview_url;

            var duracion = temas[obj].duration_ms;

            function formateandoDuracion(milli){

                var seconds = Math.floor((milli / 1000) % 60);
                
                if(seconds < 10){
                    seconds = '0' + seconds;
                }
                
                var minutes = Math.floor((milli / (60 * 1000)) % 60);

                return minutes + ":" + seconds;

            };

            var duracionTrack = formateandoDuracion(duracion);

            var trBody = $('<tr/>').appendTo(tbodyLista);

            $('<td/>').html(numeroTrack).appendTo(trBody);
            $('<td/>').html(nombre).appendTo(trBody);
            $('<td/>').html(duracionTrack).appendTo(trBody);

            var tdIcono = $('<td/>').addClass('play').attr('id', numeroTrack);

            //var tdIcono = $('<td/>').addClass('play').attr('id', 'btn' + numeroTrack);

            var playIcon = $('<span/>').addClass('glyphicon glyphicon-play-circle');

            playIcon.appendTo(tdIcono);

            var etiquetaAudio = $('<audio/>').attr('id', 'tema' + numeroTrack );

            $('<source/>').attr('src', audio).attr('type','audio/ogg').appendTo(etiquetaAudio);

            etiquetaAudio.appendTo(tdIcono);

            tdIcono.appendTo(trBody);

            $('.play').off('click');

            $('.play').on('click', function(){

                  var $this = $(this);

                  //var id = $this.attr('id').replace(/btn/, '');

                  var id = $this.attr('id');

                  $this.toggleClass('active');

                  if($this.hasClass('active')){

                     $this.find('span').toggleClass('glyphicon-pause');

                      $('audio[id^="tema"]')[id-1].play();    

                  } else {
                     
                      $('audio[id^="tema"]')[id-1].pause();

                      $this.find('span').removeClass('glyphicon-pause');

                  }

            });

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

// CHEQUEANDO SI ESTA EN FAVORITO AL CARGARLOS

var buscarEnfavoritos = function (id) {
		debugger;

		var posicion = obtenerPosicionArtista(id);

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


// VINCULANDO BOTON PESTAÑA FAV

var vincularBotonFavorito = function () {

	$('#linkFavoritos').on('click', function () {

		$(this).parent().addClass('active');

		$('#linkBuscador').parent().removeClass('active');

		limpiarArtistasDOM();

		//precargarArtistas();

    for (i = 0; i < artistas.length; i++) {

        dibujarArtistaFavorito(artistas[i]);

    }

	})

}

// VINCULANDO BOTON PESTAÑA BUSCAR

var vincularBotonBuscar = function () {

  $('#linkBuscador').on('click', function () {

    $(this).parent().addClass('active');

    $('#linkFavoritos').parent().removeClass('active');

    limpiarArtistasDOM();

    // precargarArtistas();

  })

}

var limpiarArtistasDOM = function () {

    $('#resultadoArtistas').empty();

}


  /*
  Dibuja en el DOM la pelicula pasada como parametro
  */
// FUNCION DIBUJAR LAS BUSQUEDAS

var dibujarArtista = function (artista) {


    $('<li/>')
      .attr('id', artista.id)
      .addClass('list-group-item')
      .appendTo('#resultadoArtistas');

    $('<h3/>').html(artista.nombre).appendTo('#' + artista.id);

    $('<img/>').attr('src', artista.imagen).appendTo('#' + artista.id);


    var divFavorito = $('<div/>').attr('style', 'margin: 10px;').appendTo('#' + artista.id);

    $('<span/>')
       .attr('style','color: #f39c12;')
       .addClass(buscarEnfavoritos(artista.id)) //'glyphicon glyphicon-star-empty'
       .appendTo(divFavorito)
       .on('click', function(){ 

          $(this).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
          alert('hiciste click en la imagen');
       		agregarArtista(artista);

       	//	$('this').removeClass('glyphicon-star-empty');

       });

    $('<label/>').html(" Guardar como Favorito").appendTo(divFavorito);

}


// FUNCION DIBUJAR EN FAVORITOS

var dibujarArtistaFavorito = function (artista) {

  $('<li/>')
      .attr('id', artista.id)
      .addClass('list-group-item')
      .appendTo('#resultadoArtistas');



  // ARMANDO BOTON ELIMINAR

  var botonEliminar = $('<button/>')
      .addClass('btn btn-default btn-xs boton-borrar')
      .on('click', function () { eliminarArtista(artista.id); });



  $('<span/>')
      .addClass('glyphicon glyphicon-remove')
      .html('Borrar')
      .appendTo(botonEliminar);

    
  botonEliminar.appendTo('#' + artista.id);

  // ARMANDO VISTA FAVORITO

  $('<h3/>').html(artista.nombre).appendTo('#' + artista.id);

  $('<img/>')
      .attr('src', artista.imagen)
      .appendTo('#' + artista.id)
      .on('click', function () {

        alert('hiciste click en la imagen');

      } );

  var espacioDisco = $('<div/>').attr('style', 'margin: 10px;').appendTo('#' + artista.id);

  $('<button/>')
      .addClass('btn btn-default')
      .html('Ver Discografia')
      .attr('display', 'block')
      .on('click', function(){buscarDiscografia(artista.id)})
      .appendTo('#' + artista.id);

  //var listadoUl = $('<ul/>').appendTo(espacioDisco);

}


// MOSTRANDO DISCOS

var mostrarDiscografia = function (consulta) {

    //debugger;

    var divArtista = $("#" + id);

    var discografia = buscarDiscografia(id);

    // buscarDiscografia(id);

    console.log(discografia);

    // for(obj in discografia){

    //       var id = discografia[obj].id;

    //       var nombre = discografia[obj].name;

    //       $('<li/>').html(nombre).appendTo(divArtista);

    // }

}

// FUNCION BOTON ELIMINAR

var eliminarArtista = function (id) {

    var posicion = obtenerPosicionArtista(id);

    // Borra 1 elemento desde la posicion
    artistas.splice(posicion, 1);

    guardarArtistas();

    borrarArtistaDOM(id);

}

var borrarArtistaDOM = function (id) {

    //$("#" + id).remove();
    $("#" + id).fadeOut(600, function() { $(this).remove(); });

}

// VINCULAR BOTON BUSCAR

var vincularEventos = function () {

  // $('#mostrarOcultarListado').on('click', mostrarOcultarListado);
  $('#buscarArtistas').on('click', buscarArtista);
  // $('#borrarSeleccionados').on('click', borrarSeleccionados);

}

// 


var iniciar = function () {

  	precargarArtistas();
    vincularEventos();
    vincularBotonFavorito(); 
    vincularBotonBuscar(); 
  
    
}

  return {
    
    iniciar: iniciar

  };

})()



$(document).ready(function () {

  Spotify.iniciar();

});