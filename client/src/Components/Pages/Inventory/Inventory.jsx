import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Closed, All, Open, Add, } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import ProjectContext from '../../../_helper/Project/index';
import CustomizerContext from '../../../_helper/Customizer';
import InventoryList from './InventoryList';

const Inventory = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const { allData } = useContext(ProjectContext);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Inventory" mainTitle="Inventory"/>
      <Container fluid={true}>
        <Row className="project-card">
          <Col>
            <InventoryList />
          </Col>
          
        </Row>

      </Container>
    </Fragment>
  );
};

export default Inventory;