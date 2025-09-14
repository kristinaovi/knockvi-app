import React, { Fragment, useContext, useState } from 'react';
import {
  Container, Row, Col, Card, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody
} from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Closed, All, Open, Add } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import ProjectContext from '../../../_helper/Project/index';
import CustomizerContext from '../../../_helper/Customizer';
import InventoryList from './InventoryList';
import NewInventory from './NewInventory'; // ✅ Import komponen modal form baru

const Inventory = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const { allData } = useContext(ProjectContext);

  // State modal Add Inventory
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Inventory" mainTitle="Inventory" />
      <Container fluid={true}>
        <Row className="project-card">
          <Col md="12" className="project-list">
            <Card>
              <Row>
                <Col md="6">
                  <Nav tabs className="border-tab">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                      >
                        <Target />
                        {All}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                      >
                        <Info />
                        {Open}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "active" : ""}
                        onClick={() => setActiveTab("3")}
                      >
                        <CheckCircle />
                        {Closed}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
                <Col md="6">
                  <div className="text-end">
                    <button
                      className="btn btn-primary me-2"
                      onClick={toggleModal}
                    >
                      <PlusCircle /> {Add}
                    </button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col>
            <InventoryList />
          </Col>
        </Row>
      </Container>

      {/* Modal Add Inventory */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Add New Inventory</ModalHeader>
        <ModalBody>
          <NewInventory toggleModal={toggleModal} />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default Inventory;
