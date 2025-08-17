// src/components/NewShippingPlan.jsx
import React, { useState, useEffect } from 'react'
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
} from 'reactstrap'
import Select from 'react-select'

import useShippingPlans from '../../../Hooks/useShippingPlans'
import useShippingPlanDetail from '../../../Hooks/useShippingPlanDetail'
import usePurchaseOrderDetails from '../../../Hooks/usePurchaseOrderDetails'
import useParts from '../../../Hooks/useParts'

const NewProductionPlan = ({ isOpen, toggle }) => {
  const { createOrUpdate: saveSP } = useShippingPlans()
  const { createOrUpdate: saveSPD } = useShippingPlanDetail()

  const {
    items: poDetails,
    fetchAll: fetchPODetails
  } = usePurchaseOrderDetails()
  const { items: parts, fetchParts } = useParts()

  const [shippingInfo, setShippingInfo] = useState({
    etd_nkb:       '',
    booking_number:'',
    container_name:'',
    etd_cust:      '',
    vessel_name:   '',
    invoice_id:    ''
  })

  const initialRow = {
    POD:            '',
    partName:       '',
    price:           0,
    quantityPlan:    0,
    cartonPlan:      0,
    palletePlan:     0,
    actualQuantity:  '',
    cartonActual:    0,
    palleteActual:   0
  }
  const [newRow, setNewRow]       = useState(null)
  const [tableData, setTableData] = useState([])

  // Re-fetch PO-details *from the server* whenever the user picks a new ETA Cust
  useEffect(() => {
    // first clear any in‑flight row
    setNewRow(null)
    // fetch only those details matching request_date = etd_cust
    fetchPODetails({ request_date: shippingInfo.etd_cust })
  }, [shippingInfo.etd_cust, fetchPODetails])

  // parts only need to be fetched once
  useEffect(() => {
    fetchParts()
  }, [fetchParts])

  const handleShippingChange = e => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const startAddNewRow = () => setNewRow({ ...initialRow })
  const cancelNewRow   = ()    => setNewRow(null)

  const handleNewRowChange = (field, value) => {
    setNewRow(prev => {
      const next = { ...prev, [field]: value }

      if (field === 'POD') {
        const detail = poDetails.find(d => d.id === value)
        if (detail) {
          const part = parts.find(p => p.id === detail.part_id) || {}
          const cartonQty = part.pack_carton_quantity || 1

          next.partName     = part.name || ''
          next.price        = detail.price
          next.quantityPlan = detail.original_quantity
          next.cartonPlan   = Math.ceil(detail.original_quantity / cartonQty)
          next.palletePlan  = Math.ceil(next.cartonPlan / 36)
        }
      }

      if (field === 'actualQuantity') {
        const part = parts.find(p => p.name === prev.partName) || {}
        const cartonQty = part.pack_carton_quantity || 1

        next.cartonActual  = Math.ceil(value / cartonQty)
        next.palleteActual = Math.ceil(next.cartonActual / 36)
      }

      return next
    })
  }

  const saveNewRow = () => {
    if (!newRow.POD) {
      return alert('Please select a PO item (after choosing ETA Cust).')
    }
    setTableData(td => [...td, newRow])
    setNewRow(null)
  }

  const handleSaveAll = async () => {
    try {
      // save header
      const { id: spId } = await saveSP(shippingInfo)
      // save each detail
      await Promise.all(
        tableData.map(row =>
          saveSPD({
            shipping_plan_id: spId,
            purchase_order_detail_id: row.POD,
            actual_quantity: row.actualQuantity,
            carton: row.cartonActual,
            pallete: row.palleteActual
          })
        )
      )
      // reset
      setTableData([])
      setShippingInfo({
        etd_nkb:'', booking_number:'', container_name:'',
        etd_cust:'', vessel_name:'', invoice_id:''
      })
      toggle()
    } catch (err) {
      console.error(err)
      alert('Failed to save shipping plan')
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add New Shipping Plan</ModalHeader>
      <ModalBody>
        {/* Header form */}
        <Form className="d-flex mb-4">
          <div className="me-3" style={{ flex: 1 }}>
            <FormGroup>
              <Label><strong>ETD NKB</strong></Label>
              <Input
                type="date"
                name="etd_nkb"
                value={shippingInfo.etd_nkb}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label><strong>Booking No</strong></Label>
              <Input
                name="booking_number"
                value={shippingInfo.booking_number}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label><strong>Container</strong></Label>
              <Input
                name="container_name"
                value={shippingInfo.container_name}
                onChange={handleShippingChange}
              />
            </FormGroup>
          </div>
          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label><strong>ETA Cust</strong></Label>
              <Input
                type="date"
                name="etd_cust"
                value={shippingInfo.etd_cust}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label><strong>Vessel</strong></Label>
              <Input
                name="vessel_name"
                value={shippingInfo.vessel_name}
                onChange={handleShippingChange}
              />
            </FormGroup>
            <FormGroup>
              <Label><strong>Invoice No</strong></Label>
              <Input
                name="invoice_id"
                value={shippingInfo.invoice_id}
                onChange={handleShippingChange}
              />
            </FormGroup>
          </div>
        </Form>

        {/* Details */}
        <div className="table-responsive">
          <Table bordered striped>
            <thead>
              <tr>
                <th>PO Item</th>
                <th>Price</th>
                <th>Plan Qty</th>
                <th>Plan Carton</th>
                <th>Plan Pallete</th>
                <th>Actual Qty</th>
                <th>Actual Carton</th>
                <th>Actual Pallete</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td>{poDetails.find(d => d.id === row.POD)?.line}</td>
                  <td>{row.price}</td>
                  <td>{row.quantityPlan}</td>
                  <td>{row.cartonPlan}</td>
                  <td>{row.palletePlan}</td>
                  <td>{row.actualQuantity}</td>
                  <td>{row.cartonActual}</td>
                  <td>{row.palleteActual}</td>
                  <td>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() =>
                        setTableData(td => td.filter((_, i) => i !== idx))
                      }
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}

              {newRow && (
                <tr>
                  <td style={{ minWidth: 200 }}>
                    <Select
                      options={poDetails.map(d => ({
                        value: d.id,
                        label: d.line
                      }))}
                      isDisabled={!shippingInfo.etd_cust}
                      placeholder={
                        shippingInfo.etd_cust
                          ? 'Select PO item…'
                          : 'Pick ETA Cust first'
                      }
                      value={
                        newRow.POD
                          ? { value: newRow.POD, label: poDetails.find(d => d.id === newRow.POD)?.line }
                          : null
                      }
                      onChange={opt => handleNewRowChange('POD', opt.value)}
                    />
                  </td>
                  <td><Input readOnly value={newRow.price} /></td>
                  <td><Input readOnly value={newRow.quantityPlan} /></td>
                  <td><Input readOnly value={newRow.cartonPlan} /></td>
                  <td><Input readOnly value={newRow.palletePlan} /></td>
                  <td>
                    <Input
                      type="number"
                      value={newRow.actualQuantity}
                      onChange={e =>
                        handleNewRowChange(
                          'actualQuantity',
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </td>
                  <td><Input readOnly value={newRow.cartonActual} /></td>
                  <td><Input readOnly value={newRow.palleteActual} /></td>
                  <td>
                    <Button
                      color="success"
                      size="sm"
                      onClick={saveNewRow}
                    >
                      ✓
                    </Button>{' '}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={cancelNewRow}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              )}

              <tr>
                <td colSpan="9" className="text-center">
                  <Button color="primary" size="sm" onClick={startAddNewRow}>
                    + Add Row
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Save */}
        <div className="text-end mt-3">
          <Button color="success" onClick={handleSaveAll}>
            Save
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default NewProductionPlan
