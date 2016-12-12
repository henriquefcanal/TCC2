angular.module('minifarma.controllers.tab', [])

  .controller('TabCtrl', function($scope,
                                  $state,
                                  $ionicActionSheet) {

    $scope.showAction = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Remédio' },
          { text: 'Alerta' },
          { text: 'Farmácia' }
        ],
        titleText: 'Adicionar novo',
        cancelText: 'Cancelar',
        cancel: function() {
          // Nothing to do.
        },
        buttonClicked: function(index) {

          switch(index) {
            case 0:
              $scope.createMedicament();
              break;
            case 1:
              $scope.createAlert();
              break;
            case 2:
              $scope.createPharmacy();
              break;
          }
          return true;
        }
      });
    };

    $scope.createMedicament = function() {
      $state.go('createMedicament');
    };

    $scope.createAlert = function() {
      $state.go('createAlert');
    };

    $scope.createPharmacy = function() {
      $state.go('createPharmacy');
    };

    $scope.listMedicament = function() {
      $state.go('listMedicament');
    };

    $scope.listAlert = function() {
      $state.go('listAlert');
    };

    $scope.listPharmacy = function() {
      $state.go('listPharmacy');
    };
  });
