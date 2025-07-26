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


const NewPurchaseOrder = ({ isOpen, toggle }) => {
  const [poInfo, setpoInfo] = useState({
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
    setpoInfo((prev) => ({
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
      PECGI_PO: 0,
      PPAP_PO: 0,
      REQUEST_DATE: '',
      PO_LINE: 0,
      QUANTITY: 0,
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
          <h5 className="mb-0">Add New Purchase Order</h5>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* TABEL */}
        <div className="table-responsive mt-4">
          <Table bordered striped>
            <thead>
              <tr>
                <th>PART CODE</th>
                <th>PART NAME</th>
                <th>PECGI PO</th>
                <th>PPAP PO</th>
                <th>REQUEST DATE</th>
                <th>PO LINE</th>
                <th>QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan data yang sudah disimpan */}
              {tableData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.PART_CODE}</td>
                  <td>{item.PART_NAME}</td>
                  <td>{item.PECGI_PO}</td>
                  <td>{item.PPAP_PO}</td>
                  <td>{item.REQUEST_DATE}</td>
                  <td>{item.PO_LINE}</td>
                  <td>{item.QUANTITY}</td>
                </tr>
              ))}

              {/* Form input row */}
              {newRow && (
                <tr>
                  <td><Input value={newRow.PART_CODE} name="PART_CODE" onChange={handleNewRowChange} /></td>
                  <td><Input value={newRow.PART_NAME} name="PART_NAME" onChange={handleNewRowChange} /></td>
                  <td><Input value={newRow.PECGI_PO} name="PECGI_PO" onChange={handleNewRowChange} /></td>
                  <td><Input type="number" value={newRow.PPAP_PO} name="PPAP_PO" onChange={handleNewRowChange} /></td>
                  <td><Input type="date" value={newRow.REQUEST_DATE} name="REQUEST_DATE" onChange={handleNewRowChange} /></td>
                  <td><Input type="number" value={newRow.PO_LINE} name="PO_LINE" onChange={handleNewRowChange} /></td>
                  <td>
                    <Input type="number" value={newRow.QUANTITY} name="QUANTITY" onChange={handleNewRowChange} />
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
                  <Button size="sm" color="primary" onClick={startAddNewRow}>+ Add New Data</Button>
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

export default NewPurchaseOrder;
