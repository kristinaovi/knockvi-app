import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  Input,
  Row,
  Col,
  Label,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import Select from "react-select";
import { PencilOff, Check, X } from "lucide-react";
import { PlusCircle } from "react-feather";

// Hooks
import usePurchaseOrders from "../../../../Hooks/usePurchaseOrders";
import usePurchaseOrderDetails from "../../../../Hooks/usePurchaseOrderDetails";
import useParts from "../../../../Hooks/useParts";
import { toast } from "react-toastify"

const NewPurchaseOrder = ({ isOpen, toggle, onSaved }) => {
  const { createOrUpdate: savePO } = usePurchaseOrders();
  const { createOrUpdate: savePOD } = usePurchaseOrderDetails();
  const { items: parts, fetchParts } = useParts();

  const saveDraftRow = (index) => {
    const row = newRows[index];
    if (!row.PART_CODE) {
      return alert("Please select a part code.");
    }
    setTableData((td) => [...td, row]);
    cancelNewRow(index);
  };

  const cancelNewRow = (index) => {
    setNewRows((rows) => rows.filter((_, i) => i !== index));
  };

  const editRow = (index) => {
    const rowToEdit = tableData[index];
    // Hapus dari tableData
    setTableData((prev) => prev.filter((_, i) => i !== index));
    // Masukkan ke newRows supaya bisa diedit lagi
    setNewRows((prev) => [...prev, rowToEdit]);
  };

  // Load parts once
  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // === HEADER STATE ===
  const [poInfo, setPoInfo] = useState({
    no: "",
    pecgi_no: "",
    ppap_no: "",
    issuer_id: 1,
    requested_date: "",
  });

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setPoInfo((prev) => ({ ...prev, [name]: value }));
  };

  // === DETAIL STATE ===
  const [tableData, setTableData] = useState([]);
  const [newRows, setNewRows] = useState([]);

  const startAddNewRow = () => {
    if (newRows.length > 0) {
      alert("Please save or cancel the current row before adding a new one.");
      return;
    }
    setNewRows((prev) => [
      ...prev,
      {
        PART_CODE: "",
        PART_NAME: "",
        REQUEST_DATE: "",
        PO_LINE: 0,
        QUANTITY: 0,
        PRICE: 0,
      },
    ]);
  };
  const handleNewRowChange = (index, e) => {
    const { name, value } = e.target;
    setNewRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index] };

      if (name === "QUANTITY" || name === "PO_LINE") {
        const intVal = value === "" ? "" : parseInt(value, 10);
        row[name] = Number.isNaN(intVal) ? 0 : intVal;
      } else if (name === "PRICE") {
        // allow empty while typing, otherwise parse float
        if (value === "") {
          row[name] = "";
        } else {
          const f = parseFloat(value);
          row[name] = Number.isNaN(f) ? 0 : f;
        }
      } else {
        row[name] = value;
      }

      // when PART_CODE changed, also set PART_NAME and PRICE from parts
      if (name === "PART_CODE") {
        const part = parts.find((p) => p.id === parseInt(value, 10));
        row.PART_NAME = part ? part.name : "";
        // set PRICE from part.price (fallback 0)
        row.PRICE =
          part && part.price !== undefined && part.price !== null
            ? part.price
            : 0;
      }

      updated[index] = row;
      return updated;
    });
  };

  const handleSaveAll = async () => {
    try {
      // build header (convert empty string -> null)
      const updatedPoInfo = {
        ...poInfo,
        requested_date: poInfo.requested_date
          ? String(poInfo.requested_date).slice(0, 10)
          : null,
      };

      // gabungkan saved table + draft rows (newRows)
      const finalTableData = [...tableData, ...newRows];

      // debug: tunjukkan apa yang akan dikirim (hapus/disable setelah test)
      console.log("PO header to save:", updatedPoInfo);
      console.log("POD rows to save (raw):", finalTableData);

      // Simpan header PO dulu
      const { id: poId } = await savePO(updatedPoInfo);
      console.log("Created PO id:", poId);

      // Simpan setiap detail (POD). Pastikan field requested_date terformat YYYY-MM-DD atau null
      await Promise.all(
        finalTableData.map((row) => {
          const payload = {
            purchase_order_id: poId,
            part_id: row.PART_CODE,
            requested_date: row.REQUEST_DATE
              ? String(row.REQUEST_DATE).slice(0, 10)
              : null,
            line: row.PO_LINE,
            original_quantity: row.QUANTITY,
            price: Number(row.PRICE) || 0,
          };
          console.log("Saving POD payload:", payload);
          console.log("POD rows to save (finalTableData):", finalTableData);
          // sebelum menyimpan detail
          console.log("FINAL TABLE DATA (frontend):", finalTableData);
          return savePOD(payload);
        })
      );
      toast.success('Add PO Success')

      // Reset states
      setTableData([]);
      setNewRows([]);
      setPoInfo({
        no: "",
        pecgi_no: "",
        ppap_no: "",
        issuer_id: 1,
        requested_date: "",
      });

      if (onSaved) onSaved();
      toggle();
    } catch (err) {
      console.error("handleSaveAll error:", err);
      alert("Failed to save purchase order");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Purchase Order</ModalHeader>
      <ModalBody>
        {/* HEADER FORM */}
        <Row className="mb-4">
          <Col md={6}>
            <FormGroup>
              <Label>PECGI PO</Label>
              <Input
                name="pecgi_no"
                value={poInfo.pecgi_no}
                onChange={handleHeaderChange}
                placeholder="Enter PECGI PO"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>PPAP PO</Label>
              <Input
                name="ppap_no"
                value={poInfo.ppap_no}
                onChange={handleHeaderChange}
                placeholder="Enter PPAP PO"
              />
            </FormGroup>
          </Col>
        </Row>
        {/* DETAIL TABLE */}
        <div className="table-responsive">
          <Table bordered striped>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Part Code</th>
                <th style={{ width: "20%" }}>Part Name</th>
                <th style={{ width: "12.5%" }}>Request Date</th>
                <th style={{ width: "12.5%" }}>PO Line</th>
                <th style={{ width: "12.5%" }}>Quantity</th>
                <th style={{ width: "12.5%" }}>Price</th>
                <th style={{ width: "10%" }}>Action</th>{" "}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr key={`saved-${idx}`}>
                  <td>
                    {parts.find((p) => p.id === item.PART_CODE)?.code ||
                      item.PART_CODE}
                  </td>
                  <td>{item.PART_NAME}</td>
                  <td>{item.REQUEST_DATE}</td>
                  <td>{item.PO_LINE}</td>
                  <td>{item.QUANTITY}</td>
                  <td>{item.PRICE ?? 0}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      color="primary"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                      onClick={() => editRow(idx)}
                    >
                      <PencilOff size={16} />
                    </Button>
                  </td>
                </tr>
              ))}

              {newRows.map((row, idx) => (
                <tr key={`new-${idx}`}>
                  <td style={{ width: "20%" }}>
                    <Select
                      className="w-100"
                      options={parts.map((p) => ({
                        value: p.id,
                        label: `${p.code} - ${p.name}`,
                      }))}
                      value={
                        parts
                          .filter((p) => p.id === row.PART_CODE)
                          .map((p) => ({ value: p.id, label: p.code }))[0] ||
                        null
                      }
                      onChange={(opt) =>
                        handleNewRowChange(idx, {
                          target: { name: "PART_CODE", value: opt.value },
                        })
                      }
                      name="PART_CODE"
                    />
                  </td>
                  <td style={{ width: "20%" }}>
                    <Input
                      className="w-100"
                      readOnly
                      value={row?.PART_NAME || ""}
                      disabled={!row?.PART_NAME} // ✅ abu-abu kalau belum ada Part
                      placeholder="Select part code"
                    />
                  </td>

                  <td style={{ width: "20%" }}>
                    <Input
                      className="w-100"
                      type="date"
                      name="REQUEST_DATE"
                      value={row.REQUEST_DATE}
                      onChange={(e) => handleNewRowChange(idx, e)}
                      min={new Date().toISOString().split("T")[0]} // blokir tanggal sebelum hari ini
                    />
                  </td>
                  <td style={{ width: "12.5%" }}>
                    <Input
                      className="w-100"
                      type="number"
                      name="PO_LINE"
                      value={row.PO_LINE}
                      onChange={(e) => handleNewRowChange(idx, e)}
                      onFocus={() => {
                        if (row.PO_LINE === 0) {
                          // optional UX: kosongkan 0 saat fokus agar user bisa langsung ketik
                          handleNewRowChange(idx, {
                            target: { name: "PO_LINE", value: "" },
                          });
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handleNewRowChange(idx, {
                            target: { name: "PO_LINE", value: "0" },
                          });
                        }
                      }}
                    />
                  </td>
                  <td style={{ width: "12.5%" }}>
                    <Input
                      className="w-100"
                      type="number"
                      name="QUANTITY"
                      value={row.QUANTITY}
                      onChange={(e) => handleNewRowChange(idx, e)}
                      onFocus={() => {
                        if (row.QUANTITY === 0) {
                          // optional UX: kosongkan 0 saat fokus agar user bisa langsung ketik
                          handleNewRowChange(idx, {
                            target: { name: "QUANTITY", value: "" },
                          });
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handleNewRowChange(idx, {
                            target: { name: "QUANTITY", value: "0" },
                          });
                        }
                      }}
                    />
                  </td>
                  <td style={{ width: "12.5%" }}>
                    <Input
                      className="w-100"
                      type="number"
                      step="0.01"
                      name="PRICE"
                      value={row.PRICE === "" ? "" : row.PRICE}
                      onChange={(e) => handleNewRowChange(idx, e)}
                      onFocus={() => {
                        if (row.PRICE === 0) {
                          // optional UX: kosongkan 0 saat fokus agar user bisa langsung ketik
                          handleNewRowChange(idx, {
                            target: { name: "PRICE", value: "" },
                          });
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handleNewRowChange(idx, {
                            target: { name: "PRICE", value: "0" },
                          });
                        }
                      }}
                    />
                  </td>
                  <td className="text-center" style={{ width: "10%" }}>
                    <div
                      className="d-flex justify-content-center"
                      style={{ gap: "6px" }}
                    >
                      <Button
                        size="sm"
                        color="success"
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => saveDraftRow(idx)}
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        onClick={() => cancelNewRow(idx)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan="7" className="text-center">
                  <Button
                    color="primary"
                    style={{ minWidth: "100px" }}
                    onClick={startAddNewRow}
                    className="d-inline-flex align-items-center gap-1"
                  >
                    <PlusCircle size={16} /> Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          style={{ minWidth: "100px" }}
          onClick={handleSaveAll}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewPurchaseOrder;
