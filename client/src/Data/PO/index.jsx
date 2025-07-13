import React from 'react';

export const poData = [
  
  {
    partID :'BTY0001',
    partName: 'C. Case CR2032E',
    pecgiPO: '791-1055',
    ppapPO: '22502088',
    reqDate: '07-Apr-2025',
    poLine : '47',
    issuedQty : '36',
    openQty : '36',
    detailPO : 'See Details',
  },
  {
    partID :'BTY0002',
    partName: 'C. Case CR2032E',
    pecgiPO: '791-1055',
    ppapPO: '22502088',
    reqDate: '07-Apr-2025',
    poLine : '47',
    issuedQty : '896',
    openQty : '36',
    detailPO : 'See Details',
  },
  {
    partID :'BTY0003',
    partName: 'C. Case CR2032E',
    pecgiPO: '791-1055',
    ppapPO: '22502088',
    reqDate: '07-Apr-2025',
    poLine : '47',
    issuedQty : '36',
    openQty : '36',
    detailPO : 'See Details',
  },
  {
    partID :'BTY0004',
    partName: 'C. Case CR2032E',
    pecgiPO: '791-1055',
    ppapPO: '22502088',
    reqDate: '07-Apr-2025',
    poLine : '47',
    issuedQty : '312',
    openQty : '36',
    detailPO : 'See Details',
  },
  {
    partID :'BTY0005',
    partName: 'C. Case CR2032E',
    pecgiPO: '791-1055',
    ppapPO: '22502088',
    reqDate: '07-Apr-2025',
    poLine : '47',
    issuedQty : '362',
    openQty : '36',
    detailPO : 'See Details',
  },

];

export const poColumns = [
  {
    name: 'PART ID',
    selector: (row) => row['partID'],
    sortable: true,
    center: false,
  },
  {
    name: 'PART NAME',
    selector: (row) => row['partName'],
    sortable: true,
    center: false,
  },
  {
    name: 'PECGI PO',
    selector: (row) => row['pecgiPO'],
    sortable: true,
    center: false,
  },
  {
    name: 'PPAP PO',
    selector: (row) => row['ppapPO'],
    sortable: true,
    center: false,
  },
  {
    name: 'REQUEST DATE',
    selector: (row) => row['reqDate'],
    sortable: true,
    center: false,
  },
  {
    name: 'LINE',
    selector: (row) => row['poLine'],
    sortable: true,
    center: false,
  },
  {
    name: 'ISSUED QTY',
    selector: (row) => row['issuedQty'],
    sortable: true,
    center: false,
  },
  {
    name: 'OPEN QTY',
    selector: (row) => row['openQty'],
    sortable: true,
    center: false,
  },
  {
    name: 'DETAIL',
    selector: (row) => row['detailPO'],
    sortable: true,
    center: false,
  },
];

