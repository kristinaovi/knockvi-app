import React, { useState } from 'react';
import { inventoryData } from '../../../Data/Inventory';
import {
  Card, CardBody, CardHeader, Row, Col, Modal, ModalHeader, ModalBody, Table, Button
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { H5 } from '../../../AbstractElements';
import TableColumnFilter from '../../Filter/TableColumnFilter';
import { Filter } from "react-feather"; // ✅ Tambah import

const inventoryColumns = (onClickProdID) => [
  {
    name: 'Part Code',
    selector: row => row.partID,
    cell: row => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickProdID(row)}
      >
        {row.partID}
      </button>
    ),
    sortable: true,
  },
  { name: 'Part Name', selector: row => row.partName, sortable: true },
  { name: 'Total Stock', selector: row => row.partTotal, sortable: true },
  { name: 'Finish Good', selector: row => row.finishStock, sortable: true },
  { name: 'Cartom', selector: row => row.ctnStock, sortable: true },
  { name: 'Pallete', selector: row => row.pltStock, sortable: true },
  { name: 'Remark', selector: row => row.remarkStock, sortable: false },
];

const InventoryList = () => {
  const [filters, setFilters] = useState({
    partID: '',
    partName: '',
    partTotal: '',
    finishStock: '',
    remarkStock: '',
  });

  const [showFilters, setShowFilters] = useState(false); // ✅ untuk toggle filter
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdRow, setSelectedProdRow] = useState(null);
  const [editedProd, setEditedProd] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const historyOutputDummy = [
    { tanggal: '21 Januari', inout: 200000, total: 200000, action: '' },
    { tanggal: '22 Januari', inout: 150000, total: 150000, action: '' },
    { tanggal: '23 Januari', inout: 100000, total: 100000, action: '' },
  ];

  const grandTotalOutput = historyOutputDummy.reduce(
    (total, row) => total + (row.total || 0),
    0
  );

  const toggleModal = (row) => {
    setSelectedProdRow(row);
    setEditedProd({ ...row });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    console.log('Updated Data:', editedProd);
    setSelectedProdRow(editedProd);
    setIsEditMode(false);
  };

  const filteredData = inventoryData.filter((item) =>
    Object.keys(filters).every((key) =>
      !filters[key] ||
      item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5 className="mb-0">Inventory List</H5>
        <Filter className="cursor-pointer" onClick={() => setShowFilters(prev => !prev)} size={18} />
      </CardHeader>

      <CardBody className="pt-0">
        {showFilters && (
          <Row className="mb-3">
            <Col>
              <TableColumnFilter filters={filters} setFilters={setFilters} />
            </Col>
          </Row>
        )}

        <DataTable
          columns={inventoryColumns(toggleModal)}
          data={filteredData}
          striped
          center
          pagination
        />

        {/* Modal Detail */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)} className="position-relative pe-5">
            DETAIL & HISTORY - {selectedProdRow?.partID}
          </ModalHeader>
          <ModalBody>
            {/* History Output Table */}
            <Table bordered responsive className="mt-4">
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>IN/OUT</th>
                  <th>TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {historyOutputDummy.map((row, index) => (
                  <tr key={index}>
                    <td>{row.tanggal || '-'}</td>
                    <td>{row.inout?.toLocaleString() || '-'}</td>
                    <td>{row.total?.toLocaleString() || '-'}</td>
                    <td>{row.action || '-'}</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td colSpan="2" className="text-end">Grand Total</td>
                  <td>{grandTotalOutput.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>

            {isEditMode && (
              <div className="d-flex justify-content-end mt-3">
                <Button color="success" onClick={handleUpdate}>
                  Update
                </Button>
              </div>
            )}
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default InventoryList;
