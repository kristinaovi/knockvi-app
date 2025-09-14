import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Select from "react-select";
import useShippingPlans from "../../../Hooks/useShippingPlans";
import useShippingPlanDetail from "../../../Hooks/useShippingPlanDetail";
import usePurchaseOrderDetails from "../../../Hooks/usePurchaseOrderDetails";
import useParts from "../../../Hooks/useParts";
import useInvoices from "../../../Hooks/useInvoices"; // Add this import for invoices

const NewShippingPlan = ({ isOpen, toggle }) => {
  const { items: existingPlans, fetchAll: fetchPlans } = useShippingPlans(); // Fetch existing plans to compute used invoices
  const { createOrUpdate: saveSP } = useShippingPlans();
  const { createOrUpdate: saveSPD } = useShippingPlanDetail();
  const {
    items: poDetails,
    fetchAll: fetchPODetails,
    fetchOne: fetchHistory,
    item: selectedPODetail,
  } = usePurchaseOrderDetails();
  const { items: parts, fetchParts } = useParts();
  const { items: invoices, fetchAll: fetchInvoices } = useInvoices(); // Use invoices hook

  const [shippingInfo, setShippingInfo] = useState({
    etd_nkb: "",
    booking_number: "",
    container_name: "",
    etd_cust: "",
    vessel_name: "",
    invoice_id: "",
  });

  const initialRow = {
    POD: "",
    partName: "",
    price: 0,
    quantityPlan: 0,
    cartonPlan: 0,
    palletePlan: 0,
    actualQuantity: "",
    cartonActual: 0,
    palleteActual: 0,
  };

  const [draftRows, setDraftRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [usedInvoiceIds, setUsedInvoiceIds] = useState(new Set()); // Store used invoice IDs

  useEffect(() => {
    setDraftRows([]);
    fetchPODetails({ request_date: shippingInfo.etd_cust });
  }, [shippingInfo.etd_cust, fetchPODetails]);

  useEffect(() => {
    fetchParts();
    fetchInvoices(); // Fetch invoices on mount
    fetchPlans(); // Fetch existing plans to compute used invoices
  }, [fetchParts, fetchInvoices, fetchPlans]);

  // Compute used invoice IDs from existing plans
  useEffect(() => {
    const usedIds = new Set(
      existingPlans.map((p) => p.invoice_id).filter((id) => id)
    );
    setUsedInvoiceIds(usedIds);
  }, [existingPlans]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvoiceChange = (opt) => {
    setShippingInfo((prev) => ({ ...prev, invoice_id: opt ? opt.value : "" }));
  };

  const startAddNewRow = () => {
    setDraftRows((dr) => [...dr, { ...initialRow }]);
  };

  const cancelNewRow = (index) => {
    setDraftRows((dr) => dr.filter((_, i) => i !== index));
  };

  const handleDraftRowChange = async (index, field, value) => {
  const next = [...draftRows];
  const row = { ...next[index] };

  if (field === "POD") {
    const detail = poDetails.find((d) => d.id === value);
    if (detail) {
      const part = parts.find((p) => p.id === detail.part_id) || {};
      const cartonQty = part.pack_carton_quantity || 1;

      row.partName = part.name || "";
      row.price = detail.price;
      row.cartonPlan = Math.ceil(detail.original_quantity / cartonQty);
      row.palletePlan = Math.ceil(row.cartonPlan / 36);

      // await history fetch and get returned data
      const historyData = await fetchHistory(value);

      // safely compute quantityPlan from the last item
      row.quantityPlan = Object.values(historyData).at(-1)?.total || 0;

      // if needed, update carton/pallete based on quantityPlan
      row.cartonPlan = Math.ceil(row.quantityPlan / cartonQty);
      row.palletePlan = Math.ceil(row.cartonPlan / 36);
    }
  }

  if (field === "actualQuantity") {
    const part = parts.find((p) => p.name === row.partName) || {};
    const cartonQty = part.pack_carton_quantity || 1;
    row.cartonActual = Math.ceil(value / cartonQty);
    row.palleteActual = Math.ceil(row.cartonActual / 36);
  }

  row[field] = value;
  next[index] = row;
  setDraftRows(next);
};


  const saveDraftRow = (index) => {
    const row = draftRows[index];
    if (!row.POD) {
      return alert("Please select a PO item.");
    }
    setTableData((td) => [...td, row]);
    cancelNewRow(index);
  };

  const handleSaveAll = async () => {
    try {
      // Sanitize date fields to YYYY-MM-DD before saving
      const sanitizedInfo = {
        ...shippingInfo,
        etd_nkb: shippingInfo.etd_nkb
          ? shippingInfo.etd_nkb.slice(0, 10)
          : null,
        etd_cust: shippingInfo.etd_cust
          ? shippingInfo.etd_cust.slice(0, 10)
          : null,
      };

      const { id: spId } = await saveSP(sanitizedInfo);
      await Promise.all(
        tableData.map((row) =>
          saveSPD({
            shipping_plan_id: spId,
            purchase_order_detail_id: row.POD,
            actual_quantity: row.actualQuantity,
            carton: row.cartonActual,
            pallete: row.palleteActual,
          })
        )
      );
      setTableData([]);
      setShippingInfo({
        etd_nkb: "",
        booking_number: "",
        container_name: "",
        etd_cust: "",
        vessel_name: "",
        invoice_id: "",
      });
      toggle();
    } catch (err) {
      console.error(err);
      alert("Failed to save shipping plan");
    }
  };

  // Filter invoice options, excluding used ones (no current since this is new)
  const availableInvoiceOptions = invoices
    .filter((inv) => !usedInvoiceIds.has(inv.id))
    .map((inv) => ({
      value: inv.id,
      label: inv.invoice_number,
    }));

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Shipping Plan</ModalHeader>
      <ModalBody>
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>ETD NKB</strong>
              </Label>
              <Input
                type="date"
                name="etd_nkb"
                value={shippingInfo.etd_nkb}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Booking No</strong>
              </Label>
              <Input
                name="booking_number"
                value={shippingInfo.booking_number}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Container</strong>
              </Label>
              <Input
                name="container_name"
                value={shippingInfo.container_name}
                onChange={handleShippingChange}
              />
            </FormGroup>
          </div>
          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>ETA Cust</strong>
              </Label>
              <Input
                type="date"
                name="etd_cust"
                value={shippingInfo.etd_cust}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Vessel</strong>
              </Label>
              <Input
                name="vessel_name"
                value={shippingInfo.vessel_name}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Invoice No</strong>
              </Label>
              <Select
                options={availableInvoiceOptions}
                value={
                  shippingInfo.invoice_id
                    ? {
                        value: Number(shippingInfo.invoice_id),
                        label:
                          invoices.find(
                            (inv) => inv.id === Number(shippingInfo.invoice_id)
                          )?.invoice_number || "",
                      }
                    : null
                }
                onChange={handleInvoiceChange}
                isClearable
                placeholder="Select an invoice..."
              />
            </FormGroup>
          </div>
        </Form>
        <div className="table-responsive">
          <Table bordered striped>
            <thead>
              <tr>
                <th>PO Item</th>
                <th>Price</th>
                <th>Plan Qty</th>
                <th>Plan Carton</th>
                <th>Plan Pallete</th>
                <th>Actual Qty</th>
                <th>Actual Carton</th>
                <th>Actual Pallete</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td>{poDetails.find((d) => d.id === row.POD)?.part_name}</td>
                  <td>{row.price}</td>
                  <td>{row.quantityPlan}</td>
                  <td>{row.cartonPlan}</td>
                  <td>{row.palletePlan}</td>
                  <td>{row.actualQuantity}</td>
                  <td>{row.cartonActual}</td>
                  <td>{row.palleteActual}</td>
                  <td>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() =>
                        setTableData((td) => td.filter((_, i) => i !== idx))
                      }
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
              {draftRows.map((row, idx) => (
                <tr key={`draft-${idx}`}>
                  <td style={{ minWidth: 200 }}>
                    <Select
                      options={poDetails.map((d) => ({
                        value: d.id,
                        label: `${d.part_code} - ${d.part_name}`,
                      }))}
                      isDisabled={!shippingInfo.etd_cust}
                      placeholder={
                        shippingInfo.etd_cust
                          ? "Select PO item…"
                          : "Pick ETA Cust first"
                      }
                      value={
                        row.POD
                          ? {
                              value: row.POD,
                              label: poDetails.find((d) => d.id === row.POD)
                                ?.part_name,
                            }
                          : null
                      }
                      onChange={(opt) =>
                        handleDraftRowChange(idx, "POD", opt.value)
                      }
                    />
                  </td>
                  <td>
                    <Input readOnly value={row.price} />
                  </td>
                  <td>
                    <Input readOnly value={row.quantityPlan} />
                  </td>
                  <td>
                    <Input readOnly value={row.cartonPlan} />
                  </td>
                  <td>
                    <Input readOnly value={row.palletePlan} />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={row.actualQuantity}
                      onChange={(e) =>
                        handleDraftRowChange(
                          idx,
                          "actualQuantity",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input readOnly value={row.cartonActual} />
                  </td>
                  <td>
                    <Input readOnly value={row.palleteActual} />
                  </td>
                  <td>
                    {Number(row.quantityPlan) !== 0 ? (
                      <>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => saveDraftRow(idx)}
                        >
                          ✓
                        </Button>{" "}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => cancelNewRow(idx)}
                        >
                          ×
                        </Button>
                      </>
                    ) : (
                      <span>No Open PO Quantity Remain!</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="9" className="text-center">
                  <Button color="primary" size="sm" onClick={startAddNewRow}>
                    + Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="text-end mt-3">
          <Button color="success" onClick={handleSaveAll}>
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default NewShippingPlan; 
