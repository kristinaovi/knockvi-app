import React from 'react';

export const quotData = [
  
  {
    quotID :'QNKA-0001',
    quotSubject: 'CASE CR2032ASS New Tooling',
    quotTo: 'NKA',
    quotDate: '07-Apr-2025',
    quotAmount: 'USD 1,653.40',
    quotPO : 'Waiting',
    quotStatus : 'Open',
  },
  {
    quotID :'QNKA-0001',
    quotSubject: 'CASE CR2032ASS New Tooling',
    quotTo: 'NKA',
    quotDate: '07-Apr-2025',
    quotAmount: 'USD 1,653.40',
    quotPO : 'Waiting',
    quotStatus : 'Open',
  },
  {
    quotID :'QNKA-0001',
    quotSubject: 'CASE CR2032ASS New Tooling',
    quotTo: 'NKA',
    quotDate: '07-Apr-2025',
    quotAmount: 'USD 1,653.40',
    quotPO : 'Waiting',
    quotStatus : 'Open',
  },
  {
    quotID :'QNKA-0001',
    quotSubject: 'CASE CR2032ASS New Tooling',
    quotTo: 'NKA',
    quotDate: '07-Apr-2025',
    quotAmount: 'USD 1,653.40',
    quotPO : 'Waiting',
    quotStatus : 'Open',
  },
];

export const quotColumns = [
  {
    name: 'QUOTATION ID',
    selector: (row) => row['quotID'],
    sortable: true,
    center: false,
  },
    {
    name: 'SUBJECT',
    selector: (row) => row['quotSubject'],
    sortable: true,
    center: false,
  },
  {
    name: 'Attention To',
    selector: (row) => row['quotTo'],
    sortable: true,
    center: false,
  },
  {
    name: 'RELEASE DATE',
    selector: (row) => row['quotDate'],
    sortable: true,
    center: false,
  },
  {
    name: 'AMOUNT',
    selector: (row) => row['quotAmount'],
    sortable: true,
    center: false,
  },
  {
    name: 'PURCHASE ORDER',
    selector: (row) => row['quotPO'],
    sortable: true,
    center: false,
  },
  {
    name: 'STATUS',
    selector: (row) => row['quotStatus'],
    sortable: true,
    center: false,
  },
];

