import React, { useState } from 'react';
import { custinfoColumns, custinfoData } from '../../../../Data/CustomerInformation';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { CustInfoTittle } from '../../../../Constant';
import { H5 } from '../../../../AbstractElements';

const CustInfoList = () => {
  const [searchText, setSearchText] = useState('');

  const filteredData = custinfoData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className='card-no-border'>
        <div className="d-flex justify-content-between align-items-center w-100">
          <H5>{CustInfoTittle}</H5>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody className='pt-0'>
        <DataTable
          columns={custinfoColumns}
          data={filteredData}
          striped={true}
          center={true}
          pagination
        />
      </CardBody>
    </Card>
  );
};

export default CustInfoList;
