import { supportColumns, supportData } from '../../../Data/SupportTicket';
import { Card, CardBody, CardHeader } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { ShippingSummaryTittle } from '../../../Constant';
import { H5 } from '../../../AbstractElements';

const ShippingSummary = () => {
    return (
    <Card>
        <CardHeader className='card-no-border'>
            <H5>{ShippingSummaryTittle}</H5>
        </CardHeader>
        <CardBody className='pt-0'>
            <DataTable
                columns={supportColumns}
                data={supportData}
                striped={true}
                center={true}
                pagination
            />
      </CardBody>
    </Card>
    );
};
export default ShippingSummary;