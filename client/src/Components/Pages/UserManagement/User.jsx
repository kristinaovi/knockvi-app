import React, { Fragment, useContext, useState, useRef } from 'react';
import { Container, Row, Col, Card, Nav, NavItem, NavLink, } from 'reactstrap';
import { Add, Closed, All, Open, } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import CustomizerContext from '../../../_helper/Customizer';
import UserList from './UserList';
import NewUser from './NewUser';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';

const User = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Reference ke UserList untuk refresh
  const userListRef = useRef(null);

  // Fungsi yang dipanggil setelah user berhasil ditambahkan
  const handleUserAdded = () => {
    if (userListRef.current) {
      userListRef.current.refreshUsers();
    }
  };

  return (
    <Fragment>
      <Breadcrumbs parent="User Management" mainTitle="User Management" />
      <Container fluid={true}>
        <Row className="project-card">
          <Col md="12" className="project-list">
            <Card>
              <Row>
                <Col md="6">
                  <Nav tabs className="border-tab">
                    <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><Target />{All}</NavLink></NavItem>
                    <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><Info />{Open}</NavLink></NavItem>
                    <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><CheckCircle />{Closed}</NavLink></NavItem>
                  </Nav>
                </Col>
                <Col md="6">
                  <div className="text-end">
                    <button className="btn btn-primary me-2" onClick={toggleModal}>
                      <PlusCircle /> {Add}
                    </button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <UserList ref={userListRef} />
          </Col>
        </Row>

        <NewUser isOpen={modalOpen} toggle={toggleModal} onSave={handleUserAdded} />
      </Container>
    </Fragment>
  );
};

export default User;
