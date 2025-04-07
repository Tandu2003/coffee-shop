import React, { useEffect, useState } from 'react';
import { AdminApi } from '../../../Api/admin';
import Chart from 'react-apexcharts';
import './Reports.scss';

const Reports = () => {
  const [salesData, setSalesData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AdminApi.getSalesReport(),
      AdminApi.getAnalytics()
    ])
      .then(([sales, analytics]) => {
        setSalesData(sales);
        setAnalyticsData(analytics);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="reports-filters">
          <select className="filter-select">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="reports-content">
        <div className="sales-chart">
          <h3>Sales Overview</h3>
          <Chart
            options={{
              chart: {
                type: 'line',
                height: 350,
                toolbar: {
                  show: false
                }
              },
              colors: ['#4a90e2'],
              xaxis: {
                categories: salesData?.dates || [],
                labels: {
                  style: {
                    colors: '#fff'
                  }
                }
              },
              yaxis: {
                labels: {
                  style: {
                    colors: '#fff'
                  }
                }
              },
              theme: {
                mode: 'dark'
              }
            }}
            series={[
              {
                name: 'Total Sales',
                data: salesData?.sales || []
              }
            ]}
            type="line"
          />
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="icon">📊</div>
            <h3>Total Orders</h3>
            <p>{analyticsData?.totalOrders || 0}</p>
          </div>
          <div className="analytics-card">
            <div className="icon">💰</div>
            <h3>Total Revenue</h3>
            <p>${analyticsData?.totalRevenue || 0}</p>
          </div>
          <div className="analytics-card">
            <div className="icon">📈</div>
            <h3>Average Order Value</h3>
            <p>${analyticsData?.averageOrderValue || 0}</p>
          </div>
          <div className="analytics-card">
            <div className="icon">👥</div>
            <h3>Active Users</h3>
            <p>{analyticsData?.activeUsers || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
