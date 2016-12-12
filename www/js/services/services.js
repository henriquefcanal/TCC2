angular.module('minifarma.services', [
    'minifarma.services.medicamentService',
    'minifarma.services.pharmacyService',
    'minifarma.services.alertService'
])

  .factory('DB', function ($q,
                           $cordovaSQLite,
                           $ionicPlatform,
                           DB_CONFIG) {

    var self = this;
    self.db = null;

    self.init = function () {
      if (window.cordova) {
        self.db = $cordovaSQLite.openDB({name: DB_CONFIG.name, location: 'default'});
      } else {
        // console.log('websql');
        self.db = window.openDatabase(DB_CONFIG.name, "1.0", "MiniFarma", -1);
      }

      angular.forEach(DB_CONFIG.tables, function(table) {
        var columns = [];

        angular.forEach(table.columns, function(column) {
          columns.push(column.name + ' ' + column.type);
        });

        var foreigners = [];
        angular.forEach(table.foreign, function(foreign) {
          foreigners.push('FOREIGN KEY(' + foreign.key + ') REFERENCES ' + foreign.references);
        });

        var query;
        if (foreigners.length > 0){
          query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ', ' + foreigners.join(',') + ')';
        } else {
          query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
        }
        // console.log(query);
        self.query(query);
        // console.log('Table ' + table.name + ' initialized');
      });
    };

    self.query = function (query, bindings) {
      bindings = typeof bindings !== 'undefined' ? bindings : [];
      var deferred = $q.defer();

      $ionicPlatform.ready(function () {
        self.db.transaction(function (transaction) {
          transaction.executeSql(query, bindings, function (transaction, result) {
            deferred.resolve(result);
          }, function (transaction, error) {
            deferred.reject(error);
          });
        });
      });

      return deferred.promise;
    };

    self.fetchAll = function (result) {
      var output = [];
      for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
      }
      return output;
    };

    self.fetch = function (result) {
      return result.rows.item(0);
    };
    return self;
  });
