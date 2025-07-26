import React, { useState } from 'react';
import { prodData } from '../../../Data/Production';
import {
  Card, CardBody, CardHeader, Row, Col, Modal, ModalHeader, ModalBody, Table, Button, Input
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { H5 } from '../../../AbstractElements';
import TableColumnFilter from '../../Filter/TableColumnFilter';

// Kolom tabel utama
const prodColumns = (onClickProdID) => [
  {
    name: 'Part ID',
    selector: row => row.prodID,
    cell: row => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickProdID(row)}
      >
        {row.prodID}
      </button>
    ),
    sortable: true,
  },
  { name: 'Part Name', selector: row => row.prodName, sortable: true },
  { name: 'Machine', selector: row => row.prodMC, sortable: true },
  { name: 'Qty Plan', selector: row => row.prodPlan, sortable: true },
  { name: 'Output', selector: row => row.prodOutput, sortable: true },
  { name: 'MC Status', selector: row => row.prodMCStatus, sortable: true },
  { name: 'Status', selector: row => row.prodStatus, sortable: true },
  { name: 'Remark', selector: row => row.prodRemark, sortable: false },
];

const ProductionPlanList = () => {
  const [filters, setFilters] = useState({
    prodID: '',
    prodName: '',
    prodMC: '',
    prodPlan: '',
    prodOutput: '',
    prodMCStatus: '',
    prodStatus: '',
    prodRemark: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdRow, setSelectedProdRow] = useState(null);
  const [editedProd, setEditedProd] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dummy data history
  const historyOutputDummy = [
    { tanggal: '21 Januari', output1: 200000, output2: 200000 },
    { tanggal: '22 Januari', output1: 100000, output2: 150000 },
    { tanggal: '23 Januari', output1: 150000, output2: 150000 },
  ];

  const grandTotalOutput = historyOutputDummy.reduce(
    (total, row) => total + row.output1 + row.output2, 0
  );

  const toggleModal = (row) => {
    setSelectedProdRow(row);
    setEditedProd({ ...row });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    console.log('Updated Data:', editedProd);
    setSelectedProdRow(editedProd); // update tampilan dengan data baru
    setIsEditMode(false);
  };

  const filteredData = prodData.filter((item) =>
    Object.keys(filters).every((key) =>
      !filters[key] ||
      item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className="card-no-border">
        <div className="d-flex justify-content-between align-items-center w-100">
          <H5>Production Plan & Monitoring List</H5>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <Row className="mb-3">
          <Col>
            <TableColumnFilter filters={filters} setFilters={setFilters} />
          </Col>
        </Row>

        <DataTable
          columns={prodColumns(toggleModal)}
          data={filteredData}
          striped
          center
          pagination
        />

        {/* Modal Detail */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)} className="position-relative pe-5">
          History - {selectedProdRow?.prodID}
          <Button
            color={isEditMode ? "secondary" : "primary"}
            size="sm"
            className="position-absolute"
            style={{ top: '0.75rem', right: '3rem' }}  // adjust padding from right if needed
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Cancel Edit' : 'Edit'}
          </Button>
        </ModalHeader>



          <ModalBody>
            {editedProd && (
              <div className="mb-3">
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Part Name:</strong><br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.prodName}
                        onChange={(e) =>
                          setEditedProd({ ...editedProd, prodName: e.target.value })
                        }
                      />
                    ) : (
                      selectedProdRow.prodName
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>Machine:</strong><br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.prodMC}
                        onChange={(e) =>
                          setEditedProd({ ...editedProd, prodMC: e.target.value })
                        }
                      />
                    ) : (
                      selectedProdRow.prodMC
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <strong>Qty Plan:</strong><br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.prodPlan}
                        onChange={(e) =>
                          setEditedProd({ ...editedProd, prodPlan: e.target.value })
                        }
                      />
                    ) : (
                      selectedProdRow.prodPlan
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>MC Status:</strong><br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.prodMCStatus}
                        onChange={(e) =>
                          setEditedProd({ ...editedProd, prodMCStatus: e.target.value })
                        }
                      />
                    ) : (
                      selectedProdRow.prodMCStatus
                    )}
                  </Col>
                </Row>
              </div>
            )}

            {/* History Output Table */}
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Output 1</th>
                  <th>Output 2</th>
                  <th>Total Output</th>
                </tr>
              </thead>
              <tbody>
                {historyOutputDummy.map((row, index) => (
                  <tr key={index}>
                    <td>{row.tanggal}</td>
                    <td>{row.output1.toLocaleString()}</td>
                    <td>{row.output2.toLocaleString()}</td>
                    <td>{(row.output1 + row.output2).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td colSpan="3" className="text-end">Grand Total</td>
                  <td>{grandTotalOutput.toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>

            {/* Tombol Update */}
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

export default ProductionPlanList;
