import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { H5, UL, LI } from '../../../AbstractElements';
import { LightCardData2 } from '../../../Data/DefaultDashboard';
import { OptionsOverView, OptionsOverViewBarChart } from '../../../Data/Ecommerce/Chart';
import ReactApexChart from 'react-apexcharts';
import LightCardBox from '../Default/LightCardBox';
import { Filter } from 'lucide-react';   // ganti icon MoreVertical jadi Filter

const OrderOverview = () => {
  return (
    <Card>
      <CardHeader className='card-no-border d-flex justify-content-between align-items-center'>
        <H5>Graphic</H5>

        {/* Dropdown pilih tahun dengan icon Filter */}
        <UncontrolledDropdown>
          <DropdownToggle
            tag="span"
            data-bs-toggle="dropdown"
            aria-expanded={false}
            className="cursor-pointer"
          >
            <Filter size={18} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>2025</DropdownItem>
            <DropdownItem>2026</DropdownItem>
            <DropdownItem>2027</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>

      <CardBody className='pt-4'>
        <Row className='m-0 overall-card'>
          <Col xl='9' md='8' sm='7' className='box-col-7 p-3'>
            <div className='chart-right'>
              <Row>
                <Col xl='12'>
                  <CardBody className='p-0'>
                    <UL attrUL={{ horizontal: true, className: 'd-flex balance-data' }}>
                      <LI>
                        <span className='circle bg-secondary' />
                        <span className='f-light ms-1'>Order</span>
                      </LI>
                      <LI>
                        <span className='circle bg-primary' />
                        <span className='f-light ms-1'>Production</span>
                      </LI>
                      <LI>
                        <span className='circle bg-success' />
                        <span className='f-light ms-1'>Shipping</span>
                      </LI>
                    </UL>
                    <div className='current-sale-container order-container'>
                      <ReactApexChart
                        className='overview-wrapper'
                        type='line'
                        height={300}
                        options={OptionsOverView.options}
                        series={OptionsOverView.series}
                      />
                      <div className='back-bar-container'>
                        <ReactApexChart
                          type='bar'
                          height={180}
                          options={OptionsOverViewBarChart.options}
                          series={OptionsOverViewBarChart.series}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xl='3' md='4' sm='5' className='box-col-5 p-0'>
            <Row className='g-sm-3 g-2'>
              {LightCardData2.map((data, i) => (
                <Col key={i} md='12'>
                  <LightCardBox data={data} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default OrderOverview;
