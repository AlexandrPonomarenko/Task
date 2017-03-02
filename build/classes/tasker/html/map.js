var newTaskMarker = "img/map-marker.png",
    map,
    geocoder,
    marker,
    newLoactionMarker,
    newPlace,
    places = [],
    infoWindow,
    autocomplete,
    startPos,
    polylines = [],
    tasks = [];

function findAddress(){
    var place = autocomplete.getPlace();
    infoWindow.close();
    if (!place.geometry) {
      return;
    }

    newPlace = place;
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(7);
    }

    newLoactionMarker.setPosition({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    });
    newLoactionMarker.setVisible(true);
}

function getAddress(latLng) {
    infoWindow.close();
    geocoder.geocode( {'latLng': latLng}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            if(results[0]) {
                places = results;
                window.mapHash.find.val(results[0].formatted_address);
            }
            else {
                places = [];
                window.mapHash.find.val("Address not found");
            }
        }
        else {
            places = [];
        }
    });
}

function initialize() {
    var defLatLng = new google.maps.LatLng(49.98809732303098, 36.233253479003906);
    var mapOptions = {
        center: defLatLng,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        panControl: false
    };
    geocoder = new google.maps.Geocoder();
    
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    infoWindow = new google.maps.InfoWindow();
    newLoactionMarker = new google.maps.Marker({ map: map, icon: 'img/marker-k.png'});
    newLoactionMarker.addListener('click', function (){
        if (!window.mapHash.isMode){
            createInfoWindow();
        }
    });

    google.maps.event.addListener(map, 'click', function(event) {
        var _location, _lat, _lng;
        if (window.mapHash.isFOpen || window.mapHash.isMode) {
            newPlace = null;
            newLoactionMarker.setVisible(false);
            infoWindow.close();
            getAddress(event.latLng);
            _location = event.latLng;
            if (window.mapHash.isMode) {
                removePolyline();
                startPos = _location;
            } else {
                startPos = null;
            }
            _lat = _location.lat();
            _lng = _location.lng();
            newLoactionMarker.setPosition({
                lat: _lat,
                lng: _lng
            });
            newLoactionMarker.setVisible(true);
        }
    });

    autocomplete = new google.maps.places.Autocomplete(window.mapHash.find[0]);
    autocomplete.bindTo('bounds', map);
}
function createInfoWindow() {
    var i, border, margin, _content = '';
        if (newPlace || places.length > 0) {
            if (newPlace) {
                _content += ('<div><strong>' + newPlace.name + '</strong><br>');
                _content += newPlace.formatted_address;
                _content += '<br><button onclick="openNewTaskWindow()" ';
                _content += 'style="margin-top: 5px; background-color: #DADAFF; color: #005CB1; border-radius: 4px; border: none; cursor: pointer;"';
                _content += '>Create new task</button></div>';
            } else {
                for (i = 0; i < places.length; i++) {
                    if (i < places.length - 1) {
                        border = '1px solid #BFBFBF;';
                    } else {
                        border = 'none;';
                    }
                    _content += '<div style="min-height: 20px; padding-left: 50px; padding-top:5px; border-bottom:' + border + '">';
                    _content +=     '<div style="position: absolute; left: 0; display: inline-block;">';
                    _content +=         '<span';
                    _content +=             ' place-id="' + i + '"';
                    _content +=             ' style="border-radius:4px; position: replative; padding: 3px; background-color: #DADAFF; color: #005CB1; cursor: pointer;"';
                    _content +=             ' onclick="choiceOfLocation('+i+')"';
                    _content +=             '>Choose';
                    _content +=         '</span>';
                    _content +=     '</div>';
                    _content +=     '<div style="position: replative; display: inline-block;">';
                    _content +=         '<span style="padding: 3px;">';
                    _content +=             places[i].formatted_address;
                    _content +=         '</span>';
                    _content +=     '</div>';
                    _content += '</div>';
                }
            }
            infoWindow.setContent(_content);
            infoWindow.open(map, newLoactionMarker);
        }
}
function choiceOfLocation (index) {
    newPlace = places[index];
    newPlace.name = newPlace.address_components[0].long_name;
    window.mapHash.find.val(newPlace.formatted_address);
    createInfoWindow();
}
function openNewTaskWindow(){
    window.mapHash.openNewTaskWindow(newPlace.formatted_address);
    places = [];
    infoWindow.close();
}

