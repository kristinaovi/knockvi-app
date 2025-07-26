import React from 'react';

export const supportData = [
  
  {
    shipID :'PECGI-SS_002',
    totalQty: '23,590 pcs',
    etdNKB: '10-Jul-2025',
    etaCust: '22-Jul-2025',
    bookingID: 'OOCL1231242312',
    vesselID: 'VAN COUVER V.165S',
    contID: '1X20 1X40',
    invNo : 'PECGI-123',
    shipStatus : 'Open',
  },
  {
    shipID :'PECGI-SS_003',
    totalQty: '10,500,590 pcs',
    etdNKB: '10-Jul-2025',
    etaCust: '22-Jul-2025',
    bookingID: 'OOCL1231242312',
    vesselID: 'VAN COUVER V.165S',
    contID: '1X20 1X40',
    invNo : 'PECGI-123',
    shipStatus : 'Open',
  },
  {
    shipID :'PECGI-SS_001',
    totalQty: '23,040,590 pcs',
    etdNKB: '10-Jul-2025',
    etaCust: '22-Jul-2025',
    bookingID: 'OOCL1231242312',
    vesselID: 'VAN COUVER V.165S',
    contID: '1X20 1X40',
    invNo : 'PECGI-123',
    shipStatus : 'Open',
  },
];

export const supportColumns = [
  {
    name: 'SHIPPING ID',
    selector: (row) => row['shipID'],
    sortable: true,
    center: false,
  },
  {
    name: 'QUANTITY',
    selector: (row) => row['totalQty'],
    sortable: true,
    center: false,
  },
  {
    name: 'ETD NKB',
    selector: (row) => row['etdNKB'],
    sortable: true,
    center: false,
  },
  {
    name: 'ETA CUST',
    selector: (row) => row['etaCust'],
    sortable: true,
    center: false,
  },
  {
    name: 'BOOKING NO.',
    selector: (row) => row['bookingID'],
    sortable: true,
    center: false,
  },
  {
    name: 'VESSEL',
    selector: (row) => row['vesselID'],
    sortable: true,
    center: false,
  },
  {
    name: 'CONTAINER',
    selector: (row) => row['contID'],
    sortable: true,
    center: false,
  },
  {
    name: 'INVOICE NO.',
    selector: (row) => row['invNo'],
    sortable: true,
    center: false,
  },
  {
    name: 'STATUS',
    selector: (row) => row['shipStatus'],
    sortable: true,
    center: false,
  },
];