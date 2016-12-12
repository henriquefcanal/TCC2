var app = angular.module('minifarma.controllers.medicament', []);
var medicamentUpdate = null;

/**********************************
 *  Factories
 **********************************/

app.factory('Medicament', function() {
  var medicament = {};
  medicament.name  = null;
  medicament.expiration_date  = null;
  medicament.quantity  = null;
  medicament.unit  = null;
  medicament.price  = null;
  medicament.dose  = null;
  medicament.picture_medicament  = null;
  medicament.picture_prescription  = null;
  medicament.expired  = null;
  medicament.id_pharmacy  = null;
  medicament.id_category  = null;
  medicament.id_place  = null;
  medicament.id_interval  = null;
  medicament.notes  = null;

  return medicament;
});

app.factory('Pharmacy', function() {

  var pharmacy = {};
  pharmacy.name = '';
  pharmacy.phone = '';
  pharmacy.id = 0;
  return pharmacy;
});

app.factory('Category', function() {
  var category = {};
  category.name = '';
  return category;
});

/**********************************
 *  MedicamentListCtrl
 **********************************/
app.controller('MedicamentListCtrl', function($scope, $state, $ionicPopup, MedicamentService) {

  console.log("MedicamentListCtrl");

  $scope.isAndroid = ionic.Platform.isAndroid();

  MedicamentService.all().then(function(remediosResult) {
    $scope.remedios = remediosResult
  });

  $scope.createMedicament = function() {
      $state.go('createMedicament');
    };


  $scope.updateMedicament = function(remedio) {
    medicamentUpdate = remedio;
      $state.go('updateMedicament');
    };

    $scope.backMedicament = function () {
    $state.go('tab.remedio');
  };

  $scope.remove = function(remedio) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Confirmação',
       template: 'Deseja realmente excluir este remédio?',
       cancelText: 'Não',
       okText: 'Sim'
     });
     confirmPopup.then(function(res) {
       if(res) {
        MedicamentService.remove(remedio);
        $scope.remedios.splice($scope.remedios.indexOf(remedio), 1);
        $state.go('listMedicament');
       } else {
         $state.go('listMedicament');
         //console.log('You are not sure');
       }
     });
  };

  // $scope.alterMedicament = function (remedio) {
  //   Medicament.name = remedio.name;
  //   Medicament.expiration_date  = remedio.expiration_date;
  //   Medicament.quantity  = remedio.quantity;
  //   Medicament.unit  = remedio.unit;
  //   Medicament.price  = remedio.price;
  //   Medicament.dose  = remedio.dose;
  //   Medicament.picture_medicament  = remedio.picture_medicament;
  //   Medicament.picture_prescription  = remedio.picture_prescription;
  //   Medicament.expired  = remedio.expired;
  //   Medicament.id_pharmacy  = remedio.id_pharmacy;
  //   Medicament.id_category  = remedio.id_category;
  //   Medicament.id_place  = remedio.id_place;
  //   Medicament.id_interval  = remedio.id_interval;
  //   Medicament.notes  = remedio.notes;
  //   Medicament.doseTypeString  = remedio.doseTypeString;
  //   Medicament.place  = remedio.place;
  //   //Category.name = remedio.Category.name;
  // };

  $scope.filterValue = 0;
});

/**********************************
 *  MedicamentCategoryListCtrl
 **********************************/
app.controller('MedicamentCategoryListCtrl', function($scope,
                                                      $ionicHistory,
                                                      Category) {
  $scope.selectedCategory =  Category;
  $scope.shouldShowDelete = false;

  MedicamentService.categories().then(function(categoriesResult) {
    $scope.categories = categoriesResult
  });

  $scope.select = function(categoryName) {
    $scope.selectedCategory.name = categoryName;
    $ionicHistory.goBack();
  };

});

/**********************************
 *  medicament Prescription Picture
 **********************************/
app.controller('MedicamentPicture', function($scope,
                                             $ionicHistory,
                                             $stateParams) {
  console.log("MedicamentPicture");
  $scope.picture = $stateParams.picture;


});

/**********************************
 *  MedicamentCreateCtrl
 **********************************/
