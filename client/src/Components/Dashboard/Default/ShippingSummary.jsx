import { supportColumns, supportData } from '../../../Data/SupportTicket';
import React, { Fragment } from 'react';
import DataTable from 'react-data-table-component';
import { ShippingSummaryTittle } from '../../../Constant';
import { H5 } from '../../../AbstractElements';

const ShippingSummary = () => {
    return (
        <Fragment>
            <div className="outer-box border rounded-lg shadow-md p-4 mb-4 bg-white"> {/* Box tambahan */}
                <H5>{ShippingSummaryTittle}</H5>
                <div className="table-responsive support-table box-col-7 p-3">
                    <DataTable
                        columns={supportColumns}
                        data={supportData}
                        striped={true}
                        center={true}
                        pagination
                    />
                </div>
            </div>
        </Fragment>
    );
};
export default ShippingSummary;