// src/components/Invoice/NewInvoice.jsx
import Select from "react-select";
import React, { useState, useEffect } from "react";
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
import useCustomers from "../../../Hooks/useCustomers";

const NewInvoice = ({ isOpen, toggle, onSaved }) => {
  const { create, getNext } = useInvoices();

  // State form sekarang hanya menyertakan ETD (tidak ada ETA)
  const [formData, setFormData] = useState({
    customer_code: "",
    invoice_number: "",
    booking_no: "",
    vessel_flight: "",
    container: "",
    etd_nkb: "",
    ship_method: "",
  });

  const isCustomerSelected = !!formData.customer_code;
  const [customers, setCustomers] = useState([]); // ✅ tambahkan state untuk customers
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    // mendukung event dari Input dan custom onChange untuk react-select
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const containerOptions = [
    { value: "1X20 FT", label: "1X20 FT" },
    { value: "1X40 FT", label: "1X40 FT" },
    { value: "N/A", label: "N/A" },
  ];

  const handleSaveAll = async () => {
    try {
      // Validasi sederhana
      if (
        !formData.invoice_number ||
        !formData.customer_code ||
        !formData.booking_no ||
        !formData.vessel_flight ||
        !formData.container ||
        !formData.etd_nkb ||
        !formData.ship_method
      ) {
        alert(
          "Please fill in all required fields (Invoice No, Customer, ETD, Shipping Method)."
        );
        return;
      }

      setSaving(true);

      // Kirim hanya field yang relevan (tanpa ETA)
      const payload = {
        customer_code: formData.customer_code, // ✅ kirim code
        invoice_number: formData.invoice_number,
        booking_no: formData.booking_no || null,
        vessel_flight: formData.vessel_flight || null,
        container: formData.container || null,
        etd_nkb: formData.etd_nkb,
        ship_method: formData.ship_method,
        eta_customer: null,
      };

      await create(payload);

      // Reset & callback ke parent
      setFormData({
        customer_code: "",
        invoice_number: "",
        booking_no: "",
        vessel_flight: "",
        container: "",
        etd_nkb: "",
        ship_method: "",
      });

      if (onSaved) onSaved();
      toggle();
    } catch (err) {
      // tangani validation error dari backend (422) bila ada
      if (
        err?.response?.status === 422 &&
        Array.isArray(err.response.data?.errors)
      ) {
        const msgs = err.response.data.errors
          .map((e) => `${e.path || e.param || e.field}: ${e.msg || e.message}`)
          .join("\n");
        alert(`Validation error:\n${msgs}`);
      } else if (err?.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("Failed to save invoice. Check console for details.");
      }
      console.error("Failed to save invoice:", err);
    } finally {
      setSaving(false);
    }
  };

  const { fetchAll } = useCustomers(); // ✅ ambil method list()

  useEffect(() => {
    if (isOpen) {
      fetchAll().then((res) => {
        const options = res.map((c) => ({
          value: c.code, // simpan kode
          label: c.name, // tampilkan nama panjang
        }));
        setCustomers(options);
      });
    }
  }, [isOpen, fetchAll]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Invoice</ModalHeader>
      <ModalBody>
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Customer</strong>
              </Label>
              <Select
                name="customer_code"
                options={customers}
                value={
                  customers.find((c) => c.value === formData.customer_code) ||
                  null
                }
                onChange={async (option) => {
                  if (option) {
                    setFormData((prev) => ({
                      ...prev,
                      customer_code: option.value,
                    }));
                    try {
                      const data = await getNext(option.value); // ✅ pakai hooks
                      setFormData((prev) => ({
                        ...prev,
                        invoice_number: data.invoice_number,
                      }));
                    } catch (err) {
                      console.error("Failed to fetch invoice number", err);
                    }
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      customer_code: "",
                      invoice_number: "",
                    }));
                  }
                }}
                isClearable
                placeholder="Select customer"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>Shipping Method</strong>
              </Label>
              <Select
                name="ship_method"
                value={
                  formData.ship_method
                    ? {
                        value: formData.ship_method,
                        label: formData.ship_method,
                      }
                    : null
                }
                onChange={(option) =>
                  handleChange({
                    target: {
                      name: "ship_method",
                      value: option ? option.value : "",
                    },
                  })
                }
                options={[
                  { value: "Sea", label: "Sea" },
                  { value: "Air", label: "Air" },
                ]}
                isClearable
                placeholder="Select shipping method"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>Booking No.</strong>
              </Label>
              <Input
                type="text"
                name="booking_no"
                value={formData.booking_no}
                onChange={handleChange}
                required
                placeholder="Enter booking no."
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>ETD NKB</strong>
              </Label>
              <Input
                type="date"
                name="etd_nkb"
                value={formData.etd_nkb}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>

          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Invoice No.</strong>
              </Label>
              <Input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                disabled={!isCustomerSelected}
                placeholder="Please select invoice no."
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>Vessel/Flight</strong>
              </Label>
              <Input
                type="text"
                name="vessel_flight"
                value={formData.vessel_flight}
                onChange={handleChange}
                required
                placeholder="Enter vessel/flight"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Container Volume</strong>
              </Label>
              <Select
                name="container"
                options={containerOptions}
                value={
                  formData.container
                    ? containerOptions.find(
                        (o) => o.value === formData.container
                      )
                    : null
                }
                onChange={(option) =>
                  handleChange({
                    target: {
                      name: "container",
                      value: option ? option.value : "",
                    },
                  })
                }
                isClearable
                placeholder="Select container volume"
              />
            </FormGroup>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSaveAll} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewInvoice;
