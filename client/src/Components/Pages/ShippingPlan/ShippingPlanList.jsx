import React, { useState, useEffect } from "react";
import {
  Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody,
  Row, Col, Table, Input
} from "reactstrap";
import DataTable from "react-data-table-component";
import TableColumnFilter from "../../Filter/TableColumnFilter";
import { H5 } from "../../../AbstractElements";
import useShippingPlans from "../../../Hooks/useShippingPlans";
import useShippingPlanDetail from "../../../Hooks/useShippingPlanDetail";
import { Filter } from "react-feather";
import useInvoices from "../../../Hooks/useInvoices";  // Import the invoices hook
import Select from 'react-select';  // Import Select if not already in scope (add to imports if needed)

const ShippingPlanList = () => {
  const { items: plans, fetchAll: fetchPlans, createOrUpdate: updatePlan } = useShippingPlans();
  const { items: details, fetchAll: fetchDetails, createOrUpdate: updateDetail } = useShippingPlanDetail();
  const { items: invoices, fetchAll: fetchInvoices } = useInvoices();  // Use invoices hook

  const [filters, setFilters] = useState({
    shipID: "",
    etdNKB: "",
    etaCust: "",
    bookingID: "",
    vesselID: "",
    contID: "",
    invNo: "",
    shipStatus: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPlan, setEditedPlan] = useState(null);
  const [editedDetails, setEditedDetails] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [usedInvoiceIds, setUsedInvoiceIds] = useState(new Set());  // Store used invoice IDs

  useEffect(() => {
    fetchPlans();
    fetchInvoices();  // Fetch invoices on component mount
  }, [fetchPlans, fetchInvoices]);

  // Compute used invoice IDs from existing plans
  useEffect(() => {
    const usedIds = new Set(plans.map(p => p.invoice_id).filter(id => id));
    setUsedInvoiceIds(usedIds);
  }, [plans]);

  const toggleModal = (plan) => {
    if (plan) {
      const { issuer_email, ...cleanPlan } = plan;
      setSelectedPlan(plan);
      // Ensure invoice_id is a number when initializing
      setEditedPlan({ ...cleanPlan, invoice_id: Number(cleanPlan.invoice_id) || '' });
      fetchDetails({ shipping_plan_id: plan.id });
      setEditMode(false);
    } else {
      setSelectedPlan(null);
      setEditedPlan(null);
    }
    setModalOpen((open) => !open);
  };

  useEffect(() => {
    if (details.length > 0) {
      setEditedDetails(details.map((d) => ({ ...d })));
    }
  }, [details]);

  const handlePlanFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceChange = (opt) => {
    setEditedPlan((prev) => ({ ...prev, invoice_id: opt ? opt.value : '' }));
  };

  const handleDetailFieldChange = (index, field, value, row = null) => {
    console.log(row)
    setEditedDetails((prev) => {
      const updated = [...prev];
      let updatedRow = { ...updated[index], [field]: value };
      if (field === "actual_quantity") {
        const cartonQty = row?.part_pack_carton_quantity || 1;
        console.log(cartonQty, 'carton qty ygy')
        const carton = Math.ceil(value / cartonQty);
        const pallete = Math.ceil(carton / 36);
        updatedRow = {
          ...updatedRow,
          actual_quantity: value,
          carton,
          pallete
        };
      }
      updated[index] = updatedRow;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      // Sanitize date fields to YYYY-MM-DD before saving
      const sanitizedPlan = {
        ...editedPlan,
        etd_nkb: editedPlan.etd_nkb ? editedPlan.etd_nkb.slice(0, 10) : null,
        etd_cust: editedPlan.etd_cust ? editedPlan.etd_cust.slice(0, 10) : null
      };
      // Exclude auto-managed fields like created_at, updated_at, etc.
      const { created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, ...planToSave } = sanitizedPlan;
      await updatePlan(planToSave);
      await Promise.all(
        editedDetails.map((d) =>
          updateDetail({
            id: d.id,
            shipping_plan_id: selectedPlan.id,
            actual_quantity: d.actual_quantity,
            carton: d.carton,
            pallete: d.pallete,
            purchase_order_detail_id: d.purchase_order_detail_id
          })
        )
      );
      setEditMode(false);
      fetchPlans();
      fetchDetails({ shipping_plan_id: selectedPlan.id });
    } catch (err) {
      console.error(err);
      alert("Failed to save updates");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // If it's an ISO string, slice to YYYY-MM-DD
    return dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
  };

  const columns = [
    {
      width: "12rem",
      name: "SHIPPING ID",
      selector: (row) => row.shipID,
      cell: (row) => (
        <Button color="link" onClick={() => toggleModal(row.__raw)}>
          {row.shipID}
        </Button>
      ),
      sortable: true,
    },
    { name: "ETD NKB", selector: (row) => row.etdNKB, sortable: true },
    { name: "ETA CUST", selector: (row) => row.etaCust, sortable: true },
    { name: "BOOKING NO.", selector: (row) => row.bookingID, sortable: true },
    { name: "VESSEL", selector: (row) => row.vesselID, sortable: true },
    { name: "CONTAINER", selector: (row) => row.contID, sortable: true },
    { name: "INVOICE NO.", selector: (row) => row.invNo, sortable: true },
    {
      name: "STATUS",
      selector: (row) => row.shipStatus,
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

  const tableData = plans.map((p) => ({
    shipID: p.id,
    etdNKB: p.etd_nkb,
    etaCust: p.etd_cust,
    bookingID: p.booking_number,
    vesselID: p.vessel_name,
    contID: p.container_name,
    invNo: invoices.find(inv => inv.id === Number(p.invoice_id))?.invoice_number || '',
    shipStatus: p.status,
    openQty: p.open_qty ?? 0,
    __raw: p,
  }));

  const filtered = tableData.filter((row) =>
    Object.entries(filters).every(
      ([key, val]) =>
        !val || row[key]?.toString().toLowerCase().includes(val.toLowerCase())
    )
  );

  // Filter invoice options, excluding used ones (but include current when editing)
  const availableInvoiceOptions = invoices
    .filter(inv => !usedInvoiceIds.has(inv.id) || (editMode && inv.id === editedPlan?.invoice_id))
    .map(inv => ({
      value: inv.id,
      label: inv.invoice_number
    }));

  return (
    <Card>
      <CardHeader className="card-no-border d-flex justify-content-between align-items-center">
        <H5>Shipping Plan List</H5>
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
        <DataTable columns={columns} data={filtered} striped pagination />
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader
            toggle={() => setModalOpen(false)}
            className="position-relative pe-5"
          >
            SHIPPING PLAN DETAILS – {selectedPlan?.id}
            <Button
              className="position-absolute top-50 end-0 translate-middle-y me-5"
              color={editMode ? "success" : "primary"}
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </ModalHeader>
          <ModalBody>
            {editedPlan && (
              <div className="mb-3">
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>ETD NKB:</strong>
                    <br />
                    {editMode ? (
                      <Input
                        type="date"
                        name="etd_nkb"
                        value={editedPlan.etd_nkb ? editedPlan.etd_nkb.slice(0, 10) : ""}
                        onChange={handlePlanFieldChange}
                      />
                    ) : (
                      formatDate(editedPlan.etd_nkb)
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>ETA CUST:</strong>
                    <br />
                    {editMode ? (
                      <Input
                        type="date"
                        name="etd_cust"
                        value={editedPlan.etd_cust ? editedPlan.etd_cust.slice(0, 10) : ""}
                        onChange={handlePlanFieldChange}
                      />
                    ) : (
                      formatDate(editedPlan.etd_cust)
                    )}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>BOOKING NO.:</strong>
                    <br />
                    {editMode ? (
                      <Input
                        name="booking_number"
                        value={editedPlan.booking_number || ""}
                        onChange={handlePlanFieldChange}
                      />
                    ) : (
                      editedPlan.booking_number
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>VESSEL:</strong>
                    <br />
                    {editMode ? (
                      <Input
                        name="vessel_name"
                        value={editedPlan.vessel_name || ""}
                        onChange={handlePlanFieldChange}
                      />
                    ) : (
                      editedPlan.vessel_name
                    )}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>CONTAINER:</strong>
                    <br />
                    {editMode ? (
                      <Input
                        name="container_name"
                        value={editedPlan.container_name || ""}
                        onChange={handlePlanFieldChange}
                      />
                    ) : (
                      editedPlan.container_name
                    )}
                  </Col>
                  <Col md={6}>
                    <strong>INVOICE NO.:</strong>
                    <br />
                    {editMode ? (
                      <Select
                        options={availableInvoiceOptions}
                        value={
                          editedPlan.invoice_id
                            ? {
                                value: Number(editedPlan.invoice_id),
                                label: invoices.find(inv => inv.id === Number(editedPlan.invoice_id))?.invoice_number || ''
                              }
                            : null
                        }
                        onChange={handleInvoiceChange}
                        isClearable
                        placeholder="Select an invoice..."
                      />
                    ) : (
                      invoices.find(inv => inv.id === Number(editedPlan.invoice_id))?.invoice_number || editedPlan.invoice_id
                    )}
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
                {editedDetails.map((d, idx) => {
                  const plusMinus = (d.actual_quantity || 0) - (d.original_quantity || 0);
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{d.part_code}</td>
                      <td>{d.part_name}</td>
                      <td>{d.original_quantity?.toLocaleString()}</td>
                      <td>
                        {editMode ? (
                          <Input
                            type="number"
                            value={d.actual_quantity || 0}
                            onChange={(e) =>
                              handleDetailFieldChange(
                                idx,
                                "actual_quantity",
                                parseInt(e.target.value, 10) || 0,
                                d
                              )
                            }
                          />
                        ) : (
                          d.actual_quantity?.toLocaleString()
                        )}
                      </td>
                      <td>{plusMinus.toLocaleString()}</td>
                      <td>{(d.carton || 0).toLocaleString()}</td>
                      <td>{(d.pallete || 0).toLocaleString()}</td>
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
export default ShippingPlanList;
