// src/components/NewPurchaseOrder.jsx
import React, { useState, useEffect } from 'react'
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
} from 'reactstrap'
import Select from 'react-select';

// Hooks
import usePurchaseOrders from '../../../../Hooks/usePurchaseOrders'
import usePurchaseOrderDetails from '../../../../Hooks/usePurchaseOrderDetails'
import useParts from '../../../../Hooks/useParts'

const NewPurchaseOrder = ({ isOpen, toggle }) => {
  const { createOrUpdate: savePO } = usePurchaseOrders()
  const { createOrUpdate: savePOD } = usePurchaseOrderDetails()
  const { items: parts, fetchParts } = useParts()

  // Load parts once
  useEffect(() => {
    fetchParts()
  }, [fetchParts])

  // === HEADER STATE & HANDLER ===
  const [poInfo, setPoInfo] = useState({
    no: '',
    pecgi_no: '',
    ppap_no: '',
    issuer_id: 1,
    requested_date: '',
  })

  const handleHeaderChange = e => {
    const { name, value } = e.target
    setPoInfo(prev => ({ ...prev, [name]: value }))
  }

  // === DETAIL STATE & HANDLERS ===
  const [newRow, setNewRow] = useState(null)
  const [tableData, setTableData] = useState([])

  const startAddNewRow = () =>
    setNewRow({
      PART_CODE: '',
      PART_NAME: '',
      REQUEST_DATE: '',
      PO_LINE: 0,
      QUANTITY: 0
    })
  const cancelNewRow = () => setNewRow(null)

  const handleNewRowChange = e => {
    const { name, value } = e.target
    setNewRow(prev => {
      const next = {
        ...prev,
        [name]:
          name === 'QUANTITY' || name === 'PO_LINE'
            ? parseInt(value) || 0
            : value
      }
      // auto‑fill PART_NAME on code select
      if (name === 'PART_CODE') {
        const part = parts.find(p => p.id === parseInt(value))
        next.PART_NAME = part ? part.name : ''
      }
      return next
    })
  }

  const saveNewRow = () => {
    if (!newRow.PART_CODE) {
      alert('Please select a part')
      return
    }
    setTableData([...tableData, newRow])
    setNewRow(null)
  }

  // === SAVE ALL ===
  const handleSaveAll = async () => {
    try {
      // 1) Save PO header
      const { id: poId } = await savePO(poInfo)

      // 2) Save each detail row
      await Promise.all(
        tableData.map(row =>
          savePOD({
            purchase_order_id: poId,
            part_id: row.PART_CODE,
            request_date: row.REQUEST_DATE,
            line: row.PO_LINE,
            original_quantity: row.QUANTITY,
            price: 0
          })
        )
      )

      // reset & close
      setTableData([])
      setPoInfo({ no: '', pecgi_no: '', ppap_no: '', issuer_id: 1, requested_date: '' })
      toggle()
    } catch (err) {
      console.error(err)
      alert('Failed to save purchase order')
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Purchase Order</ModalHeader>
      <ModalBody>

        {/* HEADER FORM */}
        <Row form className="mb-4">
          <Col md={3}>
            <FormGroup>
              <Label>PO Number</Label>
              <Input
                name="no"
                value={poInfo.no}
                onChange={handleHeaderChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label>PECIG PO</Label>
              <Input
                name="pecgi_no"
                value={poInfo.pecgi_no}
                onChange={handleHeaderChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label>PPAP PO</Label>
              <Input
                name="ppap_no"
                value={poInfo.ppap_no}
                onChange={handleHeaderChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              {/* <Label>Issuer ID</Label>
              <Input
                type="number"
                name="issuer_id"
                value={poInfo.issuer_id}
                onChange={handleHeaderChange}
              /> */}
              <Label>Requested Date</Label>
              <Input
                type="date"
                name="requested_date"
                value={poInfo.requested_date || ''}
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
                {/* <th></th>  */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    {parts.find(p => p.id === item.PART_CODE)?.code ||
                      item.PART_CODE}
                  </td>
                  <td>{item.PART_NAME}</td>
                  <td>{item.REQUEST_DATE}</td>
                  <td>{item.PO_LINE}</td>
                  <td>{item.QUANTITY}</td>
                  <td>{/* optional delete btn */}</td>
                </tr>
              ))}

              {newRow && (
                <tr>
                  <td>
                  <Select
                      options={parts.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
                      value={
                        parts
                          .filter(p => p.id === newRow.PART_CODE)
                          .map(p => ({ value: p.id, label: p.code }))[0] 
                          || null
                      }
                      onChange={opt =>
                        handleNewRowChange({
                          target: { name: 'PART_CODE', value: opt.value }
                        })
                      }
                      name="PART_CODE"
                      className="js-example-basic-single"
                    />
                  </td>
                  <td>
                    <Input readOnly value={newRow.PART_NAME} />
                  </td>
                  <td>
                    <Input
                      type="date"
                      name="REQUEST_DATE"
                      value={newRow.REQUEST_DATE}
                      onChange={handleNewRowChange}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="PO_LINE"
                      value={newRow.PO_LINE}
                      onChange={handleNewRowChange}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="QUANTITY"
                      value={newRow.QUANTITY}
                      onChange={handleNewRowChange}
                    />
                  </td>
                  {/* <td>
                    <Button
                      color="success"
                      size="sm"
                      onClick={saveNewRow}
                    >
                      Save
                    </Button>{' '}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={cancelNewRow}
                    >
                      Cancel
                    </Button>
                  </td> */}
                </tr>
              )}

              <tr>
                <td colSpan="6" className="text-center">
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
            SAVE PURCHASE ORDER
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default NewPurchaseOrder
