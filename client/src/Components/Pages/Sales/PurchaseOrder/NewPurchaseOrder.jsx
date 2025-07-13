import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const NewPurchaseOrder = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New Purchase Order</ModalHeader>
      <ModalBody>
        <form>
          <div className="mb-3">
            <label className="form-label">PART ID</label>
            <input type="text" className="form-control" placeholder="Enter PO Number" />
          </div>

          <div className="mb-3">
            <label className="form-label">PART NAME</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>

          <div className="mb-3">
            <label className="form-label">PECGI PO</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">PPAP PO</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">REQUEST DATE</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">LINE</label>
            <input type="text" className="form-control" placeholder="Enter Customer Name" />
          </div>

          <div className="mb-3">
            <label className="form-label">QTY</label>
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

export default NewPurchaseOrder;
