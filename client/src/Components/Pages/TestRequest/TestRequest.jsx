import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Closed, All, Open, Add, Upload } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import ProjectContext from '../../../_helper/Project/index';
import CustomizerContext from '../../../_helper/Customizer';
import TestRequestList from './TestRequestList';
import NewTestRequest from './NewTestRequest';
import UploadTestRequest from './UploadTestRequest';

const TestRequest = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const { allData } = useContext(ProjectContext);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Customer Information" mainTitle="Customer Information" />
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
                    <button className="btn btn-primary me-2" onClick={toggleModal}><PlusCircle /> {Add}</button>
                    <button className="btn btn-primary" style={{ color: 'white' }} onClick={toggleUploadModal}><PlusCircle /> {Upload}</button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <TestRequestList />
          </Col>
          
        </Row>

      <UploadTestRequest isOpen={uploadModalOpen} toggle={toggleUploadModal} />
      <NewTestRequest isOpen={modalOpen} toggle={toggleModal} />
      </Container>
    </Fragment>
  );
};

export default TestRequest;