import React from 'react';
import { Col, Row } from 'reactstrap';
import { Widgets2Data, Widgets2Data2, WidgetsData, WidgetsData2, WidgetsData3, WidgetsData4 } from '../../../Data/DefaultDashboard';
import Widgets1 from '../../Common/CommonWidgets/Widgets1';
import Widgets2 from '../../Common/CommonWidgets/Widgets2';

const WidgetsWrapper = () => {
  return (
    <>
      <Row>
        <Col xl="3" md="6" sm="12">
          <Widgets1 data={WidgetsData} />
        </Col>

        <Col xl="3" md="6" sm="12">
          <Widgets1 data={WidgetsData2} />
        </Col>

        <Col xl="3" md="6" sm="12">
          <Widgets1 data={WidgetsData3} />
        </Col>

        <Col xl="3" md="6" sm="12">
          <Widgets1 data={WidgetsData4} />
        </Col>
      </Row>
    </>
  );
};

export default WidgetsWrapper;
