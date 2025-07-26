import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { supportData } from "../../../Data/ShippingPlan";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";

const ShippingPlanList = () => {
  const [modal, setModal] = useState(false);
  const [selectedShipID, setSelectedShipID] = useState(null);

  // Kolom filter state
  const [filters, setFilters] = useState({
    shipID: "",
    totalQty: "",
    etdNKB: "",
    etaCust: "",
    bookingID: "",
    vesselID: "",
    contID: "",
    invNo: "",
    shipStatus: "",
  });

  const toggleModal = (id = null) => {
    setSelectedShipID(id);
    setModal(!modal);
  };

  // Filter per kolom
  const filteredData = supportData.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Komponen filter input
  const FilterInput = ({ column }) => (
    <input
      type="text"
      className="form-control form-control-sm"
      placeholder={`Filter ${column}`}
      value={filters[column]}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, [column]: e.target.value }))
      }
    />
  );

  const customColumns = [
    {
      width: "12rem",
      name: "SHIPPING ID",
      selector: (row) => row.shipID,
      cell: (row) => (
        <Button color="link" onClick={() => toggleModal(row.shipID)}>
          {row.shipID}
        </Button>
      ),
      sortable: true,
    },
    { name: "QUANTITY", selector: (row) => row["totalQty"], sortable: true },
    { name: "ETD NKB", selector: (row) => row["etdNKB"], sortable: true },
    { name: "ETA CUST", selector: (row) => row["etaCust"], sortable: true },
    { name: "BOOKING NO.", selector: (row) => row["bookingID"],sortable: true},
    { name: "VESSEL", selector: (row) => row["vesselID"], sortable: true },
    { name: "CONTAINER", selector: (row) => row["contID"], sortable: true },
    { name: "INVOICE NO.", selector: (row) => row["invNo"], sortable: true },
    { name: "STATUS", selector: (row) => row["shipStatus"], sortable: true },
  ];

  return (
    <Card>
      <CardHeader className="card-no-border">
        <H5>Shipping Plan List</H5>
      </CardHeader>
      <CardBody className="pt-0">
        <DataTable
          columns={customColumns}
          data={filteredData}
          striped
          pagination
          noDataComponent="No records found"
          subHeader
          subHeaderComponent={
            <div className="w-100">
              <div className="row">
                {Object.keys(filters).map((key) => (
                  <div className="col" key={key}>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      placeholder={`Filter ${key.toUpperCase()}`}
                      value={filters[key]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <Modal isOpen={modal} toggle={() => toggleModal(null)} size="lg">
          <ModalHeader toggle={() => toggleModal(null)}>
            Detail Shipping ID: {selectedShipID}
          </ModalHeader>
          <ModalBody>
            {/* Ganti isi ini sesuai kebutuhan */}
            <p>Data detail untuk Shipping ID <b>{selectedShipID}</b> akan ditampilkan di sini.</p>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default ShippingPlanList;
