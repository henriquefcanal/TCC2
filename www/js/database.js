var app = angular.module('minifarma.database', []);

app.constant('DB_CONFIG', {
    name: 'minifarma.db',
    tables: [
      {
        name: 'Medicament',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'name', type: 'text'},
          {name: 'expiration_date', type: 'datetime'},
          {name: 'quantity', type: 'integer'},
          {name: 'unit', type: 'integer'},
          {name: 'price', type: 'double'},
          {name: 'dose', type: 'integer'},
          {name: 'picture_medicament', type: 'blob'},
          {name: 'picture_prescription', type: 'blob'},
          {name: 'expired', type: 'integer'},
          {name: 'id_pharmacy', type: 'integer'},
          {name: 'id_category', type: 'integer'},
          {name: 'id_place', type: 'integer'},
          {name: 'id_interval', type: 'integer'},
          {name: 'notes', type: 'text'}
        ],
        foreign: [
          { key: "id_pharmacy", references: "Pharmacy(id)"},
          { key: "id_category", references: "Category(id)"},
          { key: "id_place", references: "Place(id)"},
          { key: "id_interval", references: "Interval(id)"}
        ]
      },
      {
        name: 'Alert',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'startDate', type: 'integer'},
          {name: 'duration_unit', type: 'integer'},
          {name: 'duration_number', type: 'integer'},
          {name: 'active', type: 'integer'},
          {name: 'id_interval', type: 'integer'},
          {name: 'id_medicament', type: 'integer'}
        ],
        foreign: [
          { key: "id_medicament", references: "medicament(id)"},
          { key: "id_interval", references: "Interval(id)"}
        ]
      },
      {
        name: 'Category',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'name', type: 'text'}
        ]
      },
      {
        name: 'Pharmacy',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'name', type: 'text'},
          {name: 'favorite', type: 'integer'},
          {name: 'latitude', type: 'double'},
          {name: 'longitude', type: 'double'},
          {name: 'phone', type: 'integer'}
        ]
      },
      {
        name: 'MedicamentHistory',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'dateTook', type: 'datetime'},
          {name: 'id_medicament', type: 'integer'}
        ],
        foreign: [
          { key: "id_medicament", references: "medicament(id)"}
        ]
      },
      {
        name: 'Interval',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'number', type: 'integer'}
        ]
      },
      {
        name: 'Local',
        columns: [
          {name: 'id', type: 'integer primary key'},
          {name: 'name', type: 'text'}
        ]
      }
    ]
  });
