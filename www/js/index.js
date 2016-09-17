    var urlCoordenadas 		= window.baseURL + "/api/coordenadas";
	var miLatitud 			= null;
	var miLongitud 			= null;
    var arregloCoordenadas  = [];

/**************************************************************************************************/

    var datos = {
    	coordenadas: function(){
		   	$.getJSON(urlCoordenadas)
		    .done(function(data) {
		        $.each(data, function(i, field) {
		            arregloCoordenadas.push(field);
		        });
				app.initialize();

		    });    		
    	},
    }

    datos.coordenadas();

/**************************************************************************************************/

	var mapa = {

	    generarMapa: function() {
            var myCenter = new google.maps.LatLng(miLatitud, miLongitud);
            var mapProp = {
                center: myCenter,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            //colocamos la posicion del usuario
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(miLatitud, miLongitud),
                title: 'Tú',
                animation:google.maps.Animation.BOUNCE
            });
            marker.setMap(map);

            this.setMarkerPuntos(map);
	    },

	    setMarkerPuntos: function(map){
            for (var i = 0; i < arregloCoordenadas.length; i++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(arregloCoordenadas[i].latitud, arregloCoordenadas[i].longitud),
                    title: arregloCoordenadas[i].nombre
                });
                marker.setMap(map);

                //calculamos distancias
                var distanciaPunto = this.calcDistance(miLatitud, miLongitud, arregloCoordenadas[i].latitud, arregloCoordenadas[i].longitud);
                var infoPunto = "<div class='chip'>" + arregloCoordenadas[i].nombre + " : " + distanciaPunto + " Km </div>";
                $("#info-puntos").append(infoPunto);
            }
	    },
	
		calcDistance: function(fromLat, fromLng, toLat, toLng) {
		    var distancia = google.maps.geometry.spherical.computeDistanceBetween(
		        new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
		    return ((distancia *0.001).toFixed(2))
		},
	}

/**************************************************************************************************/

	var app = {
	    initialize: function() {
	        this.bindEvents();
	    },

	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	    },

	    onDeviceReady: function() {
	        var onSuccess = function(position) {
	            miLatitud = position.coords.latitude;
	            miLongitud = position.coords.longitude;
	            google.maps.event.addDomListener(window, 'load', mapa.generarMapa());
	        };

	        var onError = function onError(error) {
	            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	        }

	        navigator.geolocation.getCurrentPosition(onSuccess, onError);
	    },
	}

