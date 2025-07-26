import React from 'react';

export const inventoryData = [
  
  {
    partID :'BTY0001',
    partName: 'C. Case CR2032E',
    finishStock : '36',
    ctnStock : '7',
    pltStock : '10',
    remarkStock : '36',
  },
  {
    partID :'BTY0001',
    partName: 'C. Case CR2032E',
    finishStock : '36',
    ctnStock : '7',
    pltStock : '10',
    remarkStock : '36',
  },
  {
    partID :'BTY0001',
    partName: 'C. Case CR2032E',
    finishStock : '36',
    ctnStock : '7',
    pltStock : '10',
    remarkStock : '36',
  },
  {
    partID :'BTY0001',
    partName: 'C. Case CR2032E',
    finishStock : '36',
    ctnStock : '7',
    pltStock : '10',
    remarkStock : '36',
  },
];

export const inventoryColumns = [
  {
    name: 'PART ID',
    selector: (row) => row['partID'],
    sortable: true,
    cell: (row) => (
      <button
        className="btn btn-link p-0"
        onClick={() => row.onClick(row)}
      >
        {row.partID}
      </button>
    ),
    center: false,
  },
  {
    name: 'PART NAME',
    selector: (row) => row['partName'],
    sortable: true,
    center: false,
  },
  {
    name: 'FINISH GOOD',
    selector: (row) => row['finishStock'],
    sortable: true,
    center: false,
  },
  {
    name: 'CARTON',
    selector: (row) => row['ctnStock'],
    sortable: true,
    center: false,
  },
  {
    name: 'PALLETE',
    selector: (row) => row['pltStock'],
    sortable: true,
    center: false,
  },
  {
    name: 'REMARK',
    selector: (row) => row['remarkStock'],
    sortable: true,
    center: false,
  },
  
];

