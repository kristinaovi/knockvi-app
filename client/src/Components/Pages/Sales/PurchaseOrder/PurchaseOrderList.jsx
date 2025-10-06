// File: src/components/Pages/Sales/PurchaseOrder/PurchaseOrderList.jsx
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import usePurchaseOrderDetails from "../../../../Hooks/usePurchaseOrderDetails";
import useParts from "../../../../Hooks/useParts";
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
  ModalFooter,
} from "reactstrap";
import axios from "../../../../api/axios";
import DataTable from "react-data-table-component";
import TableColumnFilter from "../../../Filter/TableColumnFilter";
import { PurchaseOrderTittle } from "../../../../Constant";
import { H5 } from "../../../../AbstractElements";
import { Filter } from "react-feather"; // import icon filter
import { toast } from "react-toastify"

// define your table columns
const poColumns = (onClickRow) => [
  {
    name: "Part Code",
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
    grow: 1,
    left: true,
  },
  {
    name: "Part Name",
    selector: (r) => r.partName,
    sortable: true,
    grow: 1,
    left: true,
  },
  {
    name: "PECGI PO",
    selector: (r) => r.pecgiPO,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "PPAP PO",
    selector: (r) => r.ppapPO,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "Request Date",
    selector: (r) => r.reqDateFormatted,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "PO Line",
    selector: (r) => r.poLine,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "Issued Qty",
    selector: (r) => r.issuedQty,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "Open Qty",
    selector: (r) => r.openQty,
    sortable: true,
    grow: 0.8,
    left: true,
  },
  {
    name: "Price",
    selector: (r) => r.pricePO,
    sortable: true,
    grow: 0.8,
    left: true,
    cell: (r) => {
      const val = Number(r.pricePO || 0);
      return `$ ${val.toFixed(4)}`; // format ke 0.000
    },
  },

  {
    name: "Status",
    selector: (row) => row.statusQty,
    sortable: true,
    grow: 0.5,
    left: true,
    cell: (row) => {
      const isClosed = Number(row.shipped_qty) == 0;
      return (
        <span className={`badge ${isClosed ? "bg-success" : "bg-warning"}`}>
          {isClosed ? "Closed" : "Open"}
        </span>
      );
    },
  },
];

const PurchaseOrderList = ({ statusFilter = "all" }) => {
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
    pricePO: "",
    statusQty: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // state baru untuk edit modal
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // ambil daftar parts supaya bisa lookup price berdasarkan part_id
  const { items: parts, fetchParts } = useParts();

  useEffect(() => {
    // fetch both purchase order details and parts once
    fetchAll();
    fetchParts();
  }, [fetchAll, fetchParts]);

  const filteredData = useMemo(() => {
    const tableData = (items || []).map((item) => {
      const openQty = item.open_quantity ?? 0;

      // cari part berdasarkan part_id (purchase_order_details.part_id)
      const matchedPart = (parts || []).find(
        (p) => Number(p.id) === Number(item.part_id)
      );

      // ambil price dari parts jika ada, fallback ke item.price atau 0
      const priceFromParts =
        matchedPart &&
        matchedPart.price !== undefined &&
        matchedPart.price !== null
          ? Number(matchedPart.price)
          : item.price !== undefined && item.price !== null
          ? Number(item.price)
          : 0;

      return {
        partID: item.part_code ?? item.part_id ?? "",
        partName: item.part_name ?? "",
        pecgiPO: item.pecgi_no ?? "",
        ppapPO: item.ppap_no ?? "",
        reqDateFormatted: item.request_date_formatted ?? "",
        reqDate: item.requested_date ?? "",
        poLine: item.line ?? "",
        issuedQty: item.original_quantity ?? 0,
        openQty: item.shipped_qty,
        shipped_qty: item.shipped_qty,
        pricePO: Number.isFinite(priceFromParts) ? priceFromParts : 0,
        statusQty: Number(item.shipped_qty) === 0 ? "Closed" : "Open",
        __raw: item,
      };
    });

    // apply column filters (search inputs)
    let result = tableData.filter((row) =>
      Object.entries(filters).every(
        ([key, val]) =>
          !val ||
          (row[key] !== undefined &&
            row[key] !== null &&
            row[key].toString().toLowerCase().includes(val.toLowerCase()))
      )
    );

    // apply statusFilter from parent tab (all / open / closed)
    if (statusFilter === "open") {
      result = result.filter((r) => r.statusQty === "Open");
    } else if (statusFilter === "closed") {
      result = result.filter((r) => r.statusQty === "Closed");
    }
    // if 'all' -> no extra filter

    return result;
  }, [items, filters, statusFilter, parts]);

  // 2. baru hitung total pakai filteredData
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => {
        acc.issued += Number(row.issuedQty) || 0;
        acc.open += Number(row.openQty) || 0;
        return acc;
      },
      { issued: 0, open: 0 }
    );
  }, [filteredData]);

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

  // Custom styles for DataTable: header full, cells single-line with ellipsis
  const customStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: 600,
        paddingLeft: "12px",
        paddingRight: "12px",
        whiteSpace: "normal", // biar judul kolom tidak "..."
        overflow: "visible",
        textOverflow: "unset",
        lineHeight: "1.2",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
        paddingLeft: "12px",
        paddingRight: "12px",
        whiteSpace: "nowrap", // isi tabel 1 baris
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  };

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
          className="support-table"
          columns={poColumns(onRowClick)}
          data={filteredData}
          striped
          pagination
          persistTableHead
        />

        <div className="mt-2 d-flex justify-content-end">
          <table className="table table-bordered w-auto">
            <tbody>
              <tr>
                <th>Total Issued</th>
                <td>{totals.issued}</td>
                <th>Total Open</th>
                <td>{totals.open}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal details */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            Details - {selectedRow?.partID}
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
                      {formatDate(selectedRow.reqDate)}
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
                  <th style={{ width: "25%" }}>Date</th>
                  <th style={{ width: "25%" }}>In/Out</th>
                  <th style={{ width: "25%" }}>Outstanding</th>
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
                                setFormData({
                                  ...formData,
                                  original_quantity: e.target.value,
                                })
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
          </ModalBody>
          <ModalFooter>
            <div className="d-flex justify-content-end mt-3 gap-2">
              {editMode ? (
                <>
                  <Button
                    style={{ minWidth: "100px" }}
                    color="success"
                    onClick={() => {
                      axios
                        .put(
                          `/purchase_order_details/${selectedRow.__raw.id}`,
                          formData
                        )
                        .then(() => {
                          alert("Data berhasil diupdate!");
                          setEditMode(false);
                          fetchAll(); // refresh tabel PO
                          setModalOpen(false);
                          toast.success("Edit PO Success")
                        })
                        .catch((err) => console.error(err));
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    style={{ minWidth: "100px" }}
                    color="danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin menghapus PO ini?"
                        )
                      ) {
                        axios
                          .delete(
                            `/purchase_order_details/${selectedRow.__raw.id}`
                          )
                          .then(() => {
                            alert("PO berhasil dihapus!");
                            toast.success("Delete PO Success")
                            setModalOpen(false);
                            fetchAll(); // refresh tabel PO
                          })
                          .catch((err) => console.error(err));
                      }
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    style={{ minWidth: "100px" }}
                    color="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  style={{ minWidth: "100px" }}
                  color="primary"
                  onClick={() => {
                    setFormData({
                      original_quantity: selectedRow?.issuedQty || "",
                      // kalau ada field lain, tambahkan di sini
                    });
                    setEditMode(true);
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default PurchaseOrderList;
