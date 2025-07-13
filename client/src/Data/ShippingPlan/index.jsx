import React from 'react';

export const supportData = [
  
  {
    shipID :'PECGI-SS_001',
    totalQty: '23,040,590 pcs',
    etdNKB: '10-Jul-2025',
    etaCust: '22-Jul-2025',
    bookingID: 'OOCL1231242312',
    shipStatus : 'ON PROGRESS',
    shipDetail : 'See Details',
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
    name: 'STATUS',
    selector: (row) => row['shipStatus'],
    sortable: true,
    center: false,
  },
  {
    name: 'DETAIL',
    selector: (row) => row['shipDetail'],
    sortable: true,
    center: false,
  },
];

export const TicketData = [
  {
    id: 1,
    title: 'ON PROGRESS',
    num: '2563',
    class: 'progress-bar bg-primary',
  },
  {
    id: 2,
    title: 'SHIPPED',
    num: '8943',
    class: 'progress-bar bg-success',
  },
  {
    id: 3,
    title: 'WAITING SCHEDULE',
    num: '2500',
    class: 'progress-bar bg-info',
  },
];
