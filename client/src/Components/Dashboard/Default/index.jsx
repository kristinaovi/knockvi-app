import React, { Fragment } from "react";
import { Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";

import OrderOverview from "./OrderOverview";
import MonthlyProfits from "./MonthlyProfits";
import ShippingList from "../../../../src/Components/Pages/ShippingPlan/ShippingPlanList";

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
<Row className="g-3 mb-3 align-items-stretch">
  <Col xl="3" md="4" style={{ display: "flex" }}>
    <MonthlyProfits />
  </Col>
  <Col xl="9" md="8">
    <OrderOverview />
  </Col>
</Row>


          <ShippingList />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
