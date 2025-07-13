import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Upload } from '../../../../Constant';
import { Breadcrumbs } from '../../../../AbstractElements';
import ProjectContext from '../../../../_helper/Project/index';
import CustomizerContext from '../../../../_helper/Customizer';
import SalesReportList from './SalesReportList';
import UploadSalesReport from './UploadSalesReport';

const SalesReport = () => {
  const { layoutURL } = useContext(CustomizerContext);
  const [activeTab, setActiveTab] = useState('1');
  const { allData } = useContext(ProjectContext);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const toggleUploadModal = () => setUploadModalOpen(!uploadModalOpen);

  return (
    <Fragment>
      <Breadcrumbs parent="Sales" title="Sales Report" mainTitle="Sales Report" />
      <Container fluid={true}>
        <Row className="project-card">
          <Col md="12" className="project-list">
            <Card>
                <Row className="justify-content-end">
                <Col md="6">
                  <div className="text-end">
                    <button className="btn btn-primary" style={{ color: 'white' }} onClick={toggleUploadModal}><PlusCircle /> {Upload}</button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <SalesReportList />
          </Col>
        </Row>

      <UploadSalesReport isOpen={uploadModalOpen} toggle={toggleUploadModal} />
      </Container>
    </Fragment>
  );
};

export default SalesReport;