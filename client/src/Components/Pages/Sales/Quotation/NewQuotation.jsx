import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';

const NewQuotation = ({ isOpen, toggle }) => {
  const [quotInfo, setQuotInfo] = useState({
    etdNKB: '',
    bookingID: '',
    contID: '',
    etaCust: '',
    vesselID: '',
    invNo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuotInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Save Quotation Info:", quotInfo);
    // Tambahkan logic simpan ke server di sini jika dibutuhkan
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h5 className="mb-0">Add New Quotation</h5>
      </ModalHeader>

      <ModalBody>
        {/* FORM INFO */}
        <Form className="d-flex justify-content-between flex-fill">
          <div className="w-50 me-3">
            <FormGroup className="mb-3">
              <Label for="etdNKB"><strong>ETD NKB</strong></Label>
              <Input
                type="date"
                name="etdNKB"
                id="etdNKB"
                value={quotInfo.etdNKB}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="bookingID"><strong>Booking No</strong></Label>
              <Input
                type="text"
                name="bookingID"
                id="bookingID"
                value={quotInfo.bookingID}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="contID"><strong>Container</strong></Label>
              <Input
                type="text"
                name="contID"
                id="contID"
                value={quotInfo.contID}
                onChange={handleChange}
              />
            </FormGroup>
          </div>

          <div className="w-50 ms-3">
            <FormGroup className="mb-3">
              <Label for="etaCust"><strong>ETA Cust</strong></Label>
              <Input
                type="date"
                name="etaCust"
                id="etaCust"
                value={quotInfo.etaCust}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="vesselID"><strong>Vessel</strong></Label>
              <Input
                type="text"
                name="vesselID"
                id="vesselID"
                value={quotInfo.vesselID}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="invNo"><strong>Invoice No</strong></Label>
              <Input
                type="text"
                name="invNo"
                id="invNo"
                value={quotInfo.invNo}
                onChange={handleChange}
              />
            </FormGroup>
          </div>
        </Form>

        {/* Tombol Save */}
        <div className="d-flex justify-content-end mt-3">
          <Button color="primary" onClick={handleSave}>
            SAVE
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NewQuotation;
