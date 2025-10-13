import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { H5 } from '../../../AbstractElements'
import { MonthlyProfitsTitle } from '../../../Constant'
import api from '../../../api/axios'


const MonthlyProfits = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboards/parts')
        const data = res.data.data

        const series = data.map((d) => d.total ?? 0)
        const labels = data.map((d) => d.category)

        setChartData({
          series,
          options: {
            labels,
            chart: { type: 'pie', height: 300 },
            dataLabels: { enabled: false },
            legend: {
              position: 'bottom',
              fontSize: '14px',
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 500,
              labels: { colors: ['var(--chart-text-color)'] },
              markers: { width: 6, height: 6 },
              itemMargin: { horizontal: 7, vertical: 0 },
            },
            stroke: { width: 1, colors: ['var(--light2)'] },
            plotOptions: {
              pie: {
                expandOnClick: false,
                donut: {
                  size: '83%',
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Value',
                    },
                  },
                },
              },
            },
            colors: ['#FF0000', '#007BFF', '#28A745'],
          },
        })
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className='card-no-border'>
        <H5>{MonthlyProfitsTitle}</H5>
      </CardHeader>
      <CardBody className='pt-0'>
        <div className='monthly-profit'>
          <ReactApexChart
            type='pie'
            height={300}
            series={chartData.series}
            options={chartData.options}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default MonthlyProfits
