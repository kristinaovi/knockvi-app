import React from 'react';

export const salesreportData = [
  
  {
    reportID :'25-01',
    reportName: 'Sales Report of January 2025',
    reportDate: '07-Apr-2025',
    reportDistribute: 'Email',
    reportDownload : 'Click to Download',
  },
];

export const salesreportColumns = [
  {
    name: 'SALES REPORT ID',
    selector: (row) => row['reportID'],
    sortable: true,
    center: false,
  },
  {
    name: 'FILE NAME',
    selector: (row) => row['reportName'],
    sortable: true,
    center: false,
  },
  {
    name: 'UPLOAD DATE',
    selector: (row) => row['reportDate'],
    sortable: true,
    center: false,
  },
  {
    name: 'DISTRIBUTED',
    selector: (row) => row['reportDistribute'],
    sortable: true,
    center: false,
  },
  {
    name: 'DOWNLOAD',
    selector: (row) => row['reportDownload'],
    sortable: true,
    center: false,
  },
];

