var app = angular.module('minifarma.services.medicamentService', [])

  .factory('MedicamentService', function (DB) {

    var self = this;

    self.all = function () {
      return DB.query('SELECT * FROM medicament')
        .then(function (result) {
          return DB.fetchAll(result);
        });
    };

    self.getById = function (id) {
      if (id == 0) {
        id = 1;
      }
      return DB.query('SELECT * FROM medicament WHERE id = ?', [id])
        .then(function (result) {
          return DB.fetch(result);
        });
    };

    self.insert = function(medicament) {
      debugger;
      var parameters = [medicament.name,
        medicament.expiration_date,
        medicament.quantity,
        medicament.unit,
        medicament.price,
        medicament.dose,
        medicament.picture_medicament,
        medicament.picture_prescription,
        medicament.expired,
        medicament.id_pharmacy,
        medicament.id_category,
        medicament.id_place,
        medicament.id_interval,
        medicament.notes];
      return DB.query('INSERT INTO medicament (name, expiration_date, quantity, unit, price, dose, picture_medicament, picture_prescription, expired, id_pharmacy, id_category, id_place, id_interval, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', parameters);
    };

      self.updateMedicament = function(id, medicament) {
      var parameters = [medicament.name,
        medicament.expiration_date,
        medicament.quantity,
        medicament.unit,
        medicament.price,
        medicament.dose,
        medicament.picture_medicament,
        medicament.picture_prescription,
        medicament.expired,
        medicament.id_pharmacy,
        id];
        debugger;
      return DB.query('UPDATE medicament SET name = ?, expiration_date = ?, quantity ?, unit = ?, price = ?, dose = ?, picture_medicament = ?, picture_prescription = ?, expired = ?, id_pharmacy = ? WHERE id = ?', parameters)
      .then(function (result) {
            console.log("Updated medicament" + result);
          },
          function (err) {
            console.log("Error updating medicament " + err);
          });

    };

    self.update = function(id, medicament) {
      debugger;
      var parameters = [medicament.name,
          medicament.expired,
          medicament.expiration_date,
          medicament.quantity,
          medicament.dose,
          medicament.unit,
          medicament.price,
          medicament.id_pharmacy,
          medicament.picture_medicament,
          id];
      return DB.query('UPDATE medicament set name = (?), expired = (?), expiration_date = (?), quantity = (?), dose = (?), unit = (?), price = (?), id_pharmacy = (?), picture_medicament = (?) WHERE id = (?)', parameters);
    };

    self.remove = function(medicament) {
      var parameters = [medicament.id];
      return DB.query('DELETE FROM medicament WHERE id = (?)', parameters)
        .then(function (result) {
            console.log("Deleted medicament" + result);
          },
          function (err) {
            console.log("Error deleting medicament " + err);
          });
    };

    return self;
  })
