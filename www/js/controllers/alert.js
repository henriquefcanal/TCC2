var app = angular.module('minifarma.controllers.alert', []);
var alertUpdate = null;

/**********************************
 *  Factories
 **********************************/

app.factory('Alert', function() {
  var alert = {};
  alert.startDate = null;//aux variable
  alert.startTime= null;//aux variable
  alert.presentCorrectTime = null;//aux variable
  alert.startDateTime = null;
  alert.id_medicament = null;
  alert.id_interval = null;
  alert.durationNumber = null;
  alert.durationUnity = null;
  alert.active = 1;
  return alert;
});

app.factory('Medicament', function() {

  var medicament = {};
  medicament.name = '';
  medicament.id = 0;
  return medicament;
});

/**********************************
 *  AlertListCtrl
 **********************************/
app.controller('AlertListCtrl', function($scope, $state, $ionicPopup, AlertService, MedicamentService, IntervalService) {

  $scope.isAndroid = ionic.Platform.isAndroid();
  $scope.filterValue = 1;
  $scope.intervals = IntervalService.intervals;

  AlertService.all().then(function(alertsResult){
    $scope.alertas = alertsResult;
  });

  $scope.createAlert = function() {
      $state.go('createAlert');
    };

  $scope.updateAlert = function(alerta) {
    alertUpdate = alerta;
      $state.go('updateAlert');
    };

  $scope.backMedicament = function () {
    $state.go('tab.remedio');
  };

  $scope.getMedicamentName = function (alerta) {
    var id_medicament = alerta.id_medicament;
    MedicamentService.getById(id_medicament).then(function(medicament){
      alerta.medicament_name = medicament.name;
    });
  };

  $scope.getMedicamentImage = function (alerta) {
    var id_medicament = alerta.id_medicament;
    MedicamentService.getById(id_medicament).then(function(medicament){
      alerta.medicament_image = medicament.picture_medicament;
    });
  };

  $scope.remove = function(alerta) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Confirmação',
       template: 'Deseja realmente excluir este alerta?',
       cancelText: 'Não',
       okText: 'Sim'
     });
     confirmPopup.then(function(res) {
       if(res) {
        AlertService.remove(alerta);
        $scope.alertas.splice($scope.alertas.indexOf(alerta), 1);
        $state.go('listAlert');
       } else {
         $state.go('listAlert');
         //console.log('You are not sure');
       }
     });
  };

  $scope.defineNextDate = function (alerta) {

    var interval = $scope.intervals[alerta.id_interval];
    var now = new Date();
    var nextDoseDate = new Date(alerta.startDate);

    while(nextDoseDate < now) {
      nextDoseDate = nextDoseDate.setSeconds(3600 * interval);
    };

    alerta.nextDoseDate = dateFormat(nextDoseDate, "dd/mm/yyyy HH:MM");

  };

});

/**********************************
 *  AlertCreateCtrl
 **********************************/
