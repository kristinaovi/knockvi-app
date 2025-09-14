import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const NewInventory = ({ toggleModal, onSuccess }) => {
  const [formData, setFormData] = useState({
    partId: "",
    partName: "",
    machineNo: "",
    machineStatus: "",
    quantity: "",
  });

  // Dummy data (statis)
  const parts = [
    { id: 1, code: "BTY2AAC001", name: "Case 123A" },
    { id: 2, code: "BTY2AAC002", name: "Case 456B" },
    { id: 3, code: "BTY2AAC003", name: "Case 789C" },
  ];

  const machines = [
    { id: 1, name: "TR-01" },
    { id: 2, name: "TR-02" },
    { id: 3, name: "DTR-13" },
    { id: 4, name: "DTR-14" },
    { id: 5, name: "PD-12" },
    { id: 6, name: "PD-50" },
    { id: 7, name: "PD-60" },
  ];

  const handleSave = () => {
    console.log("New Inventory Data:", formData);

    if (onSuccess) onSuccess(); // Bisa untuk refresh parent
    toggleModal(); // Tutup modal
    setFormData({
      partId: "",
      partName: "",
      machineNo: "",
      machineStatus: "",
      quantity: "",
    });
  };

  return (
    <Form className="d-flex mb-4">
      <div className="me-3" style={{ flex: 1 }}>
        {/* Part ID Dropdown */}
        <FormGroup>
          <Label><strong>Part ID</strong></Label>
          <Input
            type="select"
            name="partId"
            value={formData.partId || ""}
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedPart = parts.find(p => p.code === selectedCode);
              setFormData(prev => ({
                ...prev,
                partId: selectedCode,
                partName: selectedPart ? selectedPart.name : ""
              }));
            }}
          >
            <option value="">-- Select Part ID --</option>
            {parts.map(part => (
              <option key={part.id} value={part.code}>
                {part.code}
              </option>
            ))}
          </Input>
        </FormGroup>

        {/* Machine No. Dropdown */}
        <FormGroup>
          <Label><strong>Total Stock</strong></Label>
          <Input
            type="select"
            name="machineNo"
            value={formData.machineNo || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, machineNo: e.target.value }))}
          >
            <option value="">-- Select From Production Output --</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.name}>
                {machine.name}
              </option>
            ))}
          </Input>
        </FormGroup>

      </div>

      <div style={{ flex: 1 }}>
        {/* Part Name (Auto from Part ID) */}
        <FormGroup>
          <Label><strong>Part Name</strong></Label>
          <Input
            type="text"
            name="partName"
            readOnly
            value={formData.partName || ""}
          />
        </FormGroup>

        {/* Machine Status Dropdown */}
        <FormGroup>
          <Label><strong>Finish Good</strong></Label>
          <Input
            type="number"
          />
        </FormGroup>

        <div className="text-end mt-3">
          <Button color="success" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default NewInventory;
