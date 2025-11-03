import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MapPin, Bell, Camera, BarChart, Settings, LogOut, RefreshCw, Shield, Users, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState({ statistics: {}, spots: [], alerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setDashboard(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Load mock data when API fails
      const mockSpots = [];
      const zones = ['A', 'B', 'C', 'D'];
      for (let i = 1; i <= 32; i++) {
        const zone = zones[Math.floor((i - 1) / 8)];
        mockSpots.push({
          id: i,
          spotId: `${zone}${((i - 1) % 8) + 1}`,
          zone: `Zone ${zone}`,
          occupied: Math.random() > 0.6,
          reserved: Math.random() > 0.85
        });
      }
      const mockAlerts = [
        { id: 1, type: 'Security Alert', message: 'Unauthorized vehicle detected in Zone A', severity: 'HIGH', spotId: 'A3' },
        { id: 2, type: 'System Alert', message: 'Camera 2 offline', severity: 'MEDIUM', spotId: 'B1' },
        { id: 3, type: 'Maintenance', message: 'Spot C5 requires cleaning', severity: 'LOW', spotId: 'C5' }
      ];
      setDashboard({
        statistics: {
          total: 32,
          free: mockSpots.filter(s => !s.occupied && !s.reserved).length,
          occupied: mockSpots.filter(s => s.occupied).length,
          reserved: mockSpots.filter(s => s.reserved).length,
          occupancyRate: (mockSpots.filter(s => s.occupied).length / 32) * 100
        },
        spots: mockSpots,
        alerts: mockAlerts
      });
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      axios.defaults.headers.common['Authorization'] = '';
      navigate('/');
    }
  };

  const handleRefresh = async () => {
    try {
      await axios.post('/api/admin/spots/refresh');
      loadDashboard();
      alert('Dashboard refreshed!');
    } catch (error) {
      alert('Failed to refresh');
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading"></div></div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar glass">
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">
              <Shield size={32} strokeWidth={2.5} />
            </div>
            <div className="admin-logo-text">
              <h2>SmartPark</h2>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <MapPin size={20} />
            <span>Live View</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Bell size={20} />
            <span>Alerts</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'cameras' ? 'active' : ''}`}
            onClick={() => setActiveTab('cameras')}
          >
            <Camera size={20} />
            <span>Cameras</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart size={20} />
            <span>Reports</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'dataset' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataset')}
          >
            <Settings size={20} />
            <span>Dataset Upload</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Top Bar */}
        <div className="admin-topbar glass">
          <div className="topbar-left">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="topbar-subtitle">Real-time parking management system</p>
          </div>
          <div className="topbar-right">
            <div className="admin-stats-mini">
              <div className="mini-stat">
                <Activity size={16} />
                <span>Live</span>
              </div>
              <div className="mini-stat">
                <Users size={16} />
                <span>{dashboard.statistics.total || 0} Spots</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleRefresh}>
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="stats-grid">
                <div className="stat-card gradient-purple glass">
                  <div className="stat-icon">
                    <LayoutDashboard size={24} />
                  </div>
                  <h3>Total Spots</h3>
                  <p className="stat-number">{dashboard.statistics.total || 0}</p>
                  <div className="stat-trend">
                    <TrendingUp size={14} />
                    <span>+5% from last week</span>
                  </div>
                </div>
                <div className="stat-card gradient-green glass">
                  <div className="stat-icon">
                    <MapPin size={24} />
                  </div>
                  <h3>Free Spots</h3>
                  <p className="stat-number">{dashboard.statistics.free || 0}</p>
                  <div className="stat-trend">
                    <TrendingUp size={14} />
                    <span>Available now</span>
                  </div>
                </div>
                <div className="stat-card gradient-fire glass">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>
                  <h3>Occupied</h3>
                  <p className="stat-number">{dashboard.statistics.occupied || 0}</p>
                  <div className="stat-trend">
                    <Activity size={14} />
                    <span>Active users</span>
                  </div>
                </div>
                <div className="stat-card gradient-blue glass">
                  <div className="stat-icon">
                    <BarChart size={24} />
                  </div>
                  <h3>Occupancy Rate</h3>
                  <p className="stat-number">{dashboard.statistics.occupancyRate?.toFixed(1) || 0}%</p>
                  <div className="stat-trend">
                    <TrendingUp size={14} />
                    <span>Optimal range</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="card glass">
                  <h3>Recent Alerts</h3>
                  <div className="alerts-list">
                    {dashboard.alerts.map((alert, idx) => (
                      <div key={idx} className="alert-item">
                        <span className={`alert-badge ${alert.severity.toLowerCase()}`}>
                          {alert.severity}
                        </span>
                        <div>
                          <strong>{alert.type}</strong>
                          <p>{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card glass">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="action-btn" onClick={handleRefresh}>
                      🔄 Refresh Data
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('live')}>
                      🗺️ View Live Map
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('alerts')}>
                      ⚠️ Manage Alerts
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('reports')}>
                      📊 Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="live-view">
              <div className="live-header glass">
                <h3>Live Parking Map</h3>
                <div className="live-legend">
                  <span><div className="legend-dot spot-free"></div> Free</span>
                  <span><div className="legend-dot spot-occupied"></div> Occupied</span>
                  <span><div className="legend-dot spot-reserved"></div> Reserved</span>
                </div>
              </div>
              <div className="spots-grid-admin">
                {dashboard.spots.map(spot => (
                  <div
                    key={spot.id}
                    className={`parking-spot-admin ${
                      spot.occupied ? 'spot-occupied' : 
                      spot.reserved ? 'spot-reserved' : 
                      'spot-free'
                    }`}
                  >
                    <span className="spot-id">{spot.spotId}</span>
                    <span className="spot-zone">{spot.zone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-view">
              <h2>System Alerts</h2>
              {dashboard.alerts.map((alert, idx) => (
                <div key={idx} className="alert-card">
                  <div className="alert-header">
                    <span className={`alert-badge ${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                    <span className="alert-type">{alert.type}</span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-spot">Spot: {alert.spotId}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cameras' && (
            <div className="cameras-view">
              <h2>Camera Feeds</h2>
              <div className="cameras-grid glass-grid">
                {[1, 2, 3, 4].map(cam => (
                  <div key={cam} className="camera-card">
                    <div className="camera-preview">
                      <Camera size={48} />
                      <p>Camera {cam}</p>
                    </div>
                    <div className="camera-info">
                      <span className="status-badge active">Active</span>
                      <p>Zone {String.fromCharCode(64 + cam)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-view">
              <h2>Reports & Analytics</h2>
              <div className="report-cards">
                <div className="report-card">
                  <h3>📊 Occupancy Trends</h3>
                  <p>View parking occupancy over time</p>
                  <button className="btn btn-primary">Generate Report</button>
                </div>
                <div className="report-card">
                  <h3>⚠️ Violations Report</h3>
                  <p>Summary of parking violations</p>
                  <button className="btn btn-primary">Generate Report</button>
                </div>
                <div className="report-card">
                  <h3>💰 Revenue Analysis</h3>
                  <p>Parking revenue statistics</p>
                  <button className="btn btn-primary">Generate Report</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="dataset-view">
              <h2>📊 Kaggle Dataset Upload</h2>
              <div className="dataset-container">
                <div className="upload-card glass">
                  <h3>Upload Parking Dataset</h3>
                  <p>Upload your Kaggle parking dataset (CSV or JSON format)</p>
                  
                  <div className="upload-area">
                    <input 
                      type="file" 
                      id="dataset-upload" 
                      accept=".csv,.json"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          alert(`File "${file.name}" selected! Processing...`);
                        }
                      }}
                    />
                    <label htmlFor="dataset-upload" className="upload-label">
                      <div className="upload-icon">📁</div>
                      <p>Click to upload or drag and drop</p>
                      <span>CSV, JSON (Max 50MB)</span>
                    </label>
                  </div>

                  <div className="dataset-info">
                    <h4>Supported Formats:</h4>
                    <ul>
                      <li>✅ CSV files with parking spot data</li>
                      <li>✅ JSON files with occupancy records</li>
                      <li>✅ Time-series parking data</li>
                      <li>✅ Video frame annotations</li>
                    </ul>
                  </div>
                </div>

                <div className="dataset-stats glass">
                  <h3>Current Dataset Stats</h3>
                  <div className="stat-grid">
                    <div className="stat-box">
                      <span className="stat-label">Total Records</span>
                      <span className="stat-value">1,250</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Parking Spots</span>
                      <span className="stat-value">32</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Time Range</span>
                      <span className="stat-value">30 days</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Accuracy</span>
                      <span className="stat-value">94.5%</span>
                    </div>
                  </div>
                </div>

                <div className="recent-uploads glass">
                  <h3>Recent Uploads</h3>
                  <div className="upload-list">
                    <div className="upload-item">
                      <span className="upload-name">parking_data_oct.csv</span>
                      <span className="upload-date">2 days ago</span>
                      <span className="upload-status success">✓ Processed</span>
                    </div>
                    <div className="upload-item">
                      <span className="upload-name">occupancy_records.json</span>
                      <span className="upload-date">5 days ago</span>
                      <span className="upload-status success">✓ Processed</span>
                    </div>
                    <div className="upload-item">
                      <span className="upload-name">video_annotations.csv</span>
                      <span className="upload-date">1 week ago</span>
                      <span className="upload-status success">✓ Processed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-view">
              <h2>System Settings</h2>
              <div className="settings-card">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label>System Name</label>
                  <input type="text" value="Smart Parking System" readOnly />
                </div>
                <div className="setting-item">
                  <label>Max Reservation Time (hours)</label>
                  <input type="number" value="2" readOnly />
                </div>
                <div className="setting-item">
                  <label>Auto-refresh Interval (seconds)</label>
                  <input type="number" value="5" readOnly />
                </div>
                <button className="btn btn-primary">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
