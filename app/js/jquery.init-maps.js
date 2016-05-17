(function ($, window, document, undefined) {
  'use strict';

  if (google === 'undefined') {return;}

  var mapOptions = {
        zoom: 16,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
        }
      },
      body = $('body'),
      mapsCollection = body.find('.map-holder'),
      geocoder = new google.maps.Geocoder(),
      requestData = window.config.requestData,
      map = new google.maps.Map(document.getElementById('map'), mapOptions),
      marker = 'images/decorations/marker.png',
      promise;

  // getting data function
  function getData (dataUrl, dataType) {
    var dfd = $.Deferred();

    $.ajax({
      url: dataUrl,
      dataType: dataType,
      success: function (response) {
        if (dataType === 'xml') {
          dfd.resolve($.xml2json(response));
        } else {
          dfd.resolve(response);
        }
      },
      error: function (xhr, status, errorThrown) {
        console.log(xhr, status, errorThrown);
      }
    });

    return dfd.promise();
  }

  // map initialization function
  function googleMaps() {
    var mapOptionsBox = body.find('.map-box'),
        contactsBox = body.find('.contacts'),
        myLatLng = mapOptions.center,
        searchBox = mapOptionsBox.find('.search-input'),
        btnClear = mapOptionsBox.find('.clear, .btn-close'),
        btnSearch = mapOptionsBox.find('.search'),
        btnCurrentPosition = mapOptionsBox.find('.home-location'),
        directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer(),
        errorClass = 'error',
        warningClass = 'warning',
        hasDirectionsClass = 'directions',
        onChangeHandler;

    function checkClassExistance () {
      if (mapOptionsBox.hasClass(errorClass)) {
        mapOptionsBox.removeClass(errorClass);
      } else if (mapOptionsBox.hasClass(warningClass)) {
        mapOptionsBox.removeClass(warningClass);
      }
    }

    checkClassExistance();

    // function geocode
    function geocodeLatLng(geocoder, map) {
      geocoder.geocode({ 'location': mapOptions.center }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results) {
            map.setZoom(16);
            map.setCenter(mapOptions.center);
            new google.maps.Marker({
              position: mapOptions.center,
              map: map,
              icon: marker
            });
          } else {
            mapOptionsBox.addClass(warningClass);
          }
        } else {
          mapOptionsBox.addClass(errorClass);
        }
      });
    }

    // set marker to current position
    new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: marker
    });

    // set marker on center
    google.maps.event.addDomListener(window, 'resize', function () {
      map.setCenter(mapOptions.center);
    });

    // event search place on click
    btnSearch.on('click', function () {
      onChangeHandler(searchBox.val());
      checkClassExistance();
    });

    // event search place on enter
    searchBox.on('keydown', function (e) {
      if (e.keyCode === 13) {
        onChangeHandler($(this).val());
        checkClassExistance();
      }
    });

    // event clear search input
    btnClear.on('click', function (e) {
      e.preventDefault();

      searchBox.val('');
      directionsDisplay.setDirections( { routes: [] } );
      geocodeLatLng(geocoder, map);
      checkClassExistance();
      contactsBox.removeClass(hasDirectionsClass);
    });

    // event finding current location
    btnCurrentPosition.on('click', function (e) {
      e.preventDefault();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
          onChangeHandler(pos);
        }, function(err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        });
      }
      checkClassExistance();
    });

    // function auticompelete
    if (typeof $ === 'function' && typeof $.fn.geocomplete === 'function') {
      searchBox.geocomplete();
    }

    directionsDisplay.setMap(map);

    directionsDisplay.setOptions( { suppressMarkers: true } );
    directionsDisplay.setPanel(document.getElementById('direction-panel'));

    // function calculate route
    function calculateAndDisplayRoute(data) {
      directionsService.route({
        origin: data,
        destination: mapOptions.center,
        travelMode: google.maps.TravelMode.DRIVING
      }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          contactsBox.addClass(hasDirectionsClass);
        } else {
          mapOptionsBox.addClass(errorClass);
        }
      });
    }

    onChangeHandler = function (data) {
      calculateAndDisplayRoute(data);
    };
  }

  // workin with maps collection
  mapsCollection.each(function () {
    var cur = $(this);

    $.each(requestData, function (index, item) {
      if (cur.data('name') === item.name) {
        promise = getData(item.url, item.type);
      }
    });
  });

  // working with ajax response data
  promise.then(function(response) {
    googleMaps();

    if (response.about_building) {
      geocoder.geocode( { 'address': response.about_building.address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          mapOptions.center = results[0].geometry.location;
          map.setCenter(results[0].geometry.location);
          new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: marker
          });
        } else {
          window.alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    } else {
      mapOptions.center = new google.maps.LatLng(response.lat, response.lng);
      map.setCenter(new google.maps.LatLng(response.lat, response.lng));
      new google.maps.Marker({
        position: new google.maps.LatLng(response.lat, response.lng),
        map: map,
        icon: marker
      });
    }
  });

})(jQuery, window, window.document);