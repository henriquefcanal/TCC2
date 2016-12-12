var app = angular.module('minifarma.controllers.pharmacy', ['ngMap']);

app.factory('Pharmacy', function() {
   var pharmacy = {};
   pharmacy.name = '';
   pharmacy.phone = '';
   pharmacy.lat = '';
   pharmacy.lon = '';
   pharmacy.favorite = 0;
   return pharmacy;
});

var farmaciaUpdate = null;

/**********************************
 *  PharmacyListCtrl
 **********************************/
app.controller('PharmacyListCtrl', function($scope, $state, $ionicPopup, PharmacyService) {

  console.log("PharmacyListCtrl");

  $scope.isAndroid = ionic.Platform.isAndroid();

  PharmacyService.all().then(function(farmaciasResult) {
    $scope.farmacias = farmaciasResult
  });

  $scope.getPharmacyName = function (farmacia) {
    debugger;
    farmacia.name = pharmacy.name;
  };

  $scope.createPharmacy = function() {
      $state.go('createPharmacy');
    };

    $scope.updatePharmacy = function(farmacia) {
      debugger;
      farmaciaUpdate = farmacia;
      $state.go('updatePharmacy');
    };

    $scope.backMedicament = function () {
    $state.go('tab.remedio');
  };

  $scope.remove = function(farmacia) {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Confirmação',
       template: 'Deseja realmente excluir este alerta?',
       cancelText: 'Não',
       //cancelType: // String (default: 'button-default'). The type of the Cancel button.
       okText: 'Sim'
     });
     confirmPopup.then(function(res) {
       if(res) {
        PharmacyService.remove(farmacia); 
        $scope.farmacias.splice($scope.farmacias.indexOf(farmacia), 1);
        $state.go('listPharmacy');
       } else {
         $state.go('listPharmacy');
         //console.log('You are not sure');
       }
     });
 };

  $scope.filterValue = 0;
});

/**********************************
 *  PharmacyCreateCtrl
 **********************************/

app.controller('PharmacyCreateCtrl', function($scope, $state, $ionicPopup, Pharmacy, PharmacyService) {

  // $scope.currentPosition = {};
  // $scope.marker = null;
  // $scope.pharmacyLat = null;
  // $scope.pharmacyLon = null;
  $scope.pharmacy = Pharmacy;
  //$scope.liked = false;

  $scope.addPharmacy = function (form) {
    console.log("PharmacyCreateCtrl::addPharmacy");

    if(form.$valid) {
      $scope.pharmacy.name = form.name.$viewValue;
      $scope.pharmacy.phone = form.phone.$viewValue;
      // $scope.pharmacy.lat = $scope.pharmacyLat;
      // $scope.pharmacy.lon = $scope.pharmacyLon;
      console.log($scope.pharmacy);
      PharmacyService.insert($scope.pharmacy);
       var alertPopup = $ionicPopup.alert({
         title: 'Sucesso!',
         template: 'Farmácia cadastrada com sucesso!'
       });
       alertPopup.then(function(res) {
         $state.go('listPharmacy');
         $scope.clearPharmacy();
       });
    } else {
      console.log("Invalid form");
    }
  };


  $scope.clearPharmacy = function () {
    Pharmacy.name = null;
    Pharmacy.phone  = null;
  }

  $scope.cancelCreate = function () {
    $scope.clearPharmacy();
    $state.go('listPharmacy');
  };

  // $scope.$on('mapInitialized', function(event, map) {
  //     $scope.map = map;
  // });

  // $scope.getCurrentLocation = function() {

    // navigator.geolocation.getCurrentPosition(function(position) {
    //   $scope.map.setOptions({
    //     mapTypeId:google.maps.MapTypeId.SATELLITE,
    //     zoom: 15,
    //     disableDefaultUI: true,
    //     zoomControl: true,
    //     scaleControl: false
    //   });

    //   var lat = position.coords.latitude;
    //   var lon = position.coords.longitude;

    //   var pos = new google.maps.LatLng(lat, lon);

    //   $scope.map.setCenter(pos);

    //   $scope.marker = new google.maps.Marker({
    //     position: {lat: lat, lng: lon},
    //     map: $scope.map,
    //     draggable: true,
    //     animation: google.maps.Animation.DROP
    //   });

    //   google.maps.event.addListener($scope.marker, 'dragend', function(dragEvent){
    //       console.log('Lat: ' + dragEvent.latLng.lat().toFixed(6) + ' Lon: ' + dragEvent.latLng.lng().toFixed(6));
    //       $scope.pharmacyLat = dragEvent.latLng.lat().toFixed(6);
    //       $scope.pharmacyLon = dragEvent.latLng.lng().toFixed(6);
    //   });

    //   $scope.marker.setMap($scope.map);

    // });
  //};
});

/**********************************
 *  PharmacyUpdateCtrl
 **********************************/

app.controller('PharmacyUpdateCtrl', function($scope, $state, $ionicPopup, Pharmacy, PharmacyService) {

  var pharmacyForm = {};
  debugger;
  pharmacyForm.name  = farmaciaUpdate.name;
  pharmacyForm.phone = farmaciaUpdate.phone;
  $scope.pharmacy = pharmacyForm;

  $scope.alterPharmacy = function (form) {
    console.log("PharmacyUpdateCtrl::alterPharmacy");

    if(form.$valid) {
      $scope.pharmacy.name = form.name.$viewValue;
      $scope.pharmacy.phone = form.phone.$viewValue;
      console.log($scope.pharmacy);
      PharmacyService.update(farmaciaUpdate.id, $scope.pharmacy);
       var alertPopup = $ionicPopup.alert({
         title: 'Sucesso!',
         template: 'Farmácia alterada com sucesso!'
       });
       alertPopup.then(function(res) {
         $state.go('listPharmacy');
       });
    } else {
      console.log("Invalid form");
    }
  };

  $scope.cancelUpdate = function () {
    $state.go('listPharmacy');
  };

    });
