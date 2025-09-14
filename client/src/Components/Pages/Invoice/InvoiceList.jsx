import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Table } from "reactstrap";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";
import useInvoices from "../../../Hooks/useInvoices";
import useShippingPlans from "../../../Hooks/useShippingPlans";
import useShippingPlanDetail from "../../../Hooks/useShippingPlanDetail";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const InvoiceList = () => {
  const { items: invoices, fetchAll: fetchInvoices } = useInvoices();
  const { items: shippingPlans, fetchAll: fetchPlans } = useShippingPlans();
  const { items: shippingDetails, fetchAll: fetchShippingDetails } = useShippingPlanDetail();

  const [searchText, setSearchText] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchPlans();
    fetchShippingDetails();
  }, [fetchInvoices, fetchPlans, fetchShippingDetails]);

  const toggleModal = (invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(!modalOpen);
  };

  const relatedPlans = selectedInvoice
    ? shippingPlans.filter(plan => plan.invoice_id === selectedInvoice.id)
    : [];

  const relatedDetails = relatedPlans.length
    ? shippingDetails.filter(detail => relatedPlans.some(plan => plan.id === detail.shipping_plan_id))
    : [];

  // --- NEW EXPORT FUNCTION ---
  // This function builds a professionally styled Excel invoice.
  const exportShippingDetails = () => {
    // 1. --- DATA VALIDATION ---
    if (!selectedInvoice || !relatedDetails.length) {
        alert("No details to export.");
        return;
    }

    // 2. --- DATA PREPARATION ---
    const totalQty = relatedDetails.reduce((sum, d) => sum + (d.actual_quantity || 0), 0);
    const totalAmount = relatedDetails.reduce((sum, d) => sum + (d.actual_quantity || 0) * (d.price || 0), 0);
    const invoiceDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format

    // 3. --- WORKSHEET STRUCTURE (Array of Arrays) ---
    const headerData = [
        ["PANASONIC PROCUREMENT ASIA PACIFIC (PPAP)", null, null, null, null, null, null, null, selectedInvoice.invoice_number],
        [null, null, null, null, null, null, null, null, invoiceDate],
        [], // Spacer row
        ["CONSIGNED TO:", null, null, null, null, null, null, "SC2508043"],
        ["PANASONIC PROCUREMENT ASIA PACIFIC (PPAP)"],
        ["3 Bedok South Road"],
        ["Singapore 469332"],
        [],
        ["DELIVER TO:"],
        [`PT. ${selectedInvoice.customer}`],
        ["Kawasan Industri Gobel"],
        ["Jawa Barat - Indonesia"],
        [],
        ["BATAM", "JKT-INDONESIA", "SEA", null, "SIN", "BTH", null, "Ref no. See Below"],
        [],
    ];

    const tableHeader = [
        ["No.", "Part Code", "DESCRIPTIONS", null, "Qty", "Unit Price", "AMOUNT"]
    ];

    const tableBody = relatedDetails.map((detail, idx) => [
        idx + 1,
        detail.part_code,
        detail.part_name,
        null, // This column is merged into DESCRIPTIONS
        detail.actual_quantity,
        detail.price,
        detail.actual_quantity * (detail.price ?? 0)
    ]);

    const tableFooter = [
        [null, null, "TOTAL", null, totalQty, null, totalAmount]
    ];

    const footerData = [
        [], // Spacer
        ["Terms of Payment:", "No Commercial Value, Value for Customs Purpose Only"],
        [],
        ["E.T.D. Batam:", selectedInvoice.etd_nkb ? new Date(selectedInvoice.etd_nkb).toLocaleDateString('en-CA') : 'N/A'],
        ["E.T.A. Jakarta:", selectedInvoice.eta_customer ? new Date(selectedInvoice.eta_customer).toLocaleDateString('en-CA') : 'N/A'],
    ];

    const finalData = [...headerData, ...tableHeader, ...tableBody, ...tableFooter, ...footerData];

    // 4. --- WORKSHEET CREATION & STYLING ---
    const ws = XLSX.utils.aoa_to_sheet(finalData);

    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Main Title
        { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, // Consignee Name
        { s: { r: 5, c: 0 }, e: { r: 5, c: 4 } }, // Consignee Addr 1
        { s: { r: 6, c: 0 }, e: { r: 6, c: 4 } }, // Consignee Addr 2
        { s: { r: 9, c: 0 }, e: { r: 9, c: 4 } }, // Deliver To Name
        { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } },// Deliver To Addr 1
        { s: { r: 11, c: 0 }, e: { r: 11, c: 4 } },// Deliver To Addr 2
        { s: { r: 15, c: 2 }, e: { r: 15, c: 3 } }, // Description Header
        { s: { r: 15 + tableBody.length + 1, c: 2 }, e: { r: 15 + tableBody.length + 1, c: 3 } }, // Total Row
        { s: { r: 15 + tableBody.length + 3, c: 1 }, e: { r: 15 + tableBody.length + 3, c: 5 } }, // Footer Terms
    ];

    ws['!cols'] = [
        { wch: 5 },  // No.
        { wch: 18 }, // Part Code
        { wch: 35 }, // Descriptions
        { wch: 15 }, // (empty part of description)
        { wch: 12 }, // Qty
        { wch: 12 }, // Unit Price
        { wch: 15 }, // Amount
        { wch: 5 },  // Spacer
        { wch: 25 }  // Right-side header info
    ];

    const tableStartRow = 15;
    const tableEndRow = tableStartRow + tableBody.length;
    const totalRowIndex = tableEndRow + 1;

    for (let R = tableStartRow; R <= totalRowIndex; ++R) {
        for (let C = 0; C <= 6; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cellAddress];
            if (!cell) continue;

            const isHeader = (R === tableStartRow);
            const isTotalRow = (R === totalRowIndex);

            let style = {
                border: {
                    top: { style: "thin" }, bottom: { style: "thin" },
                    left: { style: "thin" }, right: { style: "thin" }
                }
            };

            if(isHeader) {
                style.font = { bold: true };
                style.alignment = { horizontal: "center", vertical: "center" };
                style.fill = { fgColor: { rgb: "EFEFEF" } };
            }

            if (isTotalRow) {
                 style.font = { bold: true };
            }

            if (C === 0 || C === 4) { // No., Qty
                style.alignment = { ...style.alignment, horizontal: "right" };
                cell.t = 'n';
                cell.z = '#,##0';
            } else if (C === 5 || C === 6) { // Unit Price, Amount
                style.alignment = { ...style.alignment, horizontal: "right" };
                cell.t = 'n';
                cell.z = '#,##0.00';
            }

            cell.s = style;
        }
    }
     // Style the main title separately
    if (ws['A1']) ws['A1'].s = { font: { sz: 16, bold: true }, alignment: { horizontal: "center" } };

    // 5. --- FILE GENERATION ---
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Details");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Invoice-${selectedInvoice.invoice_number}.xlsx`);
  };

  const filteredData = invoices.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className="card-no-border">
  <div className="d-flex align-items-center w-100">
    <H5>Invoice List</H5>

    {/* This container is pushed to the right by ms-auto */}
    <div className="d-flex align-items-center ms-auto" style={{ width: '300px' }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  </div>
</CardHeader>
      <CardBody className="pt-0">
        <DataTable
          columns={[
            {
              name: "Invoice Number",
              selector: (row) => row.invoice_number,
              sortable: true,
              cell: (row) => (
                <Button color="link" onClick={() => toggleModal(row)}>
                  {row.invoice_number}
                </Button>
              ),
            },
            { name: "Customer", selector: (row) => row.customer, sortable: true },
            { name: "ETD NKB", selector: (row) => new Date(row.etd_nkb).toLocaleDateString(), sortable: true },
            { name: "ETA Customer", selector: (row) => new Date(row.eta_customer).toLocaleDateString(), sortable: true },
            { name: "Ship Method", selector: (row) => row.ship_method, sortable: true },
          ]}
          data={filteredData}
          striped
          center
          pagination
        />
      </CardBody>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Shipping Details for Invoice: {selectedInvoice?.invoice_number}
        </ModalHeader>
        <ModalBody>
          {relatedDetails.length > 0 ? (
            <>
              <Button color="primary" size="sm" onClick={exportShippingDetails}>
                Export to XLSX
              </Button>
              <Table bordered className="mt-2">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Part Code</th>
                    <th>Part Name</th>
                    <th>QTY Plan</th>
                    <th>QTY Actual</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedDetails.map((d, idx) => (
                    <tr key={d.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{d.part_code}</td>
                      <td>{d.part_name}</td>
                      <td>{d.original_quantity}</td>
                      <td>{d.actual_quantity}</td>
                      <td>{d.price ?? 0}</td>
                      <td>{Number(d.price) * Number(d.actual_quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <p>No shipping details attached to this invoice.</p>
          )}
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default InvoiceList;
