import React from 'react';

export const testreqData = [
  
  {
    testID :'S25-50',
    testSubject: 'Test Updimensi DI CAN CR AG',
    reqBy: 'Mr. Handa',
    testStatus : 'ON PROGRESS',
    testDetail : 'See Details' ,
  },
];

export const testreqColumns = [
  {
    name: 'TEST ID',
    selector: (row) => row['testID'],
    sortable: true,
    center: false,
  },
  {
    name: 'SUBJECT',
    selector: (row) => row['testSubject'],
    sortable: true,
    center: false,
  },
  {
    name: 'REQUEST BY',
    selector: (row) => row['reqBy'],
    sortable: true,
    center: false,
  },
  {
    name: 'Status',
    selector: (row) => row['testStatus'],
    sortable: true,
    center: false,
  },
  {
    name: 'Detail',
    selector: (row) => row['testDetail'],
    sortable: true,
    center: false,
  },
];