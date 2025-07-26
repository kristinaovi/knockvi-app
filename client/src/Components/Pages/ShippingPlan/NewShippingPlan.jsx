import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';


const NewShippingPlan = ({ isOpen, toggle }) => {
  const [shippingInfo, setShippingInfo] = useState({
    etdNKB: '',
    bookingID: '',
    contID: '',
    etaCust: '',
    vesselID: '',
    invNo: '',
  });

  const [newRow, setNewRow] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: name.includes('QUANTITY') || name.includes('TOTAL') ? parseInt(value) || 0 : value,
    }));
  };

  const startAddNewRow = () => {
    setNewRow({
      PART_CODE: '',
      PART_NAME: '',
      QUANTITY_PLAN: 0,
      PO: '',
      PRICE_PERIOD: '',
      TOTAL_CARTON: 0,
      TOTAL_PALLETE: 0,
    });
  };

  const cancelNewRow = () => setNewRow(null);

  const saveNewRow = () => {
    if (!newRow.PART_CODE || !newRow.PART_NAME) return alert("Please fill in required fields.");
    setTableData([...tableData, newRow]);
    setNewRow(null);
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h5 className="mb-0">Add New Shipping Plan</h5>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* FORM INFO */}
        <Form className="d-flex justify-content-between flex-fill">
          <div className="w-50 me-3">
            <FormGroup className="mb-3">
              <Label for="etdNKB"><strong>ETD NKB</strong></Label>
              <Input type="date" name="etdNKB" id="etdNKB" value={shippingInfo.etdNKB} onChange={handleChange} />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="bookingID"><strong>Booking No</strong></Label>
              <Input type="text" name="bookingID" id="bookingID" value={shippingInfo.bookingID} onChange={handleChange} />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="contID"><strong>Container</strong></Label>
              <Input type="text" name="contID" id="contID" value={shippingInfo.contID} onChange={handleChange} />
            </FormGroup>
          </div>

          <div className="w-50 ms-3">
            <FormGroup className="mb-3">
              <Label for="etaCust"><strong>ETA Cust</strong></Label>
              <Input type="date" name="etaCust" id="etaCust" value={shippingInfo.etaCust} onChange={handleChange} />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="vesselID"><strong>Vessel</strong></Label>
              <Input type="text" name="vesselID" id="vesselID" value={shippingInfo.vesselID} onChange={handleChange} />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="invNo"><strong>Invoice No</strong></Label>
              <Input type="text" name="invNo" id="invNo" value={shippingInfo.invNo} onChange={handleChange} />
            </FormGroup>
          </div>
        </Form>

        {/* TABEL */}
        <div className="table-responsive mt-4">
          <Table bordered striped>
            <thead>
              <tr>
                <th>PART CODE</th>
                <th>PART NAME</th>
                <th>QUANTITY PLAN</th>
                <th>PO</th>
                <th>PRICE PERIOD</th>
                <th>TOTAL CARTON</th>
                <th>TOTAL PALLETE</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan data yang sudah disimpan */}
              {tableData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.PART_CODE}</td>
                  <td>{item.PART_NAME}</td>
                  <td>{item.QUANTITY_PLAN}</td>
                  <td>{item.PO}</td>
                  <td>{item.PRICE_PERIOD}</td>
                  <td>{item.TOTAL_CARTON}</td>
                  <td>{item.TOTAL_PALLETE}</td>
                </tr>
              ))}

              {/* Form input row */}
              {newRow && (
                <tr>
                  <td><Input value={newRow.PART_CODE} name="PART_CODE" onChange={handleNewRowChange} /></td>
                  <td><Input value={newRow.PART_NAME} name="PART_NAME" onChange={handleNewRowChange} /></td>
                  <td><Input type="number" value={newRow.QUANTITY_PLAN} name="QUANTITY_PLAN" onChange={handleNewRowChange} /></td>
                  <td><Input value={newRow.PO} name="PO" onChange={handleNewRowChange} /></td>
                  <td><Input value={newRow.PRICE_PERIOD} name="PRICE_PERIOD" onChange={handleNewRowChange} /></td>
                  <td><Input type="number" value={newRow.TOTAL_CARTON} name="TOTAL_CARTON" onChange={handleNewRowChange} /></td>
                  <td>
                    <Input type="number" value={newRow.TOTAL_PALLETE} name="TOTAL_PALLETE" onChange={handleNewRowChange} />
                    <div className="d-flex gap-1 mt-1">
                      <Button color="success" size="sm" onClick={saveNewRow}>Save</Button>
                      <Button color="danger" size="sm" onClick={cancelNewRow}>Cancel</Button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Baris tambah data */}
              <tr>
                <td colSpan="9" className="text-center">
                  <Button size="sm" color="success" onClick={startAddNewRow}>+ Add New Data</Button>
                </td>
              </tr>
            </tbody>
          </Table>
            <div className="d-flex justify-content-end mt-3">
              <Button color="primary">SAVE</Button>
            </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NewShippingPlan;
