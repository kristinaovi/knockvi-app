// src/components/Pages/Sales/ShippingPlan/NewShippingPlan.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import useShippingPlans from "../../../Hooks/useShippingPlans";
import useShippingPlanDetail from "../../../Hooks/useShippingPlanDetail";
import usePurchaseOrderDetails from "../../../Hooks/usePurchaseOrderDetails";
import useParts from "../../../Hooks/useParts";
import useInvoices from "../../../Hooks/useInvoices";
import { PencilOff, Check, X } from "lucide-react";
import { PlusCircle } from "react-feather";

/**
 * NewShippingPlan
 * - preserves Check / X / PencilOff controls
 * - saves header then saves every table row into shipping_plan_detail
 * - disables ETA options that already used by existing shipping plans
 * - disallows adding PO rows that are already used (either by the selected ETA group or already saved SPD)
 */

const NewShippingPlan = ({ isOpen, toggle }) => {
  // hooks
  const {
    items: existingPlans = [],
    fetchAll: fetchPlans,
    createOrUpdate: saveSP,
  } = useShippingPlans();
  const {
    items: allSPDetails = [],
    fetchAll: fetchSPDAll,
    createOrUpdate: saveSPD,
  } = useShippingPlanDetail();
  const {
    items: poDetails = [],
    fetchAll: fetchPODetails,
    fetchOne: fetchHistory,
  } = usePurchaseOrderDetails();
  const { items: parts = [], fetchParts } = useParts();
  const { items: invoices = [], fetchAll: fetchInvoices } = useInvoices();

  // form state
  const [shippingInfo, setShippingInfo] = useState({
    etd_nkb: "",
    booking_number: "",
    container_name: "",
    etd_cust: "", // YYYY-MM-DD
    vessel_name: "",
    invoice_id: "",
  });

  // table + drafts
  const initialRow = {
    POD: "",
    partName: "",
    quantityPlan: 0,
    cartonPlan: 0,
    palletePlan: 0,
    actualQuantity: "",
    cartonActual: 0,
    palleteActual: 0,
  };
  const [tableData, setTableData] = useState([]); // rows from selected ETA cust
  const [draftRows, setDraftRows] = useState([]); // manual add rows

  // bookkeeping sets
  const [usedInvoiceIds, setUsedInvoiceIds] = useState(new Set()); // invoices already used in existing plans
  const [usedPODIds, setUsedPODIds] = useState(new Set()); // POD ids already used in saved shipping_plan_detail

  // initial fetch
  useEffect(() => {
    fetchPODetails();
    fetchParts();
    fetchInvoices();
    fetchPlans();
    // fetch all SPD so we know already-used POD ids
    fetchSPDAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive used invoice ids from existingPlans
  useEffect(() => {
    const used = new Set(
      (existingPlans || [])
        .map((p) => (p.invoice_id != null ? Number(p.invoice_id) : null))
        .filter(Boolean)
    );
    setUsedInvoiceIds(used);
  }, [existingPlans]);

  // derive used POD ids from allSPDetails (hook items)
  useEffect(() => {
    if (Array.isArray(allSPDetails)) {
      const used = new Set(
        allSPDetails
          .map((d) =>
            d.purchase_order_detail_id != null
              ? Number(d.purchase_order_detail_id)
              : null
          )
          .filter(Boolean)
      );
      setUsedPODIds(used);
    }
  }, [allSPDetails]);

  // used ETA dates (YYYY-MM-DD) set (can't be picked again)
  const usedEtaSet = useMemo(() => {
    const s = new Set();
    for (const p of existingPlans || []) {
      if (p && p.etd_cust) {
        s.add(String(p.etd_cust).slice(0, 10));
      }
    }
    return s;
  }, [existingPlans]);

  // autofill invoice fields when invoice selected
  useEffect(() => {
    if (!shippingInfo.invoice_id) {
      // clear fields until invoice chosen
      setShippingInfo((prev) => ({
        etd_nkb: "",
        booking_number: "",
        container_name: "",
        etd_cust: "",
        vessel_name: "",
        invoice_id: prev.invoice_id ?? "",
      }));
      setTableData([]);
      setDraftRows([]);
      return;
    }
    const inv = invoices.find((i) => Number(i.id) === Number(shippingInfo.invoice_id));
    if (!inv) return;
    setShippingInfo((prev) => ({
      ...prev,
      booking_number: inv.booking_no ?? "",
      container_name: inv.container ?? "",
      vessel_name: inv.vessel_flight ?? "",
      etd_nkb: inv.etd_nkb ? String(inv.etd_nkb).slice(0, 10) : "",
    }));
    // tableData remains until user picks ETA cust or clears invoice
  }, [shippingInfo.invoice_id, invoices]);

  const handleInvoiceChange = (opt) => {
    setShippingInfo((prev) => ({ ...prev, invoice_id: opt ? opt.value : "" }));
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // request date options (unique) for ETA Cust
  const requestDateOptions = useMemo(() => {
    if (!Array.isArray(poDetails)) return [];
    const seen = new Set();
    const opts = [];
    for (const d of poDetails) {
      const rdRaw = d.request_date ?? d.request_date_formatted ?? null;
      if (!rdRaw) continue;
      const key = String(rdRaw).slice(0, 10); // YYYY-MM-DD
      if (!seen.has(key)) {
        seen.add(key);
        opts.push({ value: key, label: formatDateLabel(key) });
      }
    }
    opts.sort((a, b) => new Date(a.value) - new Date(b.value));
    return opts;
  }, [poDetails]);

  // manualOptions for add-row select:
  // exclude: PO with same request date as selected ETA, PO already selected in table/drafts, PO already used in SPD
const manualOptions = useMemo(() => {
  if (!Array.isArray(poDetails)) return [];

  const selectedPODIds = new Set([
    ...(tableData || []).map((r) => Number(r.POD)).filter(Boolean),
    ...(draftRows || []).map((r) => Number(r.POD)).filter(Boolean),
  ]);

  const selectedEta = shippingInfo.etd_cust
    ? String(shippingInfo.etd_cust).slice(0, 10)
    : null;

  return poDetails
    .filter((d) => {
      const rdRaw = d.request_date ?? d.request_date_formatted ?? "";
      if (!rdRaw) return false;
      const rd = String(rdRaw).slice(0, 10);

      // ❌ exclude semua PO dengan tanggal sama dengan ETA Cust yang dipilih
      if (selectedEta && rd === selectedEta) return false;

      // ❌ exclude semua PO dengan tanggal sama ETA Cust yang sudah dipakai plan lain
      if (usedEtaSet.has(rd)) return false;

      // ❌ exclude yang sudah dipilih di tableData/draftRows
      if (selectedPODIds.has(Number(d.id))) return false;

      // ❌ exclude yang sudah pernah dipakai di shipping plan lain
      if (usedPODIds.has(Number(d.id))) return false;

      // ✅ hanya tampilkan yang masih ada open qty
      const openQty = d.open_quantity ?? d.original_quantity ?? 0;
      return openQty > 0;
    })
    .map((d) => {
      const rdKey = String(d.request_date ?? d.request_date_formatted ?? "").slice(0, 10);
      return {
        value: d.id,
        label: `${formatDateLabel(rdKey)} - ${d.part_code ?? ""} - ${d.part_name ?? ""}`,
      };
    });
}, [poDetails, shippingInfo.etd_cust, tableData, draftRows, usedPODIds, usedEtaSet]);


  // when user selects ETA Cust -> populate table with PO that match that date
  const handleEtaCustSelect = (opt) => {
    const value = opt ? opt.value : "";
    setShippingInfo((prev) => ({ ...prev, etd_cust: value }));

    if (!value) {
      setTableData([]);
      return;
    }

    // match PO by date
    const matched = (poDetails || []).filter((d) => {
      const rdRaw = d.request_date ?? d.request_date_formatted ?? "";
      const rd = String(rdRaw).slice(0, 10);
      return rd && rd === String(value).slice(0, 10);
    });

    // convert to table rows (but exclude PO that already used by SPD)
    const rows = matched
      .filter((d) => !usedPODIds.has(Number(d.id))) // exclude already used ones
      .map((d) => {
        const part = parts.find((p) => Number(p.id) === Number(d.part_id)) || {};
        const cartonQty = part.pack_carton_quantity || 1;
        const quantityPlan = d.open_quantity ?? d.original_quantity ?? 0;
        const cartonPlan = Math.ceil(quantityPlan / cartonQty);
        const palletePlan = Math.ceil(cartonPlan / 36);
        return {
          POD: d.id,
          partName: d.part_name || part.name || d.part_code || "",
          quantityPlan,
          cartonPlan,
          palletePlan,
          actualQuantity: "",
          cartonActual: 0,
          palleteActual: 0,
          isEditing: true,
        };
      });

    setDraftRows([]); // clear manual drafts
    setTableData(rows);
  };

  // Draft operations
  const startAddNewRow = () => setDraftRows((dr) => [...dr, { ...initialRow }]);
  const cancelNewRow = (index) =>
    setDraftRows((rows) => rows.filter((_, i) => i !== index));

  const handleDraftRowChange = (index, field, value) => {
    const next = [...draftRows];
    const row = { ...next[index] };

    if (field === "POD") {
      const detail = poDetails.find((d) => Number(d.id) === Number(value));
      if (detail) {
        const part = parts.find((p) => Number(p.id) === Number(detail.part_id)) || {};
        const cartonQty = part.pack_carton_quantity || 1;
        const quantityPlan = detail.open_quantity ?? detail.original_quantity ?? 0;
        row.partName = detail.part_name || part.name || detail.part_code || "";
        row.quantityPlan = quantityPlan;
        row.cartonPlan = Math.ceil(quantityPlan / cartonQty);
        row.palletePlan = Math.ceil(row.cartonPlan / 36);
        row.POD = detail.id;
      }
    }

    if (field === "actualQuantity") {
      const valNum = Number(value) || 0;
      const foundPart =
        parts.find((p) => p.name === row.partName || Number(p.id) === Number(row.partId)) || {};
      const cartonQty = foundPart.pack_carton_quantity || 1;
      row.actualQuantity = valNum;
      row.cartonActual = Math.ceil(valNum / cartonQty);
      row.palleteActual = Math.ceil(row.cartonActual / 36);
    }

    if (field !== "POD" && field !== "actualQuantity") {
      row[field] = value;
    }

    next[index] = row;
    setDraftRows(next);
  };

  const saveDraftRow = (index) => {
    const row = draftRows[index];
    if (!row.POD) return alert("Please select a PO item.");
    if (!row.actualQuantity || Number(row.actualQuantity) <= 0)
      return alert("Isi Actual Qty terlebih dahulu!");
    if (tableData.find((r) => Number(r.POD) === Number(row.POD))) return alert("PO ini sudah dipilih pada baris lain.");
    // also ensure not used globally
    if (usedPODIds.has(Number(row.POD))) return alert("PO ini sudah dipakai di shipping plan lain.");

    setTableData((td) => [...td, { ...row, isEditing: false }]);
    cancelNewRow(index);
  };

  // Save header and all rows
  const handleSaveAll = async () => {
    try {
      if (!shippingInfo.invoice_id) {
        return alert("Invoice harus dipilih sebelum menyimpan shipping plan.");
      }

      const sanitizedInfo = {
        ...shippingInfo,
        etd_nkb: shippingInfo.etd_nkb ? String(shippingInfo.etd_nkb).slice(0, 10) : null,
        etd_cust: shippingInfo.etd_cust ? String(shippingInfo.etd_cust).slice(0, 10) : null,
      };

      // Save header
      const spRes = await saveSP(sanitizedInfo);

      // extract id in a few possible shapes (depends on backend)
      const spId =
        spRes?.id ||
        spRes?.insertId ||
        spRes?.insert_id ||
        spRes?.data?.id ||
        spRes?.data?.insertId ||
        (spRes && typeof spRes === "number" ? spRes : null);

      if (!spId) {
        console.warn("saveSP returned:", spRes);
        alert("Gagal mendapatkan ID dari penyimpanan shipping plan. Cek console.");
        return;
      }

      // persist each row to shipping_plan_detail
      for (const row of tableData) {
        const payload = {
          shipping_plan_id: spId,
          purchase_order_detail_id:
            row.POD != null && row.POD !== "" ? Number(row.POD) : null,
          actual_quantity: Number(row.actualQuantity) || 0,
          carton: Number(row.cartonActual) || 0,
          pallete: Number(row.palleteActual) || 0,
        };
        await saveSPD(payload);
      }

      // refresh lists
      await fetchPlans();
      await fetchPODetails();
      await fetchSPDAll();

      // reset UI
      setTableData([]);
      setDraftRows([]);
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
      console.error("Failed to save shipping plan or details:", err);
      alert("Failed to save shipping plan");
    }
  };

  // invoice options (exclude used invoices)
  const availableInvoiceOptions = invoices
    .filter((inv) => !usedInvoiceIds.has(inv.id))
    .map((inv) => ({
      value: inv.id,
      label: inv.invoice_number || `Invoice #${inv.id}`,
    }));

  const isInvoiceSelected = !!shippingInfo.invoice_id;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Shipping Plan</ModalHeader>
      <ModalBody>
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label><strong>Invoice No</strong></Label>
              <Select
                options={availableInvoiceOptions}
                value={
                  shippingInfo.invoice_id
                    ? availableInvoiceOptions.find((o) => Number(o.value) === Number(shippingInfo.invoice_id)) || null
                    : null
                }
                onChange={handleInvoiceChange}
                isClearable
                placeholder="Select invoice (required)"
              />
            </FormGroup>

            <FormGroup>
              <Label><strong>Container</strong></Label>
              <Input name="container_name" value={shippingInfo.container_name} placeholder="Enter container volume" disabled={!isInvoiceSelected} />
            </FormGroup>

            <FormGroup>
              <Label><strong>ETD NKB</strong></Label>
              <Input type="date" name="etd_nkb" value={shippingInfo.etd_nkb} disabled={!isInvoiceSelected} />
            </FormGroup>
          </div>

          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label><strong>Booking No</strong></Label>
              <Input name="booking_number" value={shippingInfo.booking_number} placeholder="Enter booking no." disabled={!isInvoiceSelected} />
            </FormGroup>

            <FormGroup>
              <Label><strong>Vessel</strong></Label>
              <Input name="vessel_name" value={shippingInfo.vessel_name} placeholder="Enter vessel name" disabled={!isInvoiceSelected} />
            </FormGroup>

            <FormGroup>
              <Label><strong>ETA Cust (Request Date)</strong></Label>
              <Select
                options={requestDateOptions}
                isClearable
                placeholder="Select Request Date (ETA Cust)"
                value={
                  shippingInfo.etd_cust
                    ? requestDateOptions.find((o) => String(o.value).slice(0, 10) === String(shippingInfo.etd_cust).slice(0, 10)) || null
                    : null
                }
                onChange={handleEtaCustSelect}
                isDisabled={!isInvoiceSelected || requestDateOptions.length === 0}
                isOptionDisabled={(option) => usedEtaSet.has(String(option.value).slice(0, 10))}
              />
            </FormGroup>
          </div>
        </Form>

        <div className="table-responsive">
          <Table bordered striped>
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Item</th>
                <th style={{ width: "10%" }}>Plan Qty</th>
                <th style={{ width: "10%" }}>Plan Carton</th>
                <th style={{ width: "10%" }}>Plan Pallete</th>
                <th style={{ width: "10%" }}>Actual Qty</th>
                <th style={{ width: "10%" }}>Actual Carton</th>
                <th style={{ width: "10%" }}>Actual Pallete</th>
                <th style={{ width: "5%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* auto rows from ETA Cust */}
              {tableData.map((row, idx) => (
                <tr key={`row-${idx}`}>
                  <td>{row.partName}</td>
                  <td>{row.quantityPlan}</td>
                  <td>{row.cartonPlan}</td>
                  <td>{row.palletePlan}</td>
                  <td>
                    {row.isEditing ? (
                      <Input
                        type="number"
                        value={row.actualQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const updated = [...tableData];
                          const foundPart = parts.find((p) => p.name === row.partName) || {};
                          const cartonQty = foundPart.pack_carton_quantity || 1;
                          updated[idx].actualQuantity = val;
                          updated[idx].cartonActual = Math.ceil(val / cartonQty);
                          updated[idx].palleteActual = Math.ceil(updated[idx].cartonActual / 36);
                          setTableData(updated);
                        }}
                      />
                    ) : (
                      row.actualQuantity
                    )}
                  </td>
                  <td>{row.cartonActual}</td>
                  <td>{row.palleteActual}</td>
                  <td className="text-center">
                    {row.isEditing ? (
                      <div className="d-flex justify-content-center gap-2">
                        <Button color="success" size="sm" style={{ width: 32, height: 32, padding: 0 }} onClick={() => {
                          if (!row.actualQuantity || Number(row.actualQuantity) <= 0) return alert("Isi Actual Qty terlebih dahulu!");
                          const updated = [...tableData];
                          updated[idx].isEditing = false;
                          setTableData(updated);
                        }}>
                          <Check size={16} />
                        </Button>
                        <Button color="danger" size="sm" style={{ width: 32, height: 32, padding: 0 }} onClick={() => {
                          const updated = [...tableData];
                          updated.splice(idx, 1);
                          setTableData(updated);
                        }}>
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" color="primary" style={{ width: 32, height: 32, padding: 0 }} onClick={() => {
                        const updated = [...tableData];
                        updated[idx].isEditing = true;
                        setTableData(updated);
                      }}>
                        <PencilOff size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {/* draft rows */}
              {draftRows.map((row, idx) => (
                <tr key={`draft-${idx}`}>
                  <td style={{ minWidth: 300 }}>
                    {row.POD ? (
                      <span>{manualOptions.find((o) => o.value === row.POD)?.label || row.partName}</span>
                    ) : (
                      <Select
                        options={manualOptions}
                        isDisabled={!manualOptions.length}
                        placeholder="Select RequestDate - PartCode - PartName"
                        value={row.POD ? manualOptions.find((o) => o.value === row.POD) || null : null}
                        onChange={(opt) => handleDraftRowChange(idx, "POD", opt ? opt.value : "")}
                      />
                    )}
                  </td>
                  <td><Input className="w-100" readOnly value={row.quantityPlan} /></td>
                  <td><Input className="w-100" readOnly value={row.cartonPlan} /></td>
                  <td><Input className="w-100" readOnly value={row.palletePlan} /></td>
                  <td>
                    <Input className="w-100" type="number" value={row.actualQuantity} onChange={(e) => handleDraftRowChange(idx, "actualQuantity", parseInt(e.target.value, 10) || 0)} />
                  </td>
                  <td><Input className="w-100" readOnly value={row.cartonActual} /></td>
                  <td><Input className="w-100" readOnly value={row.palleteActual} /></td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button color="success" size="sm" style={{ width: 32, height: 32, padding: 0 }} onClick={() => saveDraftRow(idx)} disabled={!row.actualQuantity || Number(row.actualQuantity) <= 0}>
                        <Check size={16} />
                      </Button>
                      <Button color="danger" size="sm" style={{ width: 32, height: 32, padding: 0 }} onClick={() => cancelNewRow(idx)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan="9" className="text-center">
                  <Button color="primary" style={{ minWidth: 100 }} onClick={startAddNewRow} disabled={!isInvoiceSelected}>
                    <PlusCircle size={16} /> Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="text-end mt-3">
          <Button color="primary" onClick={handleSaveAll}>Save</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default NewShippingPlan;
