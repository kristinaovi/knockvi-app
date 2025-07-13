import React from 'react';

export const custinfoData = [
  
  {
    testID :'S25-30',
    testSubject: 'Supplier Evaluation Mar 2025',
    reqBy: 'Mr. Handa',
    custBy : 'PECGI',
    infoDetail : 'See Details',
  },
];

export const custinfoColumns = [
  {
    name: 'CUST. INFORMATION ID',
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
    name: 'INFORMATION BY',
    selector: (row) => row['reqBy'],
    sortable: true,
    center: false,
  },

    {
    name: 'CUSTOMER',
    selector: (row) => row['custBy'],
    sortable: true,
    center: false,
  },

  {
    name: 'Detail',
    selector: (row) => row['infoDetail'],
    sortable: true,
    center: false,
  },
]
