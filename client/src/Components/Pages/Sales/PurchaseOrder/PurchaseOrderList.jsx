// File: src/components/Pages/Sales/PurchaseOrder/PurchaseOrderList.jsx
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import usePurchaseOrderDetails from "../../../../Hooks/usePurchaseOrderDetails";
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import axios from '../../../../api/axios'
import DataTable from "react-data-table-component";
import TableColumnFilter from "../../../Filter/TableColumnFilter";
import { PurchaseOrderTittle } from "../../../../Constant";
import { H5 } from "../../../../AbstractElements";
import { Filter } from "react-feather"; // import icon filter

// define your table columns
const poColumns = (onClickRow) => [
  {
    name: "PART Code",
    selector: (r) => r.partID,
    cell: (r) => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickRow(r)}
      >
        {r.partID}
      </button>
    ),
    sortable: true,
  },
  { name: "PART NAME", selector: (r) => r.partName, sortable: true },
  { name: "PECGI PO", selector: (r) => r.pecgiPO, sortable: true },
  { name: "PPAP PO", selector: (r) => r.ppapPO, sortable: true },
  { name: "REQUEST DATE", selector: (r) => r.reqDateFormatted, sortable: true },
  { name: "PO LINE", selector: (r) => r.poLine, sortable: true },
  { name: "ISSUED QTY", selector: (r) => r.issuedQty, sortable: true },
  { name: "OPEN QTY", selector: (r) => r.openQty, sortable: true },
  {
    name: "STATUS",
    selector: (row) => row.statusQty,
    sortable: true,
    cell: (row) => {
      const isClosed = row.openQty === 0;
      return (
        <span className={`badge ${isClosed ? "bg-success" : "bg-warning"}`}>
          {isClosed ? "Closed" : "Open"}
        </span>
      );
    },
  },
];

const PurchaseOrderList = () => {
  const {
    items,
    fetchAll,
    item: history,
    fetchOne: fetchHistory,
  } = usePurchaseOrderDetails();

  const [filters, setFilters] = useState({
    partID: "",
    partName: "",
    pecgiPO: "",
    ppapPO: "",
    reqDate: "",
    poLine: "",
    issuedQty: "",
    openQty: "",
    statusQty: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // state baru untuk edit modal
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredData = useMemo(() => {
  const tableData = items.map((item) => {
    const openQty = item.open_quantity;
    return {
      partID: item.part_code,
      partName: item.part_name,
      pecgiPO: item.pecgi_no,
      ppapPO: item.ppap_no,
      reqDateFormatted: item.request_date_formatted,
      reqDate: item.request_date,
      poLine: item.line,
      issuedQty: item.original_quantity,
      openQty: openQty,
      statusQty: openQty === 0 ? "Closed" : "Open",
      __raw: item,
    };
  });

  return tableData.filter((row) =>
    Object.entries(filters).every(
      ([key, val]) =>
        !val || row[key]?.toString().toLowerCase().includes(val.toLowerCase())
    )
  );
}, [items, filters]);

  const onRowClick = (row) => {
    setSelectedRow(row);
    fetchHistory(row.__raw.id);
    setModalOpen(true);
    setEditMode(false); // reset edit mode
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5 className="mb-0">{PurchaseOrderTittle}</H5>
        <Filter
          className="cursor-pointer"
          onClick={() => setShowFilters((prev) => !prev)}
          size={18}
        />
      </CardHeader>

      <CardBody>
        {showFilters && (
          <Row className="mb-3">
            <Col>
              <TableColumnFilter filters={filters} setFilters={setFilters} />
            </Col>
          </Row>
        )}

        <DataTable
          columns={poColumns(onRowClick)}
          data={filteredData}
          striped
          pagination
        />

        {/* Modal details */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            {selectedRow?.partID} - Detail
          </ModalHeader>
          <ModalBody>
            {selectedRow && (
              <Form>
                <Row className="mb-2">
                  <Col md={6}>
                    <FormGroup>
                      <strong>Part Name:</strong>
                      <br />
                        {selectedRow.partName}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <strong>Request Date:</strong>
                      <br />
                       { formatDate(selectedRow.reqDate)}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <strong>PECGI PO:</strong>
                      <br />
                        {selectedRow.pecgiPO}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <strong>PPAP PO:</strong>
                      <br />
                        {selectedRow.ppapPO}
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}

            <Table bordered responsive className="mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In/Out</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(history) &&
                  history.map((h, i) => {
                    const date = formatDate(h.date);
                    const qty = h.type === "IN" ? h.quantity : -h.quantity;
                    const color = h.type === "IN" ? "green" : "red";
                    return (
                      <tr key={i}>
                        <td>{date}</td>
                        <td style={{ color }}>
                          {editMode ? (
                            <Input
                              type="text"
                              value={formData.original_quantity}
                              onChange={(e) =>
                                setFormData({ ...formData, original_quantity: e.target.value })
                              }
                            />
                          ) : (
                            qty
                          )}
                        </td>
                        <td>{h.total}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>

            <div className="d-flex justify-content-end mt-3 gap-2">
              {editMode ? (
                <Button
                  color="success"
                  onClick={() => {
                    axios
                      .put(`/purchase_order_details/${selectedRow.__raw.id}`, formData)
                      .then(() => {
                        alert("Data berhasil diupdate!");
                        setEditMode(false);
                        fetchAll(); // refresh tabel PO
                        setModalOpen(false);
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={() => {
                    setFormData({
                      original_quantity: selectedRow.issuedQty,
                    });
                    setEditMode(true);
                  }}
                >
                  Edit
                </Button>
              )}
              <Button
                color="danger"
                onClick={() => {
                  if (window.confirm("Apakah Anda yakin ingin menghapus PO ini?")) {
                    axios
                      .delete(`/purchase_order_details/${selectedRow.__raw.id}`)
                      .then(() => {
                        alert("PO berhasil dihapus!");
                        setModalOpen(false);
                        fetchAll(); // refresh tabel PO
                      })
                      .catch((err) => console.error(err));
                  }
                }}
              >
                Hapus
              </Button>
              {editMode && (
                <Button color="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default PurchaseOrderList;
