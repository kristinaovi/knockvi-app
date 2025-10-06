import React, { useState, useEffect } from "react";
import {
  Button, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import Select from "react-select";
import useParts from "../../../Hooks/useParts";
import useInventory from "../../../Hooks/useInventory";

const NewInventory = ({ isOpen, toggle, onSuccess }) => {
  const { items: parts, fetchParts } = useParts();
  const { createOrUpdate } = useInventory();

  const [formData, setFormData] = useState({
    partCode: "",
    partName: "",
    totalStock: "",
    finishGood: "",
    carton: "",
    pallete: "",
  });

  const isPartSelected = !!formData.partCode;

  // Ambil daftar parts saat modal dibuka
  useEffect(() => {
    if (isOpen) fetchParts();
  }, [isOpen, fetchParts]);

  const handleSave = async () => {
    try {
      await createOrUpdate({
        inven_code: "INV-" + Date.now(), // auto generate
        part_code: formData.partCode,
        part_name: formData.partName,
        total_stock: formData.totalStock,
        finish_good: formData.finishGood,
        carton: formData.carton,
        pallete: formData.pallete,
      });

      if (onSuccess) onSuccess();
      toggle();
      setFormData({
        partCode: "",
        partName: "",
        totalStock: "",
        finishGood: "",
        carton: "",
        pallete: "",
      });
    } catch (err) {
      console.error("Save Inventory Error:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Inventory</ModalHeader>
      <ModalBody>
        <Form className="row">
          {/* Part ID Dropdown */}
          <FormGroup className="col-md-6">
            <Label><strong>Part ID</strong></Label>
            <Select
              options={parts.map(p => ({
                value: p.code,
                label: p.code,
                name: p.name,
                carton: p.pack_carton_quantity,
                pallete: p.pack_plt_quantity,
              }))}
              value={
                formData.partCode
                  ? { value: formData.partCode, label: formData.partCode }
                  : null
              }
              onChange={(option) =>
                setFormData(prev => ({
                  ...prev,
                  partCode: option?.value || "",
                  partName: option?.name || "",
                  carton: option?.carton || "",
                  pallete: option?.pallete || "",
                }))
              }
              isClearable
              placeholder="Select Part ID"
            />
          </FormGroup>

          {/* Part Name */}
          <FormGroup className="col-md-6">
            <Label><strong>Part Name</strong></Label>
            <Input
              type="text"
              disabled={!isPartSelected}
              value={formData.partName || ""}
              placeholder="Please select Part ID"
              readOnly
            />
          </FormGroup>

          {/* Total Stock */}
          <FormGroup className="col-md-6">
            <Label><strong>Total Stock</strong></Label>
            <Input
              type="number"
              name="totalStock"
              value={formData.totalStock}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, totalStock: e.target.value }))
              }
              placeholder="Enter total stock"
            />
          </FormGroup>

          {/* Finish Good */}
          <FormGroup className="col-md-6">
            <Label><strong>Finish Good</strong></Label>
            <Input
              type="number"
              name="finishGood"
              value={formData.finishGood}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, finishGood: e.target.value }))
              }
              placeholder="Enter finish good"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NewInventory;
