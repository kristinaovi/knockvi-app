import React, { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { Package, Factory, Truck } from "lucide-react";
import { H5, UL, LI } from '../../../AbstractElements'
import ReactApexChart from 'react-apexcharts'
import LightCardBox from '../Default/LightCardBox'
import { Filter } from 'lucide-react'
import api from '../../../api/axios'
import { LightCardData2 } from '../../../Data/DefaultDashboard'

const OrderOverview = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [lineChart, setLineChart] = useState({ series: [], options: {} })
  const [barChart, setBarChart] = useState({ series: [], options: {} })
  const [yearlyCardData, setYearlyCardData] = useState([]);

  const fetchOverviewData = async (selectedYear = year) => {
  try {
    const res = await api.get(`/dashboards/overview?year=${selectedYear}`)
    const { months, total_order, production, shipping } = res.data.data || {} // Destructure data directly

    // Check if data is available
    if (!months || !total_order || !production || !shipping) {
      console.warn('API data structure is incomplete or missing.')
      return
    }

    // Assign categories (months) and data series
    const categories = months
    const orders = total_order.map(Number)
    const productions = production.map(Number)
    const shippings = shipping.map(Number)

    // LINE CHART
    setLineChart({
      series: [
        { name: 'Order', data: orders },
        { name: 'Production', data: productions },
        { name: 'Shipping', data: shippings },
      ],
      options: {
        chart: { type: 'line', toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories }, // Use categories (months) here
        colors: ['#6c757d', '#007bff', '#28a745'],
        legend: {
          position: 'top',
          labels: { colors: ['var(--chart-text-color)'] },
        },
        grid: { borderColor: '#f3f3f3' },
        tooltip: { theme: 'light' },
      },
    })

    // BAR CHART
    setBarChart({
      series: [
        {
          name: 'Total Volume',
          data: orders.map(
            (order, index) => order + productions[index] + shippings[index] // Sum up the metrics
          ),
        },
      ],
      options: {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 6, columnWidth: '40%' } },
        dataLabels: { enabled: false },
        xaxis: { categories }, // Use categories (months) here
        colors: ['#28a745'],
        grid: { borderColor: '#f3f3f3' },
      },
    })

    // CALCULATE YEARLY TOTALS (Grand Sum of Arrays)
    const totalOrdersYearly = orders.reduce((sum, val) => sum + val, 0)
    const totalProductionYearly = productions.reduce((sum, val) => sum + val, 0)
    const totalShippingYearly = shippings.reduce((sum, val) => sum + val, 0)

    // -----------------------------------------------------------------
    // CREATE DYNAMIC CARD DATA (MATCHING STATIC STRUCTURE)
    // -----------------------------------------------------------------
    const dynamicCardData = [
      {
        title: "Order",
        // Use the specific icon and color from the static data
        icon: <Package size={24} color="#FF0000" />,
        price: totalOrdersYearly.toLocaleString(),
        color: "success",
      },
      {
        title: "Production",
        // Use the specific icon and color from the static data
        icon: <Factory size={24} color="#007BFF" />,
        price: totalProductionYearly.toLocaleString(),
        color: "danger",
      },
      {
        title: "Shipping",
        // Use the specific icon and color from the static data
        icon: <Truck size={24} color="#28A745" />,
        price: totalShippingYearly.toLocaleString(),
        // Note: color is missing in your static data but we should set it if needed, 
        // or leave it out as per the static example. I'll omit it here.
      },
      // OPTIONAL: Keep a "Total Volume" card if desired, but your static list only has 3 items.
    ]
    setYearlyCardData(dynamicCardData)
  } catch (err) {
    console.error('Error fetching overview data:', err)
  }
}

  useEffect(() => {
    fetchOverviewData()
  }, [year])

  const handleYearChange = (newYear) => {
    setYear(newYear)
    fetchOverviewData(newYear)
  }

  return (
    <Card>
      <CardHeader className='card-no-border d-flex justify-content-between align-items-center'>
        <H5>Production Overview</H5>

        <UncontrolledDropdown>
          <DropdownToggle
            tag='span'
            data-bs-toggle='dropdown'
            aria-expanded={false}
            className='cursor-pointer'
          >
            <Filter size={18} />
          </DropdownToggle>
          <DropdownMenu end>
            {[2024, 2025, 2026, 2027].map((y) => (
              <DropdownItem key={y} onClick={() => handleYearChange(y)}>
                {y}
              </DropdownItem>
            ))}
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
                        options={lineChart.options}
                        series={lineChart.series}
                      />

                      <div className='back-bar-container'>
                        <ReactApexChart
                          type='bar'
                          height={180}
                          options={barChart.options}
                          series={barChart.series}
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
              {yearlyCardData.map((data, i) => (
                <Col key={i} md='12'>
                  <LightCardBox data={data} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default OrderOverview
