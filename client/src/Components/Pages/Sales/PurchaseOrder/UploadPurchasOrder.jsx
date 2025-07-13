import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

const UploadPurchaseOrder = ({ isOpen, toggle }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    // 👉 Tambahkan logika upload ke server di sini (mis. pakai fetch atau axios)
    console.log("File uploaded:", selectedFile);

    toggle(); // Tutup modal setelah upload
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Upload Purchase Order</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="uploadPO">Select PO File (e.g. .xlsx / .csv / .pdf)</Label>
          <Input
            type="file"
            name="file"
            id="uploadPO"
            onChange={handleFileChange}
            accept=".xlsx,.csv,.pdf"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpload}>
          Upload
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UploadPurchaseOrder;
