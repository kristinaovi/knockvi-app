import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  ModalFooter,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";
import TableColumnFilter from "../../Filter/TableColumnFilter";
import { Filter } from "react-feather";
import useInventory from "../../../Hooks/useInventory";

const inventoryColumns = (onClickProdID) => [
  {
    name: "Part Code",
    selector: (row) => row.part_code,
    cell: (row) => (
      <button
        className="btn btn-link p-0 text-primary"
        onClick={() => onClickProdID(row)}
      >
        {row.part_code}
      </button>
    ),
    sortable: true,
  },
  { name: "Part Name", selector: (row) => row.part_name, sortable: true },
  { name: "Total Stock", selector: (row) => row.total_stock, sortable: true },
  { name: "Finish Good", selector: (row) => row.finish_good, sortable: true },
  { name: "Carton", selector: (row) => row.carton, sortable: true },
];

const InventoryList = () => {
  const { items: inventory, fetchInventory } = useInventory();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdRow, setSelectedProdRow] = useState(null);
  const [editedProd, setEditedProd] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchInventory(); // ✅ ini sekarang hit ke /inventory di backend
  }, [fetchInventory]);

  const toggleModal = (row) => {
    setSelectedProdRow(row);
    setEditedProd({ ...row });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const filteredData = inventory.filter((item) =>
    Object.keys(filters).every(
      (key) =>
        !filters[key] ||
        item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Hitung total
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => {
        acc.totalStock += Number(row.total_stock) || 0;
        acc.finishGood += Number(row.finish_good) || 0;
        return acc;
      },
      { totalStock: 0, finishGood: 0 }
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5 className="mb-0">Inventory List</H5>
        <Filter
          className="cursor-pointer"
          onClick={() => setShowFilters((prev) => !prev)}
          size={18}
        />
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
          className="support-table"
          columns={inventoryColumns(toggleModal)}
          data={filteredData}
          striped
          center
          pagination
          persistTableHead
        />

        {/* Tabel total */}
        <div className="mt-2 d-flex justify-content-end">
          <table className="table table-bordered w-auto">
            <tbody>
              <tr>
                <th>Total Stock</th>
                <td>{totals.totalStock}</td>
                <th>Total Finish Good</th>
                <td>{totals.finishGood}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Detail */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            Details - {selectedProdRow?.part_code} -{" "}
            {selectedProdRow?.part_name}
          </ModalHeader>
          <ModalBody>
            <Table bordered responsive className="mt-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Stock</th>
                  <th>Finish Good</th>
                  <th>Carton</th>
                </tr>
              </thead>
              <tbody>
                {selectedProdRow && (
                  <tr>
                    {/* ✅ Format date biar rapi */}
                    <td>
                      {selectedProdRow.updated_at
                        ? new Date(
                            selectedProdRow.updated_at
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>{selectedProdRow.total_stock}</td>
                    <td>{selectedProdRow.finish_good}</td>
                    <td>{selectedProdRow.carton}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            {isEditMode ? (
              <>
                <Button color="success">Save</Button>
                <Button color="secondary" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button color="primary" onClick={() => setIsEditMode(true)}>
                Edit
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default InventoryList;