function NewTask(_lat, _lng, _title, _description){
    var self = this,
        _infowindow = new google.maps.InfoWindow();
    this.marker = new google.maps.Marker({
        position: {lat: _lat, lng: _lng},
        map: map,
        icon: "img/map-marker.png"
    });
    this.title = _title;
    this.description = _description;
    this.lat = _lat;
    this.lng =_lng;
    
    this.marker.addListener('click', function(e){
        _infowindow.setContent('<div><strong>' + self.title + '</strong></div><div>' + self.description + '</div>');
        _infowindow.open(map, self.marker);
    });
}

function createNewTask(title, description) {
    var _location, lat, lng;
    if (newPlace) {
        _location = newPlace.geometry.location;
        lat = _location.lat();
        lng = _location.lng();
        tasks.push(new NewTask(lat, lng, title, description));
        window.mapHash.newTaskNode(tasks.length - 1, title);
        app.createNewTask(lat, lng, title, description);
//        replaceMarker();
    }
}

function hideNewLoactionMarker() {
    if (newPlace || places.length > 0) {
        infoWindow.close();
        newLoactionMarker.setVisible(false);
        newPlace = null;
        places = [];
    }
}

function replaceMarker() {
    if (newPlace) {
        var lastPlace = tasks[tasks.length - 1];
        lastPlace.marker.setVisible(true);
        hideNewLoactionMarker();
    }
}

function removeTask(id) {
    var i, itemId = 0,
        arr = [],
        itemArr = [],
        _task = tasks[id];
    _task.marker.setVisible(false);
    for (i = 0; i < tasks.length; i++) {
        if (i !== id) {
            arr.push(tasks[i]);
            itemArr.push(window.mapHash.items[i]);
            window.mapHash.items[i].attr('id', itemId);
            itemId += 1;
        }
    }
    tasks = arr;
    window.mapHash.items = itemArr;
    app.removeTask(id);
}

function setCenter(id) {
    var _task = tasks[id],
        clickLatLng = new google.maps.LatLng(_task.lat, _task.lng);
    map.setOptions({ center: clickLatLng });
}

function switchMode(value) {
    if (value) {
    var icon = {
        url: "img/map-marker-man.png", // url
        scaledSize: new google.maps.Size(32, 32), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(16, 26) // anchor
    };
    newLoactionMarker.setIcon(icon)

    } else {
        newLoactionMarker.setVisible(false);
        newLoactionMarker.setIcon("img/marker-k.png");
    }
}

function findWay() {
    var location;
    if (places.length > 0) {
        location = places[0].geometry.location;
        app.findWay(location.lat(), location.lng());
    }
}

function showWay(pathString) {
    var i, j, len, path, service, lat_lng = [];
    removePolyline();
    pathString = pathString.split(';');
    for (i = 0; i < pathString.length; i++) {
        pathString[i] = pathString[i].split(',');
    }

    path = new google.maps.MVCArray();
    service = new google.maps.DirectionsService();

    lat_lng.push(new google.maps.LatLng(startPos.lat(), startPos.lng()));

    for (i = 0; i < pathString.length; i++) {
        var t = tasks[pathString[i][1]];
        
        lat_lng.push(new google.maps.LatLng(t.lat, t.lng));
    }

    for(i = 0; i < lat_lng.length; i++){
        if ((i + 1) < lat_lng.length) {
            var src =  lat_lng[i];
            var des = lat_lng[i + 1];
            service.route({
                origin: src,
                destination: des,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var poly = new google.maps.Polyline({map: map, strokeColor: '#FF8200'});
                    var path = new google.maps.MVCArray();
                    for (j = 0, len = result.routes[0].overview_path.length; j < len; j++) {
                        path.push(result.routes[0].overview_path[j]);
                    }
                    poly.setPath(path);
                    polylines.push(poly);
                }
            });
        }
    }
}

function removePolyline(){
    if (polylines) {
        for (var i = 0; i < polylines.length; i++) {
            polylines[i].setMap(null);
        }
        polylines = [];
    }
}

jQuery(document).ready(function() {
    initialize();
});

