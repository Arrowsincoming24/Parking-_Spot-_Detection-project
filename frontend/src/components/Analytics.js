import React from 'react';
import { TrendingUp, TrendingDown, Activity, Users, Clock, DollarSign } from 'lucide-react';
import './Analytics.css';

function Analytics({ data }) {
  const metrics = [
    {
      title: 'Occupancy Rate',
      value: `${data?.occupancyRate?.toFixed(1) || 0}%`,
      change: '+12.5%',
      trend: 'up',
      icon: <Activity size={24} />,
      color: '#667eea'
    },
    {
      title: 'Peak Hours',
      value: '2-5 PM',
      change: 'Most Busy',
      trend: 'neutral',
      icon: <Clock size={24} />,
      color: '#11998e'
    },
    {
      title: 'Avg. Duration',
      value: '2.5 hrs',
      change: '-8.2%',
      trend: 'down',
      icon: <Users size={24} />,
      color: '#f12711'
    },
    {
      title: 'Revenue Today',
      value: '$1,245',
      change: '+23.1%',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: '#8bc34a'
    }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Real-time Analytics</h2>
        <span className="live-indicator">
          <span className="pulse-dot"></span>
          Live
        </span>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="metric-card glass"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="metric-header">
              <div className="metric-icon" style={{ background: metric.color }}>
                {metric.icon}
              </div>
              <div className={`metric-trend ${metric.trend}`}>
                {metric.trend === 'up' && <TrendingUp size={16} />}
                {metric.trend === 'down' && <TrendingDown size={16} />}
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="metric-body">
              <h3>{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
            <div className="metric-sparkline">
              <svg width="100%" height="40" viewBox="0 0 100 40">
                <path
                  d={`M 0,${20 + Math.random() * 10} ${Array.from({ length: 10 }, (_, i) => 
                    `L ${i * 11},${20 + Math.sin(i) * 10 + Math.random() * 5}`
                  ).join(' ')}`}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="2"
                  opacity="0.5"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="chart-container glass">
        <h3>Hourly Occupancy Trend</h3>
        <div className="bar-chart">
          {Array.from({ length: 24 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            const isCurrentHour = i === new Date().getHours();
            return (
              <div key={i} className="bar-wrapper">
                <div 
                  className={`bar ${isCurrentHour ? 'current' : ''}`}
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <div className="bar-tooltip">
                    {i}:00 - {Math.round(height)}%
                  </div>
                </div>
                <span className="bar-label">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="heatmap-container glass">
        <h3>Zone Popularity Heatmap</h3>
        <div className="heatmap-grid">
          {['A', 'B', 'C', 'D'].map(zone => (
            <div key={zone} className="heatmap-row">
              <span className="zone-label">{zone}</span>
              {Array.from({ length: 8 }, (_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className="heatmap-cell"
                    style={{
                      background: `rgba(102, 126, 234, ${intensity})`,
                      animationDelay: `${(zone.charCodeAt(0) - 65) * 0.1 + i * 0.05}s`
                    }}
                    title={`${zone}${i + 1}: ${Math.round(intensity * 100)}%`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item glass">
          <span className="stat-label">Total Spots</span>
          <span className="stat-value">{data?.total || 32}</span>
        </div>
        <div className="stat-item glass">
          <span className="stat-label">Available</span>
          <span className="stat-value green">{data?.free || 12}</span>
        </div>
        <div className="stat-item glass">
          <span className="stat-label">Occupied</span>
          <span className="stat-value red">{data?.occupied || 20}</span>
        </div>
        <div className="stat-item glass">
          <span className="stat-label">Reserved</span>
          <span className="stat-value yellow">5</span>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
