// src/components/ProductionPlanList.jsx
import React, { useState } from "react";
import { prodData as initialProdData } from "../../../Data/Production";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
  Input,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";
import TableColumnFilter from "../../Filter/TableColumnFilter";
import { Filter } from "react-feather";

// Kolom tabel utama
const prodColumns = (onClickProdID) => [
  {
    name: "Part ID",
    selector: (row) => row.prodID,
    cell: (row) => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickProdID(row)}
      >
        {row.prodID}
      </button>
    ),
    sortable: true,
  },
  { name: "Part Name", selector: (row) => row.prodName, sortable: true },
  { name: "Machine", selector: (row) => row.prodMC, sortable: true },
  { name: "Qty Plan", selector: (row) => row.prodPlan, sortable: true },
  { name: "Total Output", selector: (row) => row.prodOutput, sortable: true },
  { name: "MC Status", selector: (row) => row.prodMCStatus, sortable: true },
  { name: "Status", selector: (row) => row.prodStatus, sortable: true },
  { name: "Remark", selector: (row) => row.prodRemark, sortable: false },
];

const ProductionPlanList = () => {
  const [prodList, setProdList] = useState(initialProdData);
  const [filters, setFilters] = useState({
    prodID: "",
    prodName: "",
    prodMC: "",
    prodPlan: "",
    prodOutput: "",
    prodMCStatus: "",
    prodStatus: "",
    prodRemark: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilter = () => setShowFilters((prev) => !prev);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdRow, setSelectedProdRow] = useState(null);
  const [editedProd, setEditedProd] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dummy data history
  const [historyOutputDummy, setHistoryOutputDummy] = useState([
    { tanggal: "2025-08-01", output1: 100, output2: 200 },
    { tanggal: "2025-08-02", output1: 150, output2: 250 },
  ]);

  const toggleModal = (row) => {
    setSelectedProdRow(row);
    setEditedProd({ ...row });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    // Hitung total output dari history
    const totalOutput = historyOutputDummy.reduce(
      (acc, row) => acc + Number(row.output1) + Number(row.output2),
      0
    );

    const updatedRow = {
      ...editedProd,
      prodOutput: totalOutput, // simpan hasil perhitungan ke row
    };

    // Update prodList agar DataTable ikut berubah
    setProdList((prevList) =>
      prevList.map((item) =>
        item.prodID === editedProd.prodID ? updatedRow : item
      )
    );

    setSelectedProdRow(updatedRow);
    setIsEditMode(false);
    setModalOpen(false);
  };

  const filteredData = prodList.filter((item) =>
    Object.keys(filters).every(
      (key) =>
        !filters[key] ||
        item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5 className="mb-0">Production Plan & Monitoring List</H5>
        <Filter className="cursor-pointer" onClick={toggleFilter} size={18} />
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
          columns={prodColumns(toggleModal)}
          data={filteredData}
          striped
          center
          pagination
          noDataComponent="No records found"
        />

        {/* Modal Detail */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            {selectedProdRow?.prodID} - Details
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
                        value={editedProd.prodName}
                        onChange={(e) =>
                          setEditedProd({
                            ...editedProd,
                            prodName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProdRow.prodName
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>Machine:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        value={editedProd.prodMC}
                        onChange={(e) =>
                          setEditedProd({
                            ...editedProd,
                            prodMC: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProdRow.prodMC
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <strong>Qty Plan:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={editedProd.prodPlan}
                        onChange={(e) =>
                          setEditedProd({
                            ...editedProd,
                            prodPlan: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProdRow.prodPlan
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>MC Status:</strong>
                    <br />
                    {isEditMode ? (
                      <Input
                        type="select"
                        value={editedProd.prodMCStatus}
                        onChange={(e) =>
                          setEditedProd({
                            ...editedProd,
                            prodMCStatus: e.target.value,
                          })
                        }
                      >
                        <option>Running</option>
                        <option>Setting</option>
                        <option>Repair</option>
                        <option>Stop</option>
                      </Input>
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
                  {isEditMode && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {historyOutputDummy.map((row, index) => {
                  const total = Number(row.output1) + Number(row.output2);
                  return (
                    <tr key={index}>
                      <td>
                        {isEditMode ? (
                          <Input
                            type="date"
                            value={row.tanggal}
                            onChange={(e) => {
                              const newHistory = [...historyOutputDummy];
                              newHistory[index].tanggal = e.target.value;
                              setHistoryOutputDummy(newHistory);
                            }}
                          />
                        ) : (
                          row.tanggal
                        )}
                      </td>
                      <td>
                        {isEditMode ? (
                          <Input
                            type="number"
                            value={row.output1}
                            onChange={(e) => {
                              const newHistory = [...historyOutputDummy];
                              newHistory[index].output1 = Number(
                                e.target.value
                              );
                              setHistoryOutputDummy(newHistory);
                            }}
                          />
                        ) : (
                          row.output1.toLocaleString()
                        )}
                      </td>
                      <td>
                        {isEditMode ? (
                          <Input
                            type="number"
                            value={row.output2}
                            onChange={(e) => {
                              const newHistory = [...historyOutputDummy];
                              newHistory[index].output2 = Number(
                                e.target.value
                              );
                              setHistoryOutputDummy(newHistory);
                            }}
                          />
                        ) : (
                          row.output2.toLocaleString()
                        )}
                      </td>
                      <td>{total.toLocaleString()}</td>

                      {isEditMode && (
                        <td className="text-center">
                          <Button
                            color=""
                            size="sm"
                            onClick={() => {
                              const newHistory = historyOutputDummy.filter(
                                (_, i) => i !== index
                              );
                              setHistoryOutputDummy(newHistory);
                            }}
                          >
                            ❌
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}

                <tr className="fw-bold">
                  <td colSpan="3" className="text-end">
                    Grand Total
                  </td>
                  <td>
                    {historyOutputDummy
                      .reduce(
                        (acc, row) =>
                          acc + Number(row.output1) + Number(row.output2),
                        0
                      )
                      .toLocaleString()}
                  </td>
                  {isEditMode && <td></td>}
                </tr>

                {isEditMode && (
                  <tr>
                    <td
                      colSpan={isEditMode ? "5" : "4"}
                      className="text-center"
                    >
                      <Button
                        color="primary"
                        onClick={() =>
                          setHistoryOutputDummy([
                            ...historyOutputDummy,
                            { tanggal: "", output1: 0, output2: 0 },
                          ])
                        }
                      >
                        + Add Row
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>

          <ModalFooter className="d-flex justify-content-end mt-2">
            {isEditMode && (
              <Button color="success" onClick={handleUpdate}>
                Update
              </Button>
            )}
            <Button
              color={isEditMode ? "secondary" : "primary"}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Cancel Edit" : "Edit"}
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default ProductionPlanList;
