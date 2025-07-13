import { custinfoColumns, custinfoData } from '../../../Data/CustomerInformation';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { CustInfoSummaryTittle } from '../../../Constant';
import { H5 } from '../../../AbstractElements';

const ShippingSummary = () => {
    return (
    <Card>
        <CardHeader className='card-no-border'>
             <H5>{CustInfoSummaryTittle}</H5>
        </CardHeader>
        <CardBody className='pt-0'>
            <div className="table-responsive p-3">
                <DataTable
                columns={custinfoColumns}
                data={custinfoData}
                striped
                center
                pagination
                />
            </div>
      </CardBody>
    </Card>
    );
};
export default ShippingSummary;