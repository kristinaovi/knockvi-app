// src/components/Invoice/NewInvoice.jsx
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import useInvoices from "../../../Hooks/useInvoices";

const NewInvoice = ({ isOpen, toggle, onSaved }) => {
  const { create } = useInvoices();

  // State form sesuai kebutuhan Anda
  const [formData, setFormData] = useState({
    invoice_number: "",
    customer: "",
    etd_nkb: "",
    eta_customer: "",
    ship_method: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAll = async () => {
    try {
      // Validasi wajib diisi
      if (
        !formData.invoice_number ||
        !formData.customer ||
        !formData.etd_nkb ||
        !formData.eta_customer ||
        !formData.ship_method
      ) {
        alert("Semua field wajib diisi!");
        return;
      }

      await create(formData); // menggunakan fungsi create dari useResource
      if (onSaved) onSaved(); // reload tabel di InvoiceList
      toggle(); // tutup modal
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Gagal menyimpan invoice. Silakan cek console untuk detail.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>New Invoice</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label><strong>Invoice Number</strong></Label>
            <Input
              type="text"
              name="invoice_number"
              value={formData.invoice_number}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label><strong>Customer</strong></Label>
            <Input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label><strong>ETD NKB (Tanggal Berangkat)</strong></Label>
            <Input
              type="date"
              name="etd_nkb"
              value={formData.etd_nkb}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label><strong>ETA Customer (Tanggal Tiba)</strong></Label>
            <Input
              type="date"
              name="eta_customer"
              value={formData.eta_customer}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label><strong>Ship Method</strong></Label>
            <Input
              type="select"
              name="ship_method"
              value={formData.ship_method}
              onChange={handleChange}
              required
            >
              <option value="">-- Select --</option>
              <option value="Sea">Sea</option>
              <option value="Air">Air</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSaveAll}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewInvoice;
