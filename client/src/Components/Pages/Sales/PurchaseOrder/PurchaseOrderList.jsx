// File: src/components/PurchaseOrderList.jsx
import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import DataTable from "react-data-table-component";
import TableColumnFilter from "../../../Filter/TableColumnFilter";
import { PurchaseOrderTittle } from "../../../../Constant";
import { H5 } from "../../../../AbstractElements";
import { Filter } from "react-feather"; // ⬅️ import filter icon

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
  name: "Status",
  cell: (row) => {
    const status = row.openQty > 0 ? "Open" : "Closed";
    return (
      <span
        style={{
          color: status === "Closed" ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {status}
      </span>
    );
  },
  sortable: true,
}
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
  const [showFilters, setShowFilters] = useState(false); // ⬅️ sama seperti ShippingPlanList

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // map API items → table rows
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
    statusQty: openQty === 0 ? "Closed" : "Open",  // ⬅️ logic status
    __raw: item,
  }
});

  const filteredData = tableData.filter((row) =>
    Object.entries(filters).every(
      ([key, val]) =>
        !val || row[key]?.toString().toLowerCase().includes(val.toLowerCase())
    )
  );

  const onRowClick = (row) => {
    setSelectedRow(row);
    fetchHistory(row.__raw.id);
    setModalOpen(true);
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
          onClick={() => setShowFilters((prev) => !prev)} // ⬅️ toggle filter
          size={18}
        />
      </CardHeader>

      <CardBody>
        {showFilters && ( // ⬅️ filter bar hanya muncul kalau toggle ON
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

        {/* Modal detail & history */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            {selectedRow?.partID} - Detail
          </ModalHeader>
          <ModalBody>
            {selectedRow && (
              <div className="mb-3">
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Part Name:</strong>
                    <br />
                    {selectedRow.partName}
                  </Col>
                  <Col md={6}>
                    <strong>Request Date:</strong>
                    <br />
                    {formatDate(selectedRow.reqDate)}
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <strong>PECGI PO:</strong>
                    <br />
                    {selectedRow.pecgiPO}
                  </Col>
                  <Col md={6}>
                    <strong>PPAP PO:</strong>
                    <br />
                    {selectedRow.ppapPO}
                  </Col>
                </Row>
              </div>
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
                        <td style={{ color }}>{qty}</td>
                        <td>{h.total}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default PurchaseOrderList;
