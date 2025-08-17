// src/components/ShippingPlanList.jsx
import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Table
} from "reactstrap"
import DataTable from "react-data-table-component"
import TableColumnFilter from "../../Filter/TableColumnFilter"
import { H5 } from "../../../AbstractElements"
import useShippingPlans from "../../../Hooks/useShippingPlans"
import useShippingPlanDetail from "../../../Hooks/useShippingPlanDetail"
import { Filter } from "react-feather"

const ShippingPlanList = () => {
  // ❌ hapus exportCsv
  const { items: plans, fetchAll: fetchPlans } = useShippingPlans()
  const { items: details, fetchAll: fetchDetails } = useShippingPlanDetail()

  const [filters, setFilters] = useState({
    shipID: "",
    etdNKB: "",
    etaCust: "",
    bookingID: "",
    vesselID: "",
    contID: "",
    invNo: "",
    shipStatus: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const toggleModal = plan => {
    if (plan) {
      setSelectedPlan(plan)
      fetchDetails({ shipping_plan_id: plan.id })
    } else {
      setSelectedPlan(null)
    }
    setModalOpen(open => !open)
  }

  const tableData = plans.map(p => ({
    shipID: p.id,
    etdNKB: p.etd_nkb,
    etaCust: p.etd_cust,
    bookingID: p.booking_number,
    vesselID: p.vessel_name,
    contID: p.container_name,
    invNo: p.invoice_id,
    shipStatus: p.status,
    __raw: p
  }))

  const filtered = tableData.filter(row =>
    Object.entries(filters).every(([key, val]) =>
      !val || row[key]?.toString().toLowerCase().includes(val.toLowerCase())
    )
  )

  const columns = [
    {
      width: "12rem",
      name: "SHIPPING ID",
      selector: row => row.shipID,
      cell: row => (
        <Button color="link" onClick={() => toggleModal(row.__raw)}>
          {row.shipID}
        </Button>
      ),
      sortable: true,
    },
    { name: "ETD NKB", selector: row => row.etdNKB, sortable: true },
    { name: "ETA CUST", selector: row => row.etaCust, sortable: true },
    { name: "BOOKING NO.", selector: row => row.bookingID, sortable: true },
    { name: "VESSEL", selector: row => row.vesselID, sortable: true },
    { name: "CONTAINER", selector: row => row.contID, sortable: true },
    { name: "INVOICE NO.", selector: row => row.invNo, sortable: true },
    { name: "STATUS", selector: row => row.shipStatus, sortable: true },
  ]

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5>Shipping Plan List</H5>
        <div className="d-flex gap-2 align-items-center">
          {/* ❌ Hapus tombol Export CSV */}
          <Filter
            className="cursor-pointer"
            onClick={() => setShowFilters(prev => !prev)}
            size={18}
          />
        </div>
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
          columns={columns}
          data={filtered}
          striped
          pagination
        />

        {/* Modal detail */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            SHIPPING PLAN DETAILS – {selectedPlan?.id}
          </ModalHeader>

          <ModalBody>
            {selectedPlan && (
              <div className="mb-3">
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>ETD NKB:</strong><br />
                    {selectedPlan.etd_nkb}
                  </Col>
                  <Col md={6}>
                    <strong>ETA CUST:</strong><br />
                    {selectedPlan.etd_cust}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>BOOKING NO.:</strong><br />
                    {selectedPlan.booking_number}
                  </Col>
                  <Col md={6}>
                    <strong>VESSEL:</strong><br />
                    {selectedPlan.vessel_name}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>CONTAINER:</strong><br />
                    {selectedPlan.container_name}
                  </Col>
                  <Col md={6}>
                    <strong>INVOICE NO.:</strong><br />
                    {selectedPlan.invoice_id}
                  </Col>
                </Row>
              </div>
            )}

            <Table bordered responsive className="mt-4">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>PART CODE</th>
                  <th>PART NAME</th>
                  <th>QTY PLAN</th>
                  <th>QTY ACTUAL</th>
                  <th>+/-</th>
                  <th>CARTON</th>
                  <th>PALLET</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, idx) => {
                  const plusMinus = d.actual_quantity - d.original_quantity
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{d.part_code}</td>
                      <td>{d.part_name}</td>
                      <td>{d.original_quantity?.toLocaleString()}</td>
                      <td>{d.actual_quantity?.toLocaleString()}</td>
                      <td>{plusMinus.toLocaleString()}</td>
                      <td>{d.carton.toLocaleString()}</td>
                      <td>{d.pallete.toLocaleString()}</td>
                    </tr>
                  )
                })}
                <tr className="fw-bold">
                  <td></td>
                  <td colSpan="2" className="text-end">Grand Total</td>
                  <td>{details.reduce((s, d) => s + d.original_quantity, 0).toLocaleString()}</td>
                  <td>{details.reduce((s, d) => s + d.actual_quantity, 0).toLocaleString()}</td>
                  <td>{details.reduce((s, d) => s + (d.actual_quantity - d.original_quantity), 0).toLocaleString()}</td>
                  <td>{details.reduce((s, d) => s + d.carton, 0).toLocaleString()}</td>
                  <td>{details.reduce((s, d) => s + d.pallete, 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  )
}

export default ShippingPlanList
