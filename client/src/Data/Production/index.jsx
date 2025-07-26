import React from 'react';

export const prodData = [
  
  {
    prodID :'BTY0001',
    prodName: 'C. Case CR2032E',
    prodMC: 'DTR-34',
    prodPlan: '1,000,000 pcs',
    prodOutput: '500,000',
    prodMCStatus: 'Running',
    prodStatus : 'Open',
    prodRemark : '',
  },
    
  {
    prodID :'BTY0001',
    prodName: 'C. Case CR2032E',
    prodMC: 'DTR-34',
    prodPlan: '1,000,000 pcs',
    prodOutput: '500,000',
    prodMCStatus: 'Running',
    prodStatus : 'Open',
    prodRemark : '',
  },

  {
    prodID :'BTY0001',
    prodName: 'C. Case CR2032E',
    prodMC: 'DTR-34',
    prodPlan: '1,000,000 pcs',
    prodOutput: '500,000',
    prodMCStatus: 'Running',
    prodStatus : 'Open',
    prodRemark : '',
  },

  {
    prodID :'BTY0001',
    prodName: 'C. Case CR2032E',
    prodMC: 'DTR-34',
    prodPlan: '1,000,000 pcs',
    prodOutput: '500,000',
    prodMCStatus: 'Running',
    prodStatus : 'Open',
    prodRemark : '',
  },
 
];

export const prodColumns = [
  {
    name: 'PART ID',
    selector: (row) => row['prodID'],
    sortable: true,
    center: false,
  },
  {
    name: 'PART NAME',
    selector: (row) => row['prodName'],
    sortable: true,
    center: false,
  },
  {
    name: 'MACHINE NO.',
    selector: (row) => row['prodMC'],
    sortable: true,
    center: false,
  },  
  {
    name: 'QTY PLAN',
    selector: (row) => row['prodPlan'],
    sortable: true,
    center: false,
  },

    {
    name: 'QTY OUTPUT',
    selector: (row) => row['prodOutput'],
    sortable: true,
    center: false,
  },

  {
    name: 'MACHINE STATUS',
    selector: (row) => row['prodMCStatus'],
    sortable: true,
    center: false,
  },  
  {
    name: 'PROD STATUS',
    selector: (row) => row['prodStatus'],
    sortable: true,
    center: false,
  },

    {
    name: 'REMARK',
    selector: (row) => row['prodRemark'],
    sortable: true,
    center: false,
  },


];

