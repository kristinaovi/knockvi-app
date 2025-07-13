import React, { Fragment } from "react";
import { Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";

import WidgetsWrapper from "./WidgetsWraper";
import OrderOverview from "./OrderOverview";
import MonthlyProfits from "./MonthlyProfits";
import ShippingSummary from "./ShippingSummary";
import TestReqSummary from "./TestReqSummary";
import CustInfoSummary from "./CustInfoSummary";

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Default" parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <WidgetsWrapper />
          <Row className="g-3 mb-3">
            <Col  xl="3" md="4">
              <MonthlyProfits />
            </Col>
            <Col xl="9" md="8">
              <OrderOverview />
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col xl="6" md="8">
              <CustInfoSummary />
            </Col>
            <Col xl="6" md="8">
              <TestReqSummary />
            </Col>
          </Row>

          <ShippingSummary />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
