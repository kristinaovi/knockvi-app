import React, { useState } from "react";
import { poData } from "../../../../Data/PO";
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { PurchaseOrderTittle } from "../../../../Constant";
import { H5 } from "../../../../AbstractElements";
import TableColumnFilter from "../../../Filter/TableColumnFilter";

// Kolom untuk DataTable
const poColumns = (onClickProdID) => [
  {
    name: "PART ID",
    selector: (row) => row.partID,
    cell: (row) => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickProdID(row)}
      >
        {row.partID}
      </button>
    ),
    sortable: true,
  },
  { name: "PART NAME", selector: (row) => row.partName, sortable: true },
  { name: "PECGI PO", selector: (row) => row.pecgiPO, sortable: true },
  { name: "PPAP PO", selector: (row) => row.ppapPO, sortable: true },
  { name: "REQUEST DATE", selector: (row) => row.reqDate, sortable: true },
  { name: "PO LINE", selector: (row) => row.poLine, sortable: true },
  { name: "ISSUED QTY", selector: (row) => row.issuedQty, sortable: true },
  { name: "OPEN QTY", selector: (row) => row.openQty, sortable: false },
];

const PurchaseOrderList = () => {
  const [filters, setFilters] = useState({
    partID: "",
    partName: "",
    pecgiPO: "",
    ppapPO: "",
    reqDate: "",
    poLine: "",
    issuedQty: "",
    openQty: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdRow, setSelectedProdRow] = useState(null);
  const [editedProd, setEditedProd] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const historyOutputDummy = [
    { tanggal: "21 Januari", output1: 200000, output2: 200000 },
    { tanggal: "22 Januari", output1: 100000, output2: 150000 },
    { tanggal: "23 Januari", output1: 150000, output2: 150000 },
  ];

  const grandTotalOutput = historyOutputDummy.reduce(
    (total, row) => total + row.output1 + row.output2,
    0
  );

  const toggleModal = (row) => {
    setSelectedProdRow(row);
    setEditedProd({ ...row });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    console.log("Updated Data:", editedProd);
    setSelectedProdRow(editedProd);
    setIsEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProd((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredData = poData.filter((item) =>
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
          <H5>{PurchaseOrderTittle}</H5>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <Row className="mb-3">
          <Col>
            <TableColumnFilter filters={filters} setFilters={setFilters} />
          </Col>
        </Row>

        <DataTable
          columns={poColumns(toggleModal)}
          data={filteredData}
          striped
          center
          pagination
        />

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            DETAIL & HISTORY - {selectedProdRow?.partID}
            <Button
              color={isEditMode ? "secondary" : "primary"}
              size="sm"
              className="position-absolute"
              style={{ top: "0.75rem", right: "3rem" }}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Cancel Edit" : "Edit"}
            </Button>
          </ModalHeader>

          <ModalBody>
            {editedProd && (
              <div className="mb-3">
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Part Name:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.partName}
                        onChange={(e) =>
                          handleInputChange("partName", e.target.value)
                        }
                      />
                    ) : (
                      selectedProdRow.partName
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>PECGI PO:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.pecgiPO}
                        onChange={(e) =>
                          handleInputChange("pecgiPO", e.target.value)
                        }
                      />
                    ) : (
                      selectedProdRow.pecgiPO
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <strong>PPAP PO:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.ppapPO}
                        onChange={(e) =>
                          handleInputChange("ppapPO", e.target.value)
                        }
                      />
                    ) : (
                      selectedProdRow.ppapPO
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>Request Date:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.reqDate}
                        onChange={(e) =>
                          handleInputChange("reqDate", e.target.value)
                        }
                      />
                    ) : (
                      selectedProdRow.reqDate
                    )}
                  </Col>
                </Row>
              </div>
            )}

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

export default PurchaseOrderList;
