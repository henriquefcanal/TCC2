var app = angular.module('minifarma.services.alertService', [])

  .factory('AlertService', function(DB) {
    var self = this;

    self.all = function () {
      return DB.query('SELECT * FROM Alert')
        .then(function (result) {
          return DB.fetchAll(result);
      });
    };

    self.insert = function(alert) {
      var parameters = [
        alert.startDateTime,
        alert.durationUnity,
        alert.durationNumber,
        alert.active,
        alert.id_interval,
        alert.id_medicament];

      return DB.query('INSERT INTO Alert (startDate, duration_unit, duration_number, active, id_interval, id_medicament) VALUES (?,?,?,?,?,?)', parameters);
    };

    self.remove = function(alert) {
      var parameters = [alert.id];
      return DB.query('DELETE FROM Alert WHERE id = (?)', parameters).then(function (result) {
            console.log("Deleted alert" + result);
          },
          function (err) {
            console.log("Error deleting alert " + err);
          });
    };

    self.update = function(id, alert) {
      var parameters = [alert.startDateTime, alert.durationUnity, alert.durationNumber, alert.active, alert.id_interval, alert.id_medicament, id];
      return DB.query('UPDATE Alert set startDate = (?), duration_unit = (?), duration_number = (?), active = (?), id_interval = (?), id_medicament = (?) WHERE id = (?)', parameters);
    };

    return self;
  })

  .factory('IntervalService', function () {
    var self = this;

    self.intervals = {
      1 : [1, '1 hora'],
      2 : [2, '2 horas'],
      3 : [3, '3 horas'],
      4 : [4, '4 horas'],
      5 : [6, '6 horas'],
      6 : [8, '8 horas'],
      7 : [12, '12 horas'],
      8 : [24, '24 horas']
    };

    return self
  });
