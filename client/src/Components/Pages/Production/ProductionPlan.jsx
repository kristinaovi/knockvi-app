import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Closed, All, Open, Add, } from '../../../Constant';
import { Breadcrumbs } from '../../../AbstractElements';
import ProjectContext from '../../../_helper/Project/index';
import CustomizerContext from '../../../_helper/Customizer';
import ProductionPlanList from './ProductionPlanList';

const ProductionPlan = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const { allData } = useContext(ProjectContext);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Production" title="Production Plan & Monitoring" mainTitle="Production Plan & Monitoring"/>
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
              </Row>
            </Card>
          </Col>
          <Col>
            <ProductionPlanList />
          </Col>
          
        </Row>

      </Container>
    </Fragment>
  );
};

export default ProductionPlan;