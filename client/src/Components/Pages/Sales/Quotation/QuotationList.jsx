import React, { useState } from 'react';
import { quotColumns, quotData } from '../../../../Data/Quotation';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { QuotationTittle } from '../../../../Constant';
import { H5 } from '../../../../AbstractElements';

const QuotationList = () => {
  const [searchText, setSearchText] = useState('');

  const filteredData = quotData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className='card-no-border'>
        <div className="d-flex justify-content-between align-items-center w-100">
          <H5>{QuotationTittle}</H5>
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
          columns={quotColumns}
          data={filteredData}
          striped={true}
          center={true}
          pagination
        />
      </CardBody>
    </Card>
  );
};

export default QuotationList;
