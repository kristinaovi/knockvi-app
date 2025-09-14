import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  Input,
  Row,
  Col,
  Label,
  FormGroup
} from 'reactstrap';
import Select from 'react-select';
// Hooks
import usePurchaseOrders from '../../../../Hooks/usePurchaseOrders';
import usePurchaseOrderDetails from '../../../../Hooks/usePurchaseOrderDetails';
import useParts from '../../../../Hooks/useParts';

const NewPurchaseOrder = ({ isOpen, toggle, onSaved }) => {
  const { createOrUpdate: savePO } = usePurchaseOrders();
  const { createOrUpdate: savePOD } = usePurchaseOrderDetails();
  const { items: parts, fetchParts } = useParts();

  // Load parts once
  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // === HEADER STATE ===
  const [poInfo, setPoInfo] = useState({
    no: '',
    pecgi_no: '',
    ppap_no: '',
    issuer_id: 1,
    requested_date: ''
  });

  const handleHeaderChange = e => {
    const { name, value } = e.target;
    setPoInfo(prev => ({ ...prev, [name]: value }));
  };

  // === DETAIL STATE ===
  const [tableData, setTableData] = useState([]);
  const [newRows, setNewRows] = useState([]);

  const startAddNewRow = () => {
    setNewRows(prev => [
      ...prev,
      {
        PART_CODE: '',
        PART_NAME: '',
        REQUEST_DATE: '',
        PO_LINE: 0,
        QUANTITY: 0
      }
    ]);
  };

  const handleNewRowChange = (index, e) => {
    const { name, value } = e.target;
    setNewRows(prev => {
      const updated = [...prev];
      const row = { ...updated[index] };
      row[name] =
        name === 'QUANTITY' || name === 'PO_LINE'
          ? parseInt(value) || 0
          : value;
      if (name === 'PART_CODE') {
        const part = parts.find(p => p.id === parseInt(value));
        row.PART_NAME = part ? part.name : '';
      }
      updated[index] = row;
      return updated;
    });
  };

  const handleSaveAll = async () => {
    try {
      // Convert empty requested_date to null to avoid MySQL error
      const updatedPoInfo = {
        ...poInfo,
        requested_date: poInfo.requested_date || null
      };

      let finalTableData = [...tableData, ...newRows];
      const { id: poId } = await savePO(updatedPoInfo);
      await Promise.all(
        finalTableData.map(row =>
          savePOD({
            purchase_order_id: poId,
            part_id: row.PART_CODE,
            request_date: row.REQUEST_DATE || null,  // Also handle empty detail dates if needed
            line: row.PO_LINE,
            original_quantity: row.QUANTITY,
            price: 0
          })
        )
      );
      // Reset states
      setTableData([]);
      setNewRows([]);
      setPoInfo({
        no: '',
        pecgi_no: '',
        ppap_no: '',
        issuer_id: 1,
        requested_date: ''
      });
      if (onSaved) onSaved();
      toggle();
    } catch (err) {
      console.error(err);
      alert('Failed to save purchase order');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Purchase Order</ModalHeader>
      <ModalBody>
        {/* HEADER FORM */}
        <Row className="mb-4">
          <Col md={6}>
            <FormGroup>
              <Label>PECGI PO</Label>
              <Input
                name="pecgi_no"
                value={poInfo.pecgi_no}
                onChange={handleHeaderChange}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>PPAP PO</Label>
              <Input
                name="ppap_no"
                value={poInfo.ppap_no}
                onChange={handleHeaderChange}
              />
            </FormGroup>
          </Col>
        </Row>
        {/* DETAIL TABLE */}
        <div className="table-responsive">
          <Table bordered striped>
            <thead>
              <tr>
                <th>PART CODE</th>
                <th>PART NAME</th>
                <th>REQUEST DATE</th>
                <th>PO LINE</th>
                <th>QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr key={`saved-${idx}`}>
                  <td>
                    {parts.find(p => p.id === item.PART_CODE)?.code ||
                      item.PART_CODE}
                  </td>
                  <td>{item.PART_NAME}</td>
                  <td>{item.REQUEST_DATE}</td>
                  <td>{item.PO_LINE}</td>
                  <td>{item.QUANTITY}</td>
                </tr>
              ))}
              {newRows.map((row, idx) => (
                <tr key={`new-${idx}`}>
                  <td>
                    <Select
                      options={parts.map(p => ({
                        value: p.id,
                        label: `${p.code} - ${p.name}`
                      }))}
                      value={
                        parts
                          .filter(p => p.id === row.PART_CODE)
                          .map(p => ({ value: p.id, label: p.code }))[0] ||
                        null
                      }
                      onChange={opt =>
                        handleNewRowChange(idx, {
                          target: { name: 'PART_CODE', value: opt.value }
                        })
                      }
                      name="PART_CODE"
                    />
                  </td>
                  <td>
                    <Input readOnly value={row.PART_NAME} />
                  </td>
                  <td>
                    <Input
                      type="date"
                      name="REQUEST_DATE"
                      value={row.REQUEST_DATE}
                      onChange={e => handleNewRowChange(idx, e)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="PO_LINE"
                      value={row.PO_LINE}
                      onChange={e => handleNewRowChange(idx, e)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="QUANTITY"
                      value={row.QUANTITY}
                      onChange={e => handleNewRowChange(idx, e)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-center">
                  <Button size="sm" color="primary" onClick={startAddNewRow}>
                    + Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        {/* SAVE ALL BUTTON */}
        <div className="d-flex justify-content-end mt-3">
          <Button color="primary" onClick={handleSaveAll}>
            SAVE
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NewPurchaseOrder;
