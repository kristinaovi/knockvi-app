import React, { Fragment, useContext, useState, useRef } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import { PlusCircle } from 'react-feather';
import { Add } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import ProjectContext from '../../../_helper/Project/index';
import CustomizerContext from '../../../_helper/Customizer';
import UserList from './UserList';
import NewUser from './NewUser';

const User = () => {
  const { layoutURL } = useContext(CustomizerContext);
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
                <Col md="6"></Col>
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