app.controller('AlertCreateCtrl', function($scope, $state, $ionicPopup, ionicDatePicker, ionicTimePicker, Alert, Medicament, AlertService, $cordovaLocalNotification) {

  $scope.alert = Alert;
  $scope.medicament = Medicament;

  var dateSelecter = {
    callback: function (val) {
      $scope.alert.startDate = val;
    }
  };

  var timeSelecter = {
    callback: function (val) {
      var selectedTime = new Date(val * 1000);
      $scope.alert.presentCorrectTime = dateFormat(selectedTime, "HH:MM", true);
      $scope.alert.startTime = val * 1000;
    },
    inputTime: ((new Date()).getHours() * 60 * 60),
    format: 24,
    step: 15,
    setLabel: 'Ok'
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(dateSelecter);
  };

  $scope.openTimePicker = function(){
    ionicTimePicker.openTimePicker(timeSelecter);
  };

  $scope.addAlert = function (form) {

    console.log("AlertCreateCtrl::addAlert");

    if(form.$valid) {
      var d = new Date($scope.alert.startDate + $scope.alert.startTime);
      $scope.alert.startDateTime = d;
      $scope.alert.active = 1;
      $scope.alert.id_medicament = $scope.medicament.id;

      var intervalo = 0;
      debugger;
      switch ($scope.alert.id_interval)
             {
                 case "9":
                     intervalo = 15000;
                     break;
                 case "1":
                     intervalo = 3600000;
                     break;
                 case "2":
                     intervalo = 7200000;
                     break;
                 case "3":
                     intervalo = 10800000;
                     break;
                 case "4":
                     intervalo = 14400000;
                     break;
                 case "5":
                     intervalo = 21600000;
                     break;
                 case "6":
                     intervalo = 28800000;
                     break;
                 case "7":
                     intervalo = 43200000;
                     break;
                 case "8":
                     intervalo = 86400000;
                     break;
             }

      AlertService.insert($scope.alert).then(function () {
        var now = new Date().getTime();
        //var startAlert = new Date(now + ($scope.alert.startDate + $scope.alert.startTime + intervalo));
        var titleMedicament = $scope.medicament.name;
        window.plugin.notification.local.add({
          id:         "meu id teste",
          //date:       startAlert, 
          //date:       new Date(now + d + 15000), 
          date:       new Date(now + intervalo),
          message:    "Hora de tomar o remédio " + titleMedicament + "!",//"Minha mensagem",
          title:      titleMedicament,
          repeat:     'daily',
          json:       "meus dados",  // Data to be passed through the notification
          autoCancel: false, // Setting this flag and the notification is automatically canceled when the user clicks it
          ongoing:    true, // Prevent clearing of notification (Android only)
          sound: '/www/sound/sound.mp3',
        });
      });

      // set wakeup timer
    // window.wakeuptimer.wakeup( successCallback,  
    //    errorCallback, 
    //    // a list of alarms to set
    //    {
    //         alarms : [{
    //             type : 'onetime',
    //             time : { hour : 00, minute : 50 },
    //             extra : { message : 'json containing app-specific information to be posted when alarm triggers' }, 
    //             message : 'Alarm has expired!'
    //        }] 
    //    }
    // );
      var alertPopup = $ionicPopup.alert({
         title: 'Sucesso!',
         template: 'Alerta cadastrado com sucesso!'
       });
       alertPopup.then(function(res) {
         $state.go('listAlert');
         $scope.clearAlert();
       });
    } else {
      console.log("Invalid form");
    }
  };

  $scope.clearAlert = function () {
    Alert.startDate = null;
    Alert.startTime  = null;
    Alert.presentCorrectTime  = null;
    Alert.startDateTime  = null;
    Alert.id_medicament  = null;
    Alert.id_interval  = null;
    Alert.durationNumber  = null;
    Alert.durationUnity  = null;
    Alert.active  = null;
    Medicament.name = null;
  }

  $scope.cancelCreate = function () {
    $scope.clearAlert();
    $state.go('listAlert');
    //$state.go('tab.remedio');
  };  
});

/**********************************
 *  AlertUpdateCtrl
 **********************************/
