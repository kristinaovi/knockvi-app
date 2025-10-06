import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import useParts from "../../../Hooks/useParts";
import useMachines from "../../../Hooks/useMachines";
import useProductionPlan from "../../../Hooks/useProductionPlan";
import Select from "react-select";


const NewProductionPlan = ({ isOpen, toggle, currentUserId, onSuccess }) => {
  const isMounted = useRef(true);
  const { items: parts, fetchParts } = useParts();
  const { items: machines, fetchAll: fetchMachines } = useMachines();
  const { createOrUpdate } = useProductionPlan();

  const [formData, setFormData] = useState({
    part_id: "",
    machine_id: "",
    status: "",
    quantity_plan: "",
    remarks: "",
    issuer_id: currentUserId || null,
    created_by: currentUserId || null,
    updated_by: currentUserId || null,
  });

  useEffect(() => {
    fetchParts();
    fetchMachines();
  }, [fetchParts, fetchMachines]);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSave = async () => {
    if (
      !formData.part_id ||
      !formData.machine_id ||
      !formData.status ||
      !formData.quantity_plan
    ) {
      alert("Please fill all required fields!");
      return;
    }
    try {
      const payload = {
        ...formData,
        part_id: Number(formData.part_id),
        machine_id: Number(formData.machine_id),
        quantity_plan: Number(formData.quantity_plan),
        issuer_id: Number(currentUserId),
        created_by: Number(currentUserId),
        updated_by: Number(currentUserId),
      };
      const savedPlan = await createOrUpdate(payload); // return dari API
      if (onSuccess) onSuccess(savedPlan); // kirim ke parent
      if (isMounted.current) toggle();

      setFormData({
        part_id: "",
        machine_id: "",
        status: "",
        quantity_plan: "",
        remarks: "",
        issuer_id: currentUserId || null,
        created_by: currentUserId || null,
        updated_by: currentUserId || null,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save production plan");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Production Plan</ModalHeader>
      <ModalBody>
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Product</strong>
              </Label>
              <Select
                options={parts.map((p) => ({
                  value: p.id,
                  label: `${p.code} - ${p.name}`,
                }))}
                value={
                  parts.find((p) => p.id === formData.part_id)
                    ? {
                        value: formData.part_id,
                        label: `${
                          parts.find((p) => p.id === formData.part_id).code
                        } - ${
                          parts.find((p) => p.id === formData.part_id).name
                        }`,
                      }
                    : null
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    part_id: e ? e.value : null,
                  }))
                }
                isClearable
                placeholder="Select product"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>Machine No.</strong>
              </Label>
              <Select
                isClearable
                placeholder="Select machine no."
                options={machines.map((m) => ({ value: m.id, label: m.name }))}
                value={
                  machines
                    .filter((m) => m.id === formData.machine_id)
                    .map((m) => ({ value: m.id, label: m.name }))[0] || null
                }
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, machine_id: e.value }))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Quantity Plan</strong>
              </Label>
              <Input
                type="number"
                value={formData.quantity_plan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity_plan: e.target.value,
                  }))
                }
                placeholder="Enter quantity plan"
              />
            </FormGroup>
          </div>
          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label>
                <strong>Machine Status</strong>
              </Label>
              <Select
                value={
                  formData.status
                    ? { value: formData.status, label: formData.status }
                    : null
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e ? e.value : null,
                  }))
                }
                options={[
                  { value: "Setting", label: "Setting" },
                  { value: "Repair", label: "Repair" },
                  { value: "Running", label: "Running" },
                ]}
                isClearable
                placeholder="Select machine status"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <strong>Remarks</strong>
              </Label>
              <Input
                type="text"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, remarks: e.target.value }))
                }
                placeholder="Enter remark"
              />
            </FormGroup>
          </div>
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

export default NewProductionPlan;
