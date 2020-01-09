module.exports = function Geocoding(options) {

  var map = options.map || document.getElementById("map") || L.map('map');

  function getPlacenameFromCoordinates(lat, lng, precision, onResponse) {
    $.ajax({
      url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng + "&key=AIzaSyAOLUQngEmJv0_zcG1xkGq-CXIPpLQY8iQ",
      success: function(response) {
        if(response.status === "OK") {
          console.log(response.results[0]);

          var country;
          var fullAddress = response.results[0].formatted_address.split(",");
          for (i in response.results) {
            if(response.results[i].types.indexOf("country") != -1) {
              //If the type of location is a country assign it to the input box value
              country = response.results[i].formatted_address;
            }
          }
          if (!country) country = fullAddress[fullAddress.length - 1];

          if(precision <= 0) onResponse(country);

          else if(precision == 1) {
            if (fullAddress.length>=2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
            else onResponse(country);
          }

          else if(precision >= 2) {
            if (fullAddress.length >= 3) onResponse(fullAddress[fullAddress.length - 3] + ", " + fullAddress[fullAddress.length - 2] + ", " + country);
            else if (fullAddress.length == 2) onResponse(fullAddress[fullAddress.length - 2] + ", " + country);
            else onResponse(country);
          }

          else onResponse(response.results[0].formatted_address);
        } else {
          console.log("Error retrieving location: " + response.error_message);
        }
      },
      error: function(error) {
        console.log(error);
        onResponse("");
      }
    });
  }

  function panMapByBrowserGeocode(checkbox) {
    var x = document.getElementById("location");
      if(checkbox.checked == true) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function displayPosition(position) {
          panMap(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
        }
    }
  }

  function panMapToGeocodedLocation(selector) {
    
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        geocodeStringAndPan(str);
      }, 10);
    });

    $("#"+selector).keypress(function(e) {
      setTimeout(function () {
        if(e.which == 13) {
          var str = input.value;
          geocodeStringAndPan(str);
        }
      }, 10);
    });

  };

  function geocodeWithBrowser(success) {
    if(success) {
      var label = document.createElement("label");
      label.classList.add("spinner");
      var i = document.createElement("i");
      i.classList.add("fa");
      i.classList.add("fa-spinner");
      i.classList.add("fa-spin");
      label.appendChild(i);
      var element = document.getElementById(options.geocodeButtonId);
      element.appendChild(label);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
        options.goTo(position.coords.latitude, position.coords.longitude,options.zoom);
        $("i").remove(".fa");
        }, function(error) {
          console.log(error);
        });
      }
    }
  }

  function geocodeStringAndPan(string, onComplete) {
    if(typeof map.spin == 'function'){
      map.spin(true) ;
    }
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + string.split(" ").join("+") + "&key=AIzaSyAOLUQngEmJv0_zcG1xkGq-CXIPpLQY8iQ" ;

    var Blurred = $.ajax({
        async: false,
        url: url
    });
    onComplete = onComplete || function onComplete(response) {
      if(response.status === "OK") {
        $("#lat").val(response.results[0].geometry.location.lat);
        $("#lng").val(response.results[0].geometry.location.lng);

        map.setView([response.results[0].geometry.location.lat, response.results[0].geometry.location.lng], options.zoom);
      } else {
        console.log("Error retrieving location: " + response.error_message);
      }
      if(typeof map.spin == 'function'){
        map.spin(false) ;
      }
    }
    onComplete(Blurred.responseJSON);
  }

  return {
    geocodeStringAndPan: geocodeStringAndPan,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    geocodeWithBrowser: geocodeWithBrowser
  }
}
