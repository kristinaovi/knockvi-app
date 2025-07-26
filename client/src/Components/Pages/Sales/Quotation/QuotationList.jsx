import React, { useState } from 'react';
import { quotColumns, quotData } from '../../../../Data/Quotation';
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { QuotationTittle } from '../../../../Constant';
import { H5 } from '../../../../AbstractElements';
import TableColumnFilter from '../../../Filter/TableColumnFilter';

const QuotationList = () => {
  const [filters, setFilters] = useState({
    quotID :'',
    quotSubject: '',
    quotTo: '',
    quotDate: '',
    quotAmount: '',
    quotPO : '',
    quotStatus : '',
  });

  const filteredData = quotData.filter((item) =>
    Object.keys(filters).every((key) => {
      const value = item[key];
      const filter = filters[key];
      if (!filter) return true;
      return value?.toString().toLowerCase().includes(filter.toLowerCase());
    })
  );

  return (
    <Card>
      <CardHeader className="card-no-border">
        <div className="d-flex justify-content-between align-items-center w-100">
          <H5>{QuotationTittle}</H5>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <Row className="mb-3">
          <Col>
            <TableColumnFilter filters={filters} setFilters={setFilters} />
          </Col>
        </Row>

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
