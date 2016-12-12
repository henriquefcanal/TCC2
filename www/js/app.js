var app = angular.module('minifarma', [
  'ionic',
  'ngMessages',
  'ngCordova',
  'ngMap',
  'ionic-datepicker',
  'ionic-timepicker',
  'minifarma.controllers',
  'minifarma.services',
  'minifarma.database',
  'ngMask'
]);

app.directive('formattedDate', function(dateFilter) {
  return {
    require: 'ngModel',
    scope: {
      format: "="
    },
    link: function(scope, element, attrs, ngModelController) {
      ngModelController.$parsers.push(function(data) {
        return dateFilter(data, scope.format);
      });

      ngModelController.$formatters.push(function(data) {
        return dateFilter(data, scope.format);
      });
    }
  }
  //http://plnkr.co/edit/cLNknnfsPjcNePX3pHsA?p=preview
});

app.run(function($ionicPlatform, DB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    DB.init();

  });

  window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
  }

});

app.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, ionicTimePickerProvider) {

  var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'OK',
    todayLabel: 'Hoje',
    closeLabel: 'Fechar',
    mondayFirst: true,
    weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthsList: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto","Setembro", "Outubro", "Novembro", "Dezembro"],
    templateType: 'popup',
    from: new Date(2010, 1, 1),
    to: new Date(2025, 1, 1),
    showTodayButton: true,
    dateFormat: 'dd MM yyyy',
    closeOnSelect: false
  };

  ionicDatePickerProvider.configDatePicker(datePickerObj);

  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 15,
    setLabel: 'Ok',
    closeLabel: 'Fechar'
  };

  ionicTimePickerProvider.configTimePicker(timePickerObj);

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true, //can't navigate to
    controller: 'TabCtrl',
    templateUrl: function() {
      if (ionic.Platform.isAndroid()) {
        return  "templates/tabs/tab-remedio.html";
      }
      //return  "templates/tabs-android.html";
      return "templates/tabs.html";
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.remedio', {
    url: '/remedios',
    cache: false,
    views: {
      'tab-remedio': {
        templateUrl: 'templates/tabs/tab-remedio.html',
        controller: 'MedicamentListCtrl'
      }
    }
  })

  .state('tab.alerta', {
    url: '/alertas',
    views: {
      'tab-alerta': {
        templateUrl: 'templates/tabs/tab-alerta.html',
        controller: 'AlertListCtrl'
      }
    }
  })

  .state('listMedicament', {
    url: "/listMedicament",
    cache: false,
    controller: 'MedicamentListCtrl',
    templateUrl: "templates/listMedicament.html"
  })

  .state('createMedicament', {
    url: "/createMedicament",
    cache: false,
    controller: 'MedicamentCreateCtrl',
    templateUrl: "templates/createMedicament.html"
  })

    .state('updateMedicament', {
    url: "/updateMedicament",
    cache: false,
    controller: 'MedicamentUpdateCtrl',
    templateUrl: "templates/updateMedicament.html"
  })

  .state('categoryList', {
    url: "/categoryList",
    cache: false,
    controller: 'MedicamentCategoryListCtrl',
    templateUrl: "templates/categoryList.html"
  })

  .state('pharmacysList', {
    url: "/pharmacysList",
    cache: false,
    controller: 'PharmacyMedicamentListCtrl',
    templateUrl: "templates/pharmacysList.html"
  })

  .state('medicamentsList', {
    url: "/medicamentsList",
    cache: false,
    controller: 'MedicamentAlertListCtrl',
    templateUrl: "templates/medicamentsList.html"
  })

  .state('listAlert', {
    url: "/listAlert",
    cache: false,
    controller: 'AlertListCtrl',
    templateUrl: "templates/listAlert.html"
  })

  .state('createAlert', {
    url: "/createAlert",
    cache: false,
    controller: 'AlertCreateCtrl',
    templateUrl: "templates/createAlert.html"
  })

    .state('updateAlert', {
    url: "/updateAlert",
    cache: false,
    controller: 'AlertUpdateCtrl',
    templateUrl: "templates/updateAlert.html"
  })

  .state('listPharmacy', {
    url: "/listPharmacy",
    cache: false,
    controller: 'PharmacyListCtrl',
    templateUrl: "templates/listPharmacy.html"
  })

  .state('createPharmacy', {
    url: "/createPharmacy",
    cache: false,
    controller: 'PharmacyCreateCtrl',
    templateUrl: "templates/createPharmacy.html"
  })

  .state('updatePharmacy', {
    url: "/updatePharmacy",
    cache: false,
    controller: 'PharmacyUpdateCtrl',
    templateUrl: "templates/updatePharmacy.html"
  })

  .state('medicamentPicture', {
      url: "/picture",
      controller: 'MedicamentPicture',
      params: {
        picture: ""
      },
      templateUrl: "templates/showPicture.html"
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab');
  $urlRouterProvider.otherwise('/tab/remedios');

});

// app.config(function($ionicConfigProvider) {
//   $ionicConfigProvider.backButton.text('Voltar').icon('ion-chevron-left');
// });