app.controller('MedicamentCreateCtrl', function($scope,
                                                $state,
                                                $cordovaCamera,
                                                $ionicActionSheet,
                                                $cordovaSQLite,
                                                $ionicPopup,
                                                MedicamentService,
                                                Medicament,
                                                Pharmacy,
                                                Category,
                                                ionicDatePicker) {

  $scope.medicament = Medicament;
  $scope.category =  Category;
  $scope.pharmacy =  Pharmacy;

  $scope.groups = [];
  $scope.groups[0] = {
    name: "Quantidade"
  };
  $scope.groups[1] = {
    name: "Dose"
  };
  $scope.groups[2] = {
    name: "Place"
  };

  $scope.shownGroup = null;

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  /** ADD MEDICAMENT **/
  $scope.addMedicament = function (form) {
    debugger;
    console.log("MedicamentCreateCtrl::addMedicament");
    console.log($scope.medicament.id_interval);


    if(form.$valid) {

       $scope.medicament.dose  = form.dose.$viewValue;
       $scope.medicament.id_pharmacy = $scope.pharmacy.id;
       // $scope.medicament.id_pharmacy  = null;//MESMA COISA QUE O INTERVALO
       // $scope.medicament.id_category  = null;//MESMA COISA QUE O INTERVALO
       // $scope.medicament.id_place  = null; //TEM QUE SALVAR UM LUGAR NOVO QUANDO APERTAR NO BOTAO DE MAIS E DEPOIS SUBSTITUIR O CAMPO PARA EM VEZ DE SER UM SELECT COM OPTIONS SETADAS PEGAR DO BANCO
       //$scope.medicament.notes  = form.notes.$viewValue;

      console.log($scope.medicament);

      //  MedicamentService.insert($scope.medicament).then(function () {
      //   var now = new Date().getTime();
      //   var titleMedicament = $scope.medicament.name;
      //   var expiration_date = $scope.medicament.expiration_date;
      //   window.plugin.notification.local.add({
      //     id:         "meu id teste",
      //     date:       new Date(now + 15000), //expiration_date
      //     message:    "O remédio " + titleMedicament + " venceu!",//"Minha mensagem",
      //     title:      titleMedicament,
      //     repeat:     'daily',
      //     json:       "meus dados",  // Data to be passed through the notification
      //     autoCancel: false, // Setting this flag and the notification is automatically canceled when the user clicks it
      //     ongoing:    true, // Prevent clearing of notification (Android only)
      //     sound: '/www/sound/sound.mp3',
      //   });
      // });
      if($scope.medicament.picture_medicament == null || $scope.medicament.picture_medicament == "")
      {
        $scope.medicament.picture_medicament = "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"
      }
      MedicamentService.insert($scope.medicament);
      $scope.clearMedicament();
      
       var alertPopup = $ionicPopup.alert({
          title: 'Sucesso!',
          template: 'Remédio cadastrado com sucesso!'
        });
       alertPopup.then(function(res) {
         $state.go('listMedicament');
       });
    } else {
      console.log("Invalid form");
    }
  };

  /** CLEAR MEDICAMENT DATA **/
  $scope.clearMedicament = function () {
    Medicament.name = null;
    Medicament.expiration_date  = null;
    Medicament.quantity  = null;
    Medicament.unit  = null;
    Medicament.price  = null;
    Medicament.dose  = null;
    Medicament.picture_medicament  = null;
    Medicament.picture_prescription  = null;
    Medicament.expired  = null;
    Medicament.id_pharmacy  = null;
    Medicament.id_category  = null;
    Medicament.id_place  = null;
    Medicament.id_interval  = null;
    Medicament.notes  = null;
    //Medicament.doseTypeString  = null;
    Medicament.place  = null;
    Category.name = '';
  };

  /** DATE PICKER **/
  var dateSelecter = {
    callback: function (val) {
      var today = new Date();
      $scope.medicament.expiration_date = new Date(val);
      if($scope.medicament.expiration_date <= today){
        $scope.medicament.expired = 1; //FORA DA DATA DE VALIDADE
      }else{
        $scope.medicament.expired = 0; //DENTRO DA DATA DE VALIDADE
      }
      console.log('Return value from the datepicker popup is : ' + $scope.medicament.expiration_date );
    }
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(dateSelecter);
  };

  /** MEDICAMENT PICTURE **/
  $scope.addMedicamentPicture = function () {
    $scope.pictureType = "medicament";
    $scope.addPicture();
  };

  /** PRESCRIPTION PICTURE **/
  $scope.addPrescriptionPicture = function () {
    $scope.pictureType = "prescription";
    $scope.addPicture();
  };

  /** ADD A PICTURE **/
  $scope.addPicture = function () {
    console.log("Let's add a picture!");

    var buttons = [];
    if($scope.pictureType == "prescription" && $scope.medicament.picture_prescription != null) {
      buttons = [
        { text: 'Tirar uma foto' },
        { text: 'Escolher uma foto da galeria' },
        { text: 'Visualizar foto' }
      ]
    } else {
      buttons = [
        { text: 'Tirar uma foto' },
        { text: 'Escolher da galeria' },
      ]
    }

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      destructiveText: 'Remover a foto cadastrada',
      titleText: 'O que deseja fazer?',
      cancelText: 'Cancelar',
      cancel: function() {
        // nothing to do.
      },
      buttonClicked: function(index) {
        console.log(index);
        if (index == 0) {
          $scope.doGetFromCamera();
        } else if (index == 1) {
          $scope.doGetFromGallery();
        } else if (index == 2) {
          $state.go('medicamentPicture', {picture: $scope.medicament.picture_prescription});
        }
        return true;
      },
      destructiveButtonClicked:  function() {
        console.log("Remover imagem do remédio");
      }
    });
  };

  $scope.doGetFromGallery = function () {
    console.log("Let's add a picture from GALLERY!");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      if ($scope.pictureType == "medicament") {
        $scope.medicament.picture_medicament = imageData;
      } else {
        $scope.medicament.picture_prescription = imageData;
      }
    }, function (err) {
      console.error(err);
      $ionicPopup.alert({
        title:'Erro ao obter imagem',
        subTitle: 'Ocorreu um erro ao obter a imagem, por favor tente novamente.'
      });
    });

  };

  $scope.doGetFromCamera = function () {
    console.log("Let's add a picture from CAMERA!");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA, // CAMERA
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      if ($scope.pictureType == "medicament") {
        $scope.medicament.picture_medicament = imageData;
      } else {
        $scope.medicament.picture_prescription = imageData;
      }
    }, function (err) {
      console.error(err);
      $ionicPopup.alert({
        title:'Error getting picture',
        subTitle: 'We had a problem trying to get that picture, please try again'
      });
    });

  };

    /** CLEAR MEDICAMENT DATA **/
  $scope.clearMedicament = function () {
    Medicament.name = null;
    Medicament.expiration_date  = null;
    Medicament.quantity  = null;
    Medicament.unit  = null;
    Medicament.price  = null;
    Medicament.dose  = null;
    Medicament.picture_medicament  = null;
    Medicament.picture_prescription  = null;
    Medicament.expired  = null;
    Medicament.id_pharmacy  = null;
    Medicament.id_category  = null;
    Medicament.id_place  = null;
    Medicament.id_interval  = null;
    Medicament.notes  = null;
    Medicament.doseTypeString  = null;
    Medicament.place  = null;
    Category.name = '';
    Pharmacy.name = null;
  };

  /** CANCEL AND GO BACK **/
  $scope.cancelCreate = function () {
    $scope.clearMedicament();
    $state.go('listMedicament');
    //$state.go('tab.remedio');
  };

});

