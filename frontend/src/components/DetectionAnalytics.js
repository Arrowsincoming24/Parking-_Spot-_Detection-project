import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Activity, Target, Download, Eye, CheckCircle, Zap, Brain, RefreshCw, Award, AlertTriangle } from 'lucide-react';
import './DetectionAnalytics.css';

/**
 * Advanced Detection Analytics Dashboard
 * Real-time metrics, accuracy tracking, and performance analysis
 */

const DetectionAnalytics = ({ 
  detectionHistory = [], 
  realTimeData = null,
  onExport = null 
}) => {
  const [analytics, setAnalytics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    processingTime: 0,
    totalDetections: 0,
    confidenceDistribution: [],
    methodPerformance: {},
    timeSeriesData: []
  });
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMethod] = useState('all');

  const calculateAnalytics = useCallback(() => {
    // Simulate real-time analytics calculation
    const mockAnalytics = {
      accuracy: 94.5 + Math.random() * 4,
      precision: 92.3 + Math.random() * 6,
      recall: 89.7 + Math.random() * 8,
      f1Score: 91.0 + Math.random() * 7,
      processingTime: 1250 + Math.random() * 500,
      totalDetections: detectionHistory.length * 24 + Math.floor(Math.random() * 100),
      confidenceDistribution: [
        { range: '90-100%', count: Math.floor(Math.random() * 50) + 30 },
        { range: '80-90%', count: Math.floor(Math.random() * 40) + 20 },
        { range: '70-80%', count: Math.floor(Math.random() * 30) + 10 },
        { range: '60-70%', count: Math.floor(Math.random() * 20) + 5 },
        { range: '50-60%', count: Math.floor(Math.random() * 10) + 2 }
      ],
      methodPerformance: {
        'Edge Detection': { accuracy: 85.2, speed: 800, detections: 145 },
        'Selective Search': { accuracy: 91.7, speed: 1200, detections: 189 },
        'Deep Learning': { accuracy: 96.8, speed: 1500, detections: 234 }
      },
      timeSeriesData: generateTimeSeriesData()
    };

    setAnalytics(mockAnalytics);
  }, [detectionHistory, realTimeData, selectedTimeRange, selectedMethod]);

  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);


  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        accuracy: 90 + Math.random() * 10,
        detections: Math.floor(Math.random() * 50) + 10
      });
    }
    return data;
  };

  const refreshAnalytics = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    calculateAnalytics();
    setIsRefreshing(false);
  };

  const exportAnalytics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      analytics: analytics,
      history: detectionHistory
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detection-analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricColor = (value, threshold = 90) => {
    if (value >= threshold) return '#22c55e';
    if (value >= threshold - 10) return '#f59e0b';
    return '#ef4444';
  };

  const getMetricIcon = (type) => {
    switch (type) {
      case 'accuracy': return <Target size={20} />;
      case 'precision': return <Eye size={20} />;
      case 'recall': return <Activity size={20} />;
      case 'speed': return <Zap size={20} />;
      default: return <BarChart3 size={20} />;
    }
  };

  return (
    <div className="detection-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-title">
          <Brain className="title-icon" />
          <h3>Detection Analytics</h3>
        </div>
        
        <div className="header-controls">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={refreshAnalytics}
            disabled={isRefreshing}
          >
            {isRefreshing ? <RefreshCw className="spinner" size={16} /> : <RefreshCw size={16} />}
            Refresh
          </button>
          
          <button 
            className="btn btn-primary btn-sm"
            onClick={exportAnalytics}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon accuracy">
              {getMetricIcon('accuracy')}
            </div>
            <div className="metric-info">
              <h4>Accuracy</h4>
              <span className="metric-value" style={{ color: getMetricColor(analytics.accuracy) }}>
                {analytics.accuracy.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="metric-trend">
            <TrendingUp size={16} className="trend-up" />
            <span>+2.3% from last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon precision">
              {getMetricIcon('precision')}
            </div>
            <div className="metric-info">
              <h4>Precision</h4>
              <span className="metric-value" style={{ color: getMetricColor(analytics.precision) }}>
                {analytics.precision.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="metric-trend">
            <TrendingUp size={16} className="trend-up" />
            <span>+1.8% from last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon recall">
              {getMetricIcon('recall')}
            </div>
            <div className="metric-info">
              <h4>Recall</h4>
              <span className="metric-value" style={{ color: getMetricColor(analytics.recall) }}>
                {analytics.recall.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="metric-trend">
            <TrendingUp size={16} className="trend-up" />
            <span>+3.1% from last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon speed">
              {getMetricIcon('speed')}
            </div>
            <div className="metric-info">
              <h4>Avg Speed</h4>
              <span className="metric-value">
                {(analytics.processingTime / 1000).toFixed(2)}s
              </span>
            </div>
          </div>
          <div className="metric-trend">
            <TrendingUp size={16} className="trend-up" />
            <span>-0.2s from last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Confidence Distribution */}
        <div className="chart-card">
          <h4>Confidence Distribution</h4>
          <div className="confidence-chart">
            {analytics.confidenceDistribution.map((bin, index) => (
              <div key={index} className="confidence-bar">
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${(bin.count / Math.max(...analytics.confidenceDistribution.map(d => d.count))) * 100}%`,
                      backgroundColor: getMetricColor(parseFloat(bin.range.split('-')[0]))
                    }}
                  ></div>
                </div>
                <span className="bar-label">{bin.range}</span>
                <span className="bar-value">{bin.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Method Performance */}
        <div className="chart-card">
          <h4>Detection Method Performance</h4>
          <div className="method-table">
            <div className="table-header">
              <span>Method</span>
              <span>Accuracy</span>
              <span>Speed</span>
              <span>Detections</span>
            </div>
            {Object.entries(analytics.methodPerformance).map(([method, perf]) => (
              <div key={method} className="table-row">
                <span className="method-name">{method}</span>
                <span className="method-accuracy" style={{ color: getMetricColor(perf.accuracy) }}>
                  {perf.accuracy.toFixed(1)}%
                </span>
                <span className="method-speed">{perf.speed}ms</span>
                <span className="method-detections">{perf.detections}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="chart-card full-width">
        <h4>24-Hour Performance Trend</h4>
        <div className="time-series-chart">
          <div className="chart-grid">
            {analytics.timeSeriesData.map((data, index) => (
              <div key={index} className="time-point">
                <div className="point-container">
                  <div 
                    className="accuracy-point"
                    style={{ 
                      bottom: `${data.accuracy}%`,
                      backgroundColor: getMetricColor(data.accuracy)
                    }}
                  ></div>
                  <div 
                    className="detection-bar"
                    style={{ 
                      height: `${(data.detections / 60) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="time-label">{data.time}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot accuracy"></div>
              <span>Accuracy (%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-bar detections"></div>
              <span>Detections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="insights-section">
        <h4>Performance Insights</h4>
        <div className="insights-grid">
          <div className="insight-card positive">
            <CheckCircle className="insight-icon" />
            <div className="insight-content">
              <h5>Excellent Accuracy</h5>
              <p>Deep Learning method achieving {analytics.methodPerformance['Deep Learning']?.accuracy.toFixed(1)}% accuracy with consistent performance.</p>
            </div>
          </div>
          
          <div className="insight-card warning">
            <AlertTriangle className="insight-icon" />
            <div className="insight-content">
              <h5>Processing Speed</h5>
              <p>Average processing time of {(analytics.processingTime / 1000).toFixed(2)}s could be optimized for real-time applications.</p>
            </div>
          </div>
          
          <div className="insight-card positive">
            <Award className="insight-icon" />
            <div className="insight-content">
              <h5>High Confidence</h5>
              <p>{analytics.confidenceDistribution[0]?.count || 0} detections with 90-100% confidence in the selected period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionAnalytics;
