var app = angular.module('minifarma.services.pharmacyService', [])

  .factory('PharmacyService', function (DB) {

    var self = this;

    self.all = function () {
      return DB.query('SELECT * FROM Pharmacy')
        .then(function (result) {
          return DB.fetchAll(result);
        });
    };

    self.getById = function (id) {
      debugger;
      return DB.query('SELECT * FROM Pharmacy WHERE id = ?', [id])
        .then(function (result) {
          return DB.fetch(result);
        });
    };

    self.getNameById = function (id) {
      if (id == 0) {
        id = 1;
      }
      return DB.query('SELECT * FROM pharmacy WHERE id = ?', [id])
        .then(function (result) {
          return DB.fetch(result);
        });
    };

    self.insert = function(pharmacy) {
      var parameters = [pharmacy.name, pharmacy.favorite, pharmacy.lat, pharmacy.lon, pharmacy.phone];
      return DB.query('INSERT INTO Pharmacy (name, favorite, latitude, longitude, phone) VALUES (?,?,?,?,?)', parameters);
    };

    self.remove = function(pharmacy) {
      var parameters = [pharmacy.id];
      return DB.query('DELETE FROM Pharmacy WHERE id = (?)', parameters)
        .then(function (result) {
            console.log("Deleted pharmacy" + result);
          },
          function (err) {
            console.log("Error deleting pharmacy " + err);
          });
    };

    self.update = function(id, pharmacy) {
      var parameters = [pharmacy.name, pharmacy.phone, id];
      return DB.query('UPDATE pharmacy set name = (?), phone = (?) WHERE id = (?)', parameters);
    };

    return self;
  });