/**********************************
 *  MedicamentUpdateCtrl
 **********************************/
app.controller('MedicamentUpdateCtrl', function($scope,
                                                $state,
                                                $cordovaCamera,
                                                $ionicActionSheet,
                                                $cordovaSQLite,
                                                $ionicPopup,
                                                MedicamentService,
                                                PharmacyService,
                                                Medicament,
                                                Pharmacy,
                                                Category,
                                                ionicDatePicker) {
  $scope.pharmacy = null;
  var medicamentForm = {};
  medicamentForm.name  = medicamentUpdate.name;
  medicamentForm.expiration_date  = medicamentUpdate.expiration_date != "undefined" ? dateFormat(medicamentUpdate.expiration_date, "dd/mm/yyyy") : null; 
  medicamentForm.quantity  = medicamentUpdate.quantity != "undefined" ? medicamentUpdate.quantity : null;
  medicamentForm.unit  = medicamentUpdate.unit != "undefined" ? medicamentUpdate.unit : null;
  medicamentForm.price  = medicamentUpdate.price != "undefined" ? medicamentUpdate.price : null;
  medicamentForm.dose  = medicamentUpdate.dose != "undefined" ? medicamentUpdate.dose : null;
  medicamentForm.picture_medicament  = medicamentUpdate.picture_medicament != "undefined" ? medicamentUpdate.picture_medicament : null;
  medicamentForm.picture_prescription  = medicamentUpdate.picture_prescription != "undefined" ? medicamentUpdate.picture_prescription : null;
  medicamentForm.expired  = medicamentUpdate.expired != "undefined" ? medicamentUpdate.expired : null
  medicamentForm.id_pharmacy  = medicamentUpdate.id_pharmacy != "undefined" ? medicamentUpdate.id_pharmacy : null;
  medicamentForm.id_category  = medicamentUpdate.id_category != "undefined" ? medicamentUpdate.id_category : null;
  medicamentForm.id_place  = medicamentUpdate.id_place != "undefined" ? medicamentUpdate.id_place : null;
  medicamentForm.id_interval  = medicamentUpdate.id_interval != "undefined" ? medicamentUpdate.id_interval : null;
  medicamentForm.notes  = medicamentUpdate.notes != "undefined" ? medicamentUpdate.notes : null;
  medicamentForm.doseTypeString = medicamentUpdate.unit != "undefined" ? medicamentUpdate.unit == 0 ? "pilúlas" : "ml" : null;
  //medicamentForm.name_pharmacy = medicamentUpdate.id_pharmacy != "undefined" ? PharmacyService.getById(medicamentUpdate.id_pharmacy).value : null;

  $scope.medicament = medicamentForm;
  $scope.pharmacy = Pharmacy;


  $scope.getPharmacyName = function (remedio) {
    debugger;
    if($scope.pharmacy.name == null || $scope.pharmacy.name == "")
    {
      var id_pharmacy = remedio.id_pharmacy;
      PharmacyService.getById(id_pharmacy).then(function(pharmacy){
        remedio.pharmacy_name = pharmacy.name;
        $scope.pharmacy.name = pharmacy.name;
      });
    }else
    {
      remedio.pharmacy_name = $scope.pharmacy.name;
      $scope.medicament.id_pharmacy = $scope.pharmacy.id;
    }
  };
  //$scope.pharmacy.name = "teste";
  //getPharmacyName(medicamentForm);
  //$scope.pharmacy = PharmacyService.getById(medicamentForm.id_pharmacy);
  // PharmacyService.getById(medicamentForm.id_pharmacy).then(function(pharmacy){
  //     medicamentForm.namePharmacy = pharmacy.name;
  //   });
  // $scope.pharmacy.id = medicamentForm.id_pharmacy;
  // $scope.pharmacy.name = medicamentForm.namePharmacy;
  //$scope.category =  Category;


  $scope.groups = [];
  $scope.groups[0] = {
    name: "Quantidade"
  };
  $scope.groups[1] = {
    name: "Dose"
  };
  $scope.groups[2] = {
    name: "Place"
  };

  $scope.shownGroup = null;

  // $scope.getPharmacyName = function (medicament) {
  //   //var id_pharmacy = medicament.id_pharmacy;
  //   PharmacyService.getById(medicament.id_pharmacy).then(function(pharmacy){
  //     $scope.pharmacy.name = pharmacy.name;
  //   });
  // };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  /** ALTER MEDICAMENT **/
  $scope.alterMedicament = function (form) {
    debugger;
    console.log("MedicamentUpdateCtrl::alterMedicament");
    console.log($scope.medicament.id_interval);


    if(form.$valid) {

       //$scope.medicament.dose  = form.dose.$viewValue;

      console.log($scope.medicament);

      if($scope.medicament.picture_medicament == null || $scope.medicament.picture_medicament == "")
      {
        $scope.medicament.picture_medicament = "/9j/4AAQSkZJRgABAQEAYABgAAD/4QBYRXhpZgAATU0AKgAAAAgABAExAAIAAAARAAAAPlEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAABBZG9iZSBJbWFnZVJlYWR5AAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCACAAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACis/xZ4s03wL4cvNY1i+t9N0zT4zLcXM77I4lHcn8gB1JIA5NfLd18YviR+3fqVxpvw1Nz4F+G8cjW954ouUK3mogHDC2XIK9P4SCP4nQnZXtZTkdbGqVZtU6UPinLSK8u8pPpGKbfa2p5+OzKnh2qaTlOW0Vu/Psl3bsketfHn9tfwB+z5M1nquqNqGuEhY9I0xftN4zHopUHahP+2QTnjNebR/GT9ob4/fN4P8E6T8OdFmwY9Q8RuZLtl/vCLbkeuDER0+avT/gB+xt4F/Z1gWbR9LF7rbcz6xf4nvZWP3iHIwgPogAPfJ5r1SvSlmWU4H3MBQ9tL+ert/27TTsl/icn5I41g8difexNX2a/lhv85tXf/bqifMKfsK+P/HieZ44+OPjC8MnL2ujj7DAPybaf+/YqZf8AglR8N7gbr/VPG2qSfxSXWrBmY/8AAYxX0xRUPjTOVpSrezXaEYwX3RSK/wBXcv8At0+Z95Nyf/kzZ8zv/wAEp/hvAN1jqnjbS5B92S11YBlP/AozUL/sKePvAieZ4H+OHjCzMfMdrrA+3QH65baP+/Zr6eooXGmcvSrW9ou04xmvukmH+ruXr4KfK+8W4v8A8laPlyT4xftD/AL5vF3grSfiNosOTJqHh1zHdqo/iMW3J9cCIDr81ek/Ab9tjwB+0HMtlpeqNpuuglX0jU1FteKw6qqk7XI5+4SRjkCvWq8r/aA/Y48C/tF27Taxpa2etKMwaxYYgvYWH3SXA+cD0cEDtg81ccyynHe7j6HsZP7dLb/t6m3ZrvyuL8mQ8HjsN72Fq+0X8s9/lNK6/wC3lI9Uor421/8AaD+JH/BPKSLS/H+34jeD7sPFoerpcLDqAdVyIpg2Se2SdxAOQ7Y2V5JN/wAFkviA3iLz4/DvhNdM3f8AHo0c7Sbf+uvmD5vfbj2r1MH4a5vjU6uA5KlLeM1JJS8kn7ya2aaVmcWI4wwGHfJiuaE+sWndfdo12abuj9JKK8p/ZL/az0L9rLwJNqWmxPp+qaeyxalpskgd7RmBKkNgbo2w21sDO1hgEGvVq+Kx2BxGCxEsLiouM4uzT6f1umtGtUfR4XFUsRSjWoy5oy2YVn+LPFmm+BfDV9rGsXkOn6ZpsLT3NxKcLEijJPr9AOScAZNaFfJfxlvLr9u39pJvhnptxNF8OfAky3Piu7gYr/aF0CQtqGHowZe2GWRuTGme/I8pWNrN1pclKmuapLtFdu8m7Riura6XObMsc8NTXs1zTk7RXd+fklq30SKvhTwtrn/BSXxxH4l8SR32j/BnRrk/2Po5YxS+IJEJUzS4P3c5BIPy8ohzvevrXR9HtPD2lW9jYWtvZWVnGsUEEEYjjhQDAVVHAAHYUaPo9r4e0i10+xt4bOxsYlgt4IUCRwxqAqqoHAAAAAHpVmqzrOpY2UaVKPJRhpCC2iu77ye8pPVvyslOX5esOnOb5qktZSe7fZdorounqFFFFeGekFFFFABRRRQAUUUUAfnl/wAFo4dQHxM8EySeZ/ZbaZOtvn7vnCUebj32mHP4V8WV+0X7Rv7Ofh39pv4eSeH/ABBHIoV/Os7uHAnsZgCA6E8HgkFTwQfXBHxlN/wRc8SDXzHH420Q6Xu4nazlFxt/65Z259t9f0d4f+IOT4bJ6eBx1T2U6d1qm1JXburJ666re+qPyPirhXMK2PlicNHnjO3VXTslZ3a7aGP/AMEbINRb9oHxFJD5n9mJoLLdH+DzDPF5QP8AtcSY9g1fpHXxv+z1oT/8E9P2j1+HuqypeeD/AIjeXLo2tyQrHL9tRQhglI9WbaByAZIyMb3x9kV+Y+JWMWNzf6/SX7qpCLhJfaSVm32ad009Vax9lwfh3h8B9Vn8cJNSXZ7/AHNWaezueT/tq/Hlv2ef2f8AVtYs2/4nl8RpukIBlmupQQrAYOSih3x32Y70/wDY0/Z/T9nT4FaXo867tcvh/aGszE7mlu5ACwJ7hBhAe+zPUmvMfjRH/wAL9/4KF+BfB5/faL8O7FvEmox/wm4Yr5QYdDg/Zzz2dxX1HXl5lL6jlNDAw0lW/ez9NVTj6JXnb+8ux3YNfWcdVxMtqfuR9dHN/N2j/wBuhRRRXyZ7gUUV5X+1l+1hoP7KPgH+0tSH27Vr7dHpmmI+2S8kGMknnbGuRubBxkAAkgHrwOBxGNxEcLhYuU5OyS/r73slqzDFYqlh6Uq1Z8sY6ts9O1LU7fRrGW6vLiG1tYF3STTOI44x6ljwB9a8j8Wf8FAPg94MuXhuvHOlzyRnBFjHLern/ehRl/WvzG+P/wC1P40/aT16S68SatK9mHLW+mwEx2VoOwSPPJ/2myx7mvOq/eMn8FKXs1PNK75n9mFkl/29JO/3I/Mcw8Rp87jgqat3lfX5Jq33s/X3wn/wUB+DvjO5SG18c6XBJIcAXsctkuf96ZFX9a9c03U7bWbCK6s7iC7tZ13RzQyCSOQeoYcEfSvwmr0T4A/tS+NP2bdeS78N6tNHaFw9xp05MlldjuHjzjP+0uGHYijOPBSl7Nyyuu+ZfZnZp/8Ab0Urfcwy/wARp86jjaat3jfT5Nu/3o/ZyivKf2TP2stB/av8BHUtOH2HVrHbHqemO+6Szc5wQeN0bYO1sDOCCAQRXq1fg+OwOIwWIlhcVFxnF2af9fc9mtUfpuFxVLEUo1qMuaMtmFFFFch0Hlf7ZH7P8f7RnwK1TRYVC61Zj7fo8wO1oruMEoA3YOMoT2D56gVD+xP8eZP2hP2f9K1a9Y/25p5OmaujDay3UQAZiMDBdSj4xxvI7V61Xy58HI/+FBf8FEPG/hFf3Oi/EiwXxJp8fYXKljKB2GT9oJx2RPavrMtl9eymvgJayo/vYemiqR9GrTt3i+54eMX1bHUsVHap7kvXVwfyd4/9vEv7Dijx5+0R8c/G0n7w3OvLotrIe0VvuX9VEP8A3yK+nq+Zv+CVSCf9nvXNQbHnap4ovbmRu7ErEv8ASvpmo40ds4q0ltT5YL0hFRX5FcO65fTn1leT9ZNv9Qooor5Y9oh1HUYNI0+4u7qVILa1jaWWRzhY0UZZj7AAmvxq/ao+P99+0p8adW8S3TSLZu5t9Nt3P/HpaIT5aY7E5LNjqzse9fp3+334ql8Hfse+O7uFzHJNYCyyD2nlSBv/AB2Q1+P9f0F4KZPT9lXzSSvK/JHySSlL77r7vM/K/EbMJ89LBReluZ+etl91n94UUUV+9H5eFFFFAHon7LXx+v8A9mz40aT4mtGka1jcQalbqf8Aj7tHI8xMdzgBlzwGVT2r9ltM1K31nTbe8tZUuLW6jWaGVDlZEYAqw9iCDX4S1+vv/BP7xXJ4y/Y88C3U0hkkgsWsST2EErwqPwWNa/BvGvJ6fsqGaRVpX5Jeaaco/dZ/efp/hzmE+ergpbW5l5apP77r7j2Oiiiv58P1UK+Yf26FHgP9oD4G+OI/3ZtPEB0a6kHeG42jH4L53/fRr6er5n/4Krp5H7Omk36/63S/E1ldRt3UhZV/9mr6ngvXOaNJ7VOaD9JxcX+Z4vEWmX1JreNpL1i1L9A/4JVv9n/Z81zTzjzdL8UXttIvdSFiP9a+mK+Yf2HWHgL9ov45+CJP3Zt9eXWrWM94rjc36KYf++hX09RxprnFWqtqnLNek4xkvzDh3TL4Q6xvF+sW4/oFFFFfLHtHj/7fXhWXxl+x947tIUMkkNgL0ADnEEqTt/47Ga/H+v3a1DT4dWsJ7W5iSa3uY2iljcZWRGGCCPQgkV+Nf7Vf7P19+zV8adW8N3SSNZK5uNMuGH/H1aMT5b57kYKtjoysK/oLwUzimqdfK5u0r88fNWUZfdZff5H5X4jZfPnpY2K0tyvy1uvvuzzmiiiv3o/LwooooAK/X79gDwpJ4N/Y88C2s0flyT2LXxB7ieV51P8A3zItfmN+yv8AAC+/aU+NOk+GrVJFs3cXGpXCD/j0tFI8x89ichVz1ZlHev2V03ToNH063tLWJILW1jWGGNBhY0UAKo9gABX4N415xT9lQyuDvK/PLySTjH77v7j9P8Ocvnz1cbJaW5V56pv7rImooor+fD9VCvmf/gqvJ5/7OmkWA/1mqeJrK1jXuxKyt/7LX0xXzD+3Ow8eftBfA3wPH+8N1r51m6jHaG32n9V87/vk19TwXpnNGq9qfNN+kIuT/I8XiLXL6kOsrRXrJqP6kXxrk/4UF/wUJ8C+Mj+50X4h2LeGtSf+EXAK+UWPQZP2cc9o3r6jryj9tP4Ct+0P+z/q2jWi/wDE6s8alpDg4ZbqIEqAcjG9S8ee2/Pal/Yy/aAX9or4FaZq1w23XdP/AOJfrMJG14ruMAMSvGA4w4HbdjqDV5lH69lNDHQ+Kj+6n6aunL0avC/91dycG/q2Pq4aW1T34+uimvvtL/t5nq1FFFfJnuBXln7V/wCyhoP7V3gEaXqh+xapY7pNM1ONN0llIQMgjjdG2BuTIzgEEEAj1OiuvA47EYPERxWFk4zi7prp/XVbNaMwxOGpYilKjWjzRlo0z8Zv2gf2U/Gv7NmuSW3iPSZRY7ylvqdupksrodismOCf7rYYelecV+7Woadb6vZSW11bw3VvMu2SKVA6SD0IPBH1rybxX+wP8H/Gd3JPeeBdIikkJJNm0lkMn/ZhZR+lfu+T+NdNU1DNKD5l9qFrP/t1tW+9n5lmHhzPncsFVVu0r6fNXv8Acfj9Xo37P/7KvjT9pPXY7Xw3pMrWe8LcancKY7K1HctJjkj+6uWPpX6deFP2Bvg/4Nukns/AukyyRkEG9aS8Gf8AdmZh+letadptvpFjFa2lvDa20K7Y4oUCRxj0CjgD6UZx4103TcMroPmf2p2sv+3Yt3+9Bl/hzPnUsbVVu0b6/NpW+48x/ZO/ZP0H9lHwCdN00/btWvtsmp6m6bZLyQZwAOdsa5O1MnGSSSSSfVKKK/CMdjsRjcRLFYqTlOTu2+v9bJbJaI/TcLhaWHpRo0Y8sY6JBRRRXIbhXy58GZP+F+/8FDfHHjAfvtF+HNgvhvTpOxuWLeaVPQ4P2gHHZ0r079sr9oBP2dPgVqmsQtu1y+H9n6NCBuaW7kBCEL3CDLkdwmOpFM/Yp+Arfs8/s/6To94v/E8vydS1dydzNdSgFlJyclFCJnvsz3r6zLY/Ucpr4+fxVv3UPTR1JeiVoX7yfY8PGP6zjqWGjtT9+XrqoL5u8v8At1HrFfJfxpsrr9hX9pFvifpdvNN8O/HMy23iy0gUt9guSTtuwo9WJbvlmkXIMiY+tKz/ABX4V07xx4bvtH1azh1DTdShaC5t5RlJUYYIP+I5B5HNebkebLBVmq0eelUXLOP80X27STtKL6NLpc7MywLxNNezfLOLvF9n5+TWjXVMm0XWrTxHo9rqGn3EN5Y30Kz288Lho5o2AZWUjggggg1ar5B8MeJdc/4JseNl8O+InvtZ+C+s3J/sjV9plm8OyOSxhlAGduckgD5uXQbt6V9aaLrdn4k0i21DT7q3vrG8jEsFxBIJI5kIyGVhwQfUVWdZLLBSjVpS56E9YTWzXZ9pLaUXqn5WbnL8wWIThNctSPxR6p913i+j6+paooorwz0gooooAKKKKACiiigAqtrOs2vh7SLrUL64hs7Gxiae4nmcJHDGoLMzE8AAAkk0ms61Z+HNJuL/AFC6t7Gxs4zLPcTyCOOFAMlmY8AD1NfJfinxRrn/AAUl8cP4b8NyX2jfBnR7kf2xrAUxS+IZEIYQxBh93OCAR8vDuM7Er3MlyWWNlKrVlyUIazm9kuy7ye0YrVvyu15uYZgsOlCC5qktIx6t932iur6epa+DVndft2ftJL8TNSt5ovhz4Fma28KWk6lf7QugQWuip9GCt2wyxryY3z9aVn+E/Cmm+BfDVjo+j2cOn6ZpsKwW1vEMLEijAA/qTyTknJrQqc8zZY2slRjyUqa5YR/liu/eTd5SfVt9LDy3AvDU37R805O8n3fl5LZLokFFFFeKeiZ/irwrpvjjw7eaTrFjb6lpuoRmK4tp0DxyqexH6g9QQCOa+W734L/Ej9hXVLjVPhj9p8cfDqSRri88K3Mha8sMnLG2bBLf8BBY/wASORur60or2sqzytglKi0qlKfxQlrGXn3Ul0lFprvbQ8/HZbTxLVS7jOO0luv813TumeU/AD9s3wL+0REtvpepf2fry/LPo2oYgvYmH3gFJxJg90Jx3weK9Wryf48/sWeAP2hZGu9Y0k2OtjBj1fTWFteIw6EsBh8dt4bHbFeax/BT9oT4BHHg3xzpfxC0WHAj03xIhS6C/wB0S5ycDjmVR/s16UstynHe9ga/sZfyVdv+3aiVmu3Oo+rONYzH4b3cTS9ov5ob/ODd/wDwFv0PqKivmFf24/iL4Dj8vxt8DfFluYziS60V/t0J/JSo/wC/hqVP+Cqvw9t1C6hofjvS5v4o7nSVBU/hIah8F5w9aVL2i7wlGa++LZX+sWXr+JU5X2knF/ikfTNFfMz/APBVX4e3A26fonjvVJf4Y7bSVJY/jIKib9uP4iePI/L8E/A3xbcGQ4jutZb7DCPzUKf+/goXBecLWrR9mu85Rgvvk0H+sWXv4J8z7RTk/wAEz6eryn4//tmeBf2domt9W1IX+uNhYNG0/E97Kx+6CoOEBPdyM9snivM5Pgt+0J8fePGXjjS/h5os2RJp3htC90V/umXORnpkSsOvy16V8Bv2K/AH7Pci3mk6Ub/XDzJq+pMLm8dj1IYjCZ77Aue+auOW5Tgfex1f20v5KW3/AG9Uasl35VL1RLxmPxPu4an7NfzT3+UE7/8AgTj6Hkdn8GviR+3ZqdvqXxMFz4G+HMci3Fn4VtpCt5qGDlTctgFf+BAEfwohO+vqTwp4U03wN4cs9I0ext9N0zT4xFb20CbI4lHYD8yT1JJJ5NaFFebm2eVsao0UlTpQ+GEdIx8+8pPrKTbfe2h14HLaeGbqXcpy3k935eS7JWSCiiivFPRP/9k="
      }
      if ($scope.medicament.expiration_date == dateFormat(medicamentUpdate.expiration_date, "dd/mm/yyyy")) 
      {
        $scope.medicament.expiration_date = medicamentUpdate.expiration_date;
      }
      // if($scope.medicament.expiration_date != null)
      // {
      //   var myDate = $scope.medicament.expiration_date.split("/");
      //   var newDate = myDate[1]+"/"+myDate[0]+"/"+myDate[2];
      //   $scope.medicament.expiration_date = new Date(newDate).getTime();
      // }
      MedicamentService.update(medicamentUpdate.id, $scope.medicament);
      $scope.clearMedicament();
      
       var alertPopup = $ionicPopup.alert({
          title: 'Sucesso!',
          template: 'Remédio alterado com sucesso!'
        });
       alertPopup.then(function(res) {
         $state.go('listMedicament');
       });
    } else {
      console.log("Invalid form");
    }
  }
    /** CLEAR MEDICAMENT DATA **/
  $scope.clearMedicament = function () {
    Medicament.name = null;
    Medicament.expiration_date  = null;
    Medicament.quantity  = null;
    Medicament.unit  = null;
    Medicament.price  = null;
    Medicament.dose  = null;
    Medicament.picture_medicament  = null;
    Medicament.picture_prescription  = null;
    Medicament.expired  = null;
    Medicament.id_pharmacy  = null;
    Medicament.id_category  = null;
    Medicament.id_place  = null;
    Medicament.id_interval  = null;
    Medicament.notes  = null;
    //Medicament.doseTypeString  = null;
    Medicament.place  = null;
    Category.name = '';
    Pharmacy.name = null;
  };

  /** DATE PICKER **/
  var dateSelecter = {
    callback: function (val) {
      var today = new Date();
      $scope.medicament.expiration_date = new Date(val);
      if($scope.medicament.expiration_date <= today){
        $scope.medicament.expired = 1; //FORA DA DATA DE VALIDADE
      }else{
        $scope.medicament.expired = 0; //DENTRO DA DATA DE VALIDADE
      }
      console.log('Return value from the datepicker popup is : ' + $scope.medicament.expiration_date );
    }
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(dateSelecter);
  };

  /** CANCEL AND GO BACK **/
  $scope.cancelUpdate = function () {
    $scope.clearMedicament();
    $state.go('listMedicament');
    //$state.go('tab.remedio');
  };
  /** MEDICAMENT PICTURE **/
  $scope.addMedicamentPicture = function () {
    $scope.pictureType = "medicament";
    $scope.addPicture();
  };

  /** PRESCRIPTION PICTURE **/
  $scope.addPrescriptionPicture = function () {
    $scope.pictureType = "prescription";
    $scope.addPicture();
  };

  /** ADD A PICTURE **/
  $scope.addPicture = function () {
    console.log("Let's add a picture!");

    var buttons = [];
    if($scope.pictureType == "prescription" && $scope.medicament.picture_prescription != null) {
      buttons = [
        { text: 'Tirar uma foto' },
        { text: 'Escolher uma foto da galeria' },
        { text: 'Visualizar foto' }
      ]
    } else {
      buttons = [
        { text: 'Tirar uma foto' },
        { text: 'Escolher da galeria' },
      ]
    }

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      destructiveText: 'Remover a foto cadastrada',
      titleText: 'O que deseja fazer?',
      cancelText: 'Cancelar',
      cancel: function() {
        // nothing to do.
      },
      buttonClicked: function(index) {
        console.log(index);
        if (index == 0) {
          $scope.doGetFromCamera();
        } else if (index == 1) {
          $scope.doGetFromGallery();
        } else if (index == 2) {
          $state.go('medicamentPicture', {picture: $scope.medicament.picture_prescription});
        }
        return true;
      },
      destructiveButtonClicked:  function() {
        console.log("Remover imagem do remédio");
      }
    });
  };

  $scope.doGetFromGallery = function () {
    console.log("Let's add a picture from GALLERY!");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      if ($scope.pictureType == "medicament") {
        $scope.medicament.picture_medicament = imageData;
      } else {
        $scope.medicament.picture_prescription = imageData;
      }
    }, function (err) {
      console.error(err);
      $ionicPopup.alert({
        title:'Erro ao obter imagem',
        subTitle: 'Ocorreu um erro ao obter a imagem, por favor tente novamente.'
      });
    });

  };

  $scope.doGetFromCamera = function () {
    console.log("Let's add a picture from CAMERA!");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA, // CAMERA
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      if ($scope.pictureType == "medicament") {
        $scope.medicament.picture_medicament = imageData;
      } else {
        $scope.medicament.picture_prescription = imageData;
      }
    }, function (err) {
      console.error(err);
      $ionicPopup.alert({
        title:'Error getting picture',
        subTitle: 'We had a problem trying to get that picture, please try again'
      });
    });

  };
});

/**********************************
 *  PharmacyMedicamentListCtrl
 **********************************/
app.controller('PharmacyMedicamentListCtrl', function($scope, $ionicHistory, Pharmacy, PharmacyService, $ionicConfig) {

  //$ionicConfig.backButton.text("Farmácia");
  debugger;
  PharmacyService.all().then(function(farmaciasResult){
    $scope.pharmacys = farmaciasResult
  });
  $scope.selectedPharmacy = Pharmacy;
  $scope.shouldShowDelete = false;

  $scope.select = function(pharmacyName, pharmacyId) {
    debugger;
    $scope.selectedPharmacy.name = pharmacyName;
    $scope.selectedPharmacy.id = pharmacyId;
    $ionicHistory.goBack();
  };

});