app.controller('AlertUpdateCtrl', function($scope, $state, $ionicPopup, ionicDatePicker, ionicTimePicker, Alert, Medicament, AlertService, $cordovaLocalNotification) {

  var alertForm = {};
  debugger;
  alertForm.startDate = dateFormat(alertUpdate.startDate, "dd/mm/yyyy");
  alertForm.startTime  = dateFormat(alertUpdate.startDate, "HH:mm");
  alertForm.presentCorrectTime  = dateFormat(alertUpdate.startDate, "HH:mm");
  alertForm.startDateTime  = alertUpdate.startDateTime;
  alertForm.id_medicament  = alertUpdate.id_medicament;
  alertForm.id_interval  = alertUpdate.id_interval;
  alertForm.interval = alertUpdate.id_interval != "undefined" ? alertUpdate.id_interval == 9 ? "10 segundos" : alertUpdate.id_interval == 1 ? "1 hora" : alertUpdate.id_interval == 2 ? "2 horas" : alertUpdate.id_interval == 3 ? "3 horas" : alertUpdate.id_interval == 4 ? "4 horas" : alertUpdate.id_interval == 5 ? "6 horas" : alertUpdate.id_interval == 6 ? "8 horas" : alertUpdate.id_interval == 7 ? "12 horas" : alertUpdate.id_interval == 8 ? "24 horas" : null : null; 
  alertForm.durationNumber  = alertUpdate.duration_number != "undefined" ? alertUpdate.duration_number : null;
  alertForm.durationUnity  = alertUpdate.duration_unity != "undefined" ? alertUpdate.duration_unity : null;
  alertForm.active  = alertUpdate.active;

  $scope.alert = alertForm;

  var alertMedicament = {};

  alertMedicament.id = alertUpdate.id_medicament;
  alertMedicament.picture_medicament = alertUpdate.medicament_image;
  alertMedicament.name = alertUpdate.medicament_name;

  $scope.medicament = alertMedicament;

  var dateSelecter = {
    callback: function (val) {
      $scope.alert.startDate = val;
    }
  };

  var timeSelecter = {
    callback: function (val) {
      var selectedTime = new Date(val * 1000);
      $scope.alert.presentCorrectTime = dateFormat(selectedTime, "HH:MM", true);
      $scope.alert.startTime = val * 1000;
    },
    inputTime: ((new Date()).getHours() * 60 * 60),
    format: 24,
    step: 15,
    setLabel: 'Ok'
  };

  var aux = 0;

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(dateSelecter);
    aux = aux + 1;
  };

  $scope.openTimePicker = function(){
    ionicTimePicker.openTimePicker(timeSelecter);
    aux = aux + 2;
  };

  $scope.alterAlert = function (form) {

    console.log("AlertUpdateCtrl::alterAlert");

    if(form.$valid) {
      debugger;
      if(aux == 0)
      {
        var myDate = $scope.alert.startDate.split("/");
        var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
        var data = new Date(newDate).getTime();
        var myHour = $scope.alert.startTime.split(':');
        var hora = (+myHour[0]) * 60 * 60 + (+myHour[1]) * 60;
        var d = new Date( data + (hora * 1000));
      }else if (aux == 1)
      {
        var myHour = $scope.alert.startTime.split(':');
        var hora = (+myHour[0]) * 60 * 60 + (+myHour[1]) * 60;
        var d = new Date( $scope.alert.startDate + (hora * 1000));
      }else if(aux == 2)
      {
        var myDate = $scope.alert.startDate.split("/");
        var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
        var data = new Date(newDate).getTime();
        var d = new Date(data + $scope.alert.startTime);
      }else if(aux == 3)
      {
        var d = new Date($scope.alert.startDate + $scope.alert.startTime);
      }
      $scope.alert.startDateTime = d;
      $scope.alert.active = 1;
      $scope.alert.id_medicament = $scope.medicament.id;

      var intervalo = 0;
      debugger;
      switch ($scope.alert.id_interval)
             {
                 case 9:
                     intervalo = 15000;
                     break;
                 case 1:
                     intervalo = 3600000;
                     break;
                 case 2:
                     intervalo = 7200000;
                     break;
                 case 3:
                     intervalo = 10800000;
                     break;
                 case 4:
                     intervalo = 14400000;
                     break;
                 case 5:
                     intervalo = 21600000;
                     break;
                 case 6:
                     intervalo = 28800000;
                     break;
                 case 7:
                     intervalo = 43200000;
                     break;
                 case 8:
                     intervalo = 86400000;
                     break;
             }

      AlertService.update(alertUpdate.id, $scope.alert).then(function () {
        var now = new Date().getTime();
        var titleMedicament = $scope.medicament.name;
        window.plugin.notification.local.add({
          id:         "meu id teste",
          //date:       startAlert, 
          //date:       new Date(now + d + 15000), 
          date:       new Date(now + intervalo),
          message:    "Hora de tomar o remédio " + titleMedicament + "!",//"Minha mensagem",
          title:      titleMedicament,
          repeat:     'daily',
          json:       "meus dados",  // Data to be passed through the notification
          autoCancel: false, // Setting this flag and the notification is automatically canceled when the user clicks it
          ongoing:    true, // Prevent clearing of notification (Android only)
          sound: '/www/sound/sound.mp3',
        });
      });

      var alertPopup = $ionicPopup.alert({
         title: 'Sucesso!',
         template: 'Alerta alterado com sucesso!'
       });
       alertPopup.then(function(res) {
         $state.go('listAlert');
       });
    } else {
      console.log("Invalid form");
    }
  };

  $scope.clearAlert = function () {
    Alert.startDate = null;
    Alert.startTime  = null;
    Alert.presentCorrectTime  = null;
    Alert.startDateTime  = null;
    Alert.id_medicament  = null;
    Alert.id_interval  = null;
    Alert.durationNumber  = null;
    Alert.durationUnity  = null;
    Alert.active  = null;
  }

  $scope.cancelUpdate = function () {
    $scope.clearAlert();
    $state.go('listAlert');
    //$state.go('tab.remedio');
  };  
});

/**********************************
 *  MedicamentAlertListCtrl
 **********************************/
app.controller('MedicamentAlertListCtrl', function($scope, $ionicHistory, Medicament, MedicamentService, $ionicConfig) {

  //$ionicConfig.backButton.text("Alerta");

  MedicamentService.all().then(function(remediosResult){
    debugger;
    $scope.medicaments = remediosResult
  });
  $scope.selectedMedicament = Medicament;
  $scope.shouldShowDelete = false;

  $scope.select = function(medicamentName, medicamentId) {
    $scope.selectedMedicament.name = medicamentName;
    $scope.selectedMedicament.id = medicamentId;
    $ionicHistory.goBack();
  };

});
