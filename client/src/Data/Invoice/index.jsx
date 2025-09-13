import React from 'react';

export const invData = [
  
  {
    invID :'08/25 (PECGI)-001',
    invCust: 'Panasonic',
    invShip : 'Sea',
    invETD: '28-Jan-2025',
    invETA : '31-Jan-2025',
  },

    {
    invID :'08/25 (PECGI)-002',
    invCust: 'Panasonic',
    invShip : 'Sea',
    invETD: '28-Jan-2025',
    invETA : '31-Jan-2025',
  },

    {
    invID :'08/25 (PECGI)-003',
    invCust: 'Panasonic',
    invShip : 'Sea',
    invETD: '28-Jan-2025',
    invETA : '31-Jan-2025',
  },
];

export const invColumns = [
  {
    name: 'Invoice ID',
    selector: (row) => row['invID'],
    sortable: true,
    center: false,
  },
  {
    name: 'Customer',
    selector: (row) => row['invCust'],
    sortable: true,
    center: false,
  },
  {
    name: 'Ship Methode',
    selector: (row) => row['invShip'],
    sortable: true,
    center: false,
  },

    {
    name: 'ETD NKB',
    selector: (row) => row['invETD'],
    sortable: true,
    center: false,
  },

  {
    name: 'ETA Customer',
    selector: (row) => row['invETA'],
    sortable: true,
    center: false,
  },
]
