import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
} from "reactstrap";
import Select from "react-select";

const NewInvoice = ({ isOpen, toggle }) => {
  // State contoh
  const [shippingInfo, setShippingInfo] = useState({
    etd_nkb: "",
    etd_cust: "",
    booking_number: "",
    container_name: "",
    vessel_name: "",
    invoice_id: "",
  });

  const [tableData, setTableData] = useState([]);
  const [draftRows, setDraftRows] = useState([]);

  // Contoh data PO
  const poDetails = [
    { id: 1, part_code: "P001", part_name: "Part A" },
    { id: 2, part_code: "P002", part_name: "Part B" },
  ];

  // Handler
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const startAddNewRow = () => {
    setDraftRows((prev) => [
      ...prev,
      {
        POD: "",
        price: "",
        quantityPlan: "",
        cartonPlan: "",
        palletePlan: "",
        actualQuantity: 0,
        cartonActual: "",
        palleteActual: "",
      },
    ]);
  };

  const handleDraftRowChange = (index, field, value) => {
    setDraftRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const saveDraftRow = (index) => {
    setTableData((prev) => [...prev, draftRows[index]]);
    setDraftRows((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelNewRow = (index) => {
    setDraftRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    console.log("Saving...", shippingInfo, tableData);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Invoice</ModalHeader>
      <ModalBody>
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Invoice ID</strong>
              </Label>
              <Input
                type="text"
                name="etd_nkb"
                value={shippingInfo.etd_nkb}
                onChange={handleShippingChange}
              />
            </FormGroup>
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
                <strong>Ship Methode</strong>
              </Label>
              <Input
                type="select"
                name="ship_method"
                value={shippingInfo.ship_method}
                onChange={handleShippingChange}
              >
                <option value="">-- Select Ship Method --</option>
                <option value="Sea">Sea</option>
                <option value="Air">Air</option>
              </Input>
            </FormGroup>
          </div>
          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Customer</strong>
              </Label>
              <Input
                type="text"
                name="etd_cust"
                value={shippingInfo.etd_cust}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>ETA Customer</strong>
              </Label>
              <Input
                type="date"
                name="etd_nkb"
                value={shippingInfo.etd_nkb}
                onChange={handleShippingChange}
              />
            </FormGroup>
          </div>
        </Form>

        <div className="text-end mt-3">
          <Button color="success" onClick={handleSaveAll}>
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NewInvoice;
