// src/components/NewProductionPlan.jsx
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
} from "reactstrap";
import axios from "axios";

const NewProductionPlan = ({ isOpen, toggle, onSuccess }) => {
  const [formData, setFormData] = useState({
    prodName: "",
    prodMC: "",
    prodOutput: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/production", formData);
      if (onSuccess) onSuccess(); // refresh data di parent (ProductionPlanList)
      toggle();
      setFormData({ prodName: "", prodMC: "", prodOutput: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to save production plan");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New Production Plan</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label>Part Name</Label>
            <Input
              name="prodName"
              value={formData.prodName}
              onChange={handleChange}
              placeholder="Enter part name"
            />
          </FormGroup>
          <FormGroup>
            <Label>Machine (MC)</Label>
            <Input
              name="prodMC"
              value={formData.prodMC}
              onChange={handleChange}
              placeholder="Enter machine"
            />
          </FormGroup>
          <FormGroup>
            <Label>Output</Label>
            <Input
              type="number"
              name="prodOutput"
              value={formData.prodOutput}
              onChange={handleChange}
            />
          </FormGroup>
          <div className="text-end">
            <Button color="success" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default NewProductionPlan;
