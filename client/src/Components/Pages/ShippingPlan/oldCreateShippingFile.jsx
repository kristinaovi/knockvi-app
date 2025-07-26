import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { DropdownButton, DropdownWithDropUp } from '../../../Constant';
import { Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu } from 'reactstrap';
import { Btn, H5 } from '../../../AbstractElements';

const NewShippingPlan = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New Shipping Plan</ModalHeader>
      <ModalBody>
        <form>
          <div className="mb-3">
            <label className="form-label">SHIPPING ID</label>
            <input type="text" className="form-control" placeholder="Enter PO Number" />
          </div>

          <div className="mb-3">
            <label className="form-label">SHIP METHOD</label>
            <CardBody>
            <select className="form-select">
              <option selected>SELECT METHOD</option>
              <option value="1">AIR</option>
              <option value="2">SEA</option>
            </select>
            </CardBody>
          </div>

          <div className="mb-3">
            <label className="form-label">PART CODE</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>

          <div className="mb-3">
            <label className="form-label">PART NAME</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">QUANTITY PLAN</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">PO</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">PRICE PERIOD</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
        </form>
      </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {
            // Simpan data PO di sini jika diperlukan
            toggle();
          }}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
    </Modal>
  );
};

export default NewShippingPlan;