import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Bell, Leaf, User, Target, Video, ArrowLeft, BarChart3, Search, Filter, Clock, TrendingUp, Zap, Shield, Activity, ParkingCircle, Brain, Eye } from 'lucide-react';
import axios from 'axios';
import Analytics from '../components/Analytics';
import ParkingDetectionVisualizer from '../components/ParkingDetectionVisualizer';
import DetectionAnalytics from '../components/DetectionAnalytics';
import CameraFeedDetector from '../components/CameraFeedDetector';
import AdvancedFilter from '../components/AdvancedFilter';
import ExportManager from '../components/ExportManager';
import './DriverPortal.css';

function DriverPortal() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [reservation, setReservation] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(localStorage.getItem('vehicleNumber') || '');
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('map'); // 'map', 'detection', 'camera', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'ev', 'handicap'
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [realTimeDetectionData, setRealTimeDetectionData] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New parking spot available in Zone A', time: '2 min ago', type: 'info' },
    { id: 2, message: 'Your reservation expires in 30 minutes', time: '5 min ago', type: 'warning' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteSpots') || '[]'));
  const [parkingHistory, setParkingHistory] = useState(JSON.parse(localStorage.getItem('parkingHistory') || '[]'));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
      setLastUpdate(new Date());
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteSpots', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('parkingHistory', JSON.stringify(parkingHistory));
  }, [parkingHistory]);

  const toggleFavorite = (spotId) => {
    setFavorites(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const addToHistory = (spotId) => {
    const historyItem = {
      spotId,
      timestamp: new Date().toISOString(),
      duration: '1.5h'
    };
    setParkingHistory(prev => [historyItem, ...prev.slice(0, 9)]);
  };

  const loadData = async () => {
    try {
      const [spotsRes, statsRes] = await Promise.all([
        axios.get('/api/driver/spots'),
        axios.get('/api/driver/statistics')
      ]);
      
      setSpots(spotsRes.data);
      setStatistics(statsRes.data);
      setLoading(false);

      // Load reservation if vehicle number exists
      if (vehicleNumber) {
        try {
          const resRes = await axios.get(`/api/driver/reservations/${vehicleNumber}`);
          setReservation(resRes.data);
        } catch (err) {
          setReservation(null);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
          reserved: Math.random() > 0.85,
          evCharging: Math.random() > 0.8,
          handicap: Math.random() > 0.9,
          shaded: Math.random() > 0.7,
          ecoScore: Math.floor(Math.random() * 100)
        });
      }
      setSpots(mockSpots);
      setStatistics({
        total: 32,
        free: mockSpots.filter(s => !s.occupied && !s.reserved).length,
        occupied: mockSpots.filter(s => s.occupied).length,
        reserved: mockSpots.filter(s => s.reserved).length
      });
      setLoading(false);
    }
  };

  const findNearestSpot = async () => {
    try {
      const res = await axios.get('/api/driver/spots/nearest');
      if (res.data) {
        alert(`Nearest spot found: ${res.data.spotId} in ${res.data.zone}`);
        highlightSpot(res.data.spotId);
      }
    } catch (error) {
      alert('No available spots found');
    }
  };

  const findEcoSpot = async () => {
    try {
      const res = await axios.get('/api/driver/spots/eco');
      if (res.data) {
        alert(`Eco-friendly spot: ${res.data.spotId} (Eco Score: ${res.data.ecoScore})`);
        highlightSpot(res.data.spotId);
      }
    } catch (error) {
      alert('No eco-friendly spots available');
    }
  };

  const reserveSpot = async (spotId) => {
    if (!vehicleNumber) {
      const vehicle = prompt('Enter your vehicle number:');
      if (!vehicle) return;
      setVehicleNumber(vehicle);
      localStorage.setItem('vehicleNumber', vehicle);
    }

    try {
      const res = await axios.post('/api/driver/reserve', {
        spotId,
        vehicleNumber
      });
      
      setReservation(res.data);
      alert(`Spot ${spotId} reserved successfully! Valid for 2 hours.`);
      loadData();
    } catch (error) {
      alert('Failed to reserve spot. It may already be taken.');
    }
  };

  const cancelReservation = async () => {
    if (!reservation) return;
    
    if (window.confirm('Cancel your reservation?')) {
      try {
        await axios.delete(`/api/driver/reservations/${reservation.reservationId}`);
        setReservation(null);
        alert('Reservation cancelled');
        loadData();
      } catch (error) {
        alert('Failed to cancel reservation');
      }
    }
  };

  const highlightSpot = (spotId) => {
    const element = document.getElementById(`spot-${spotId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');
      setTimeout(() => element.classList.remove('highlight'), 2000);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading"></div></div>;
  }

  return (
    <div className={`driver-portal ${darkMode ? 'dark-mode' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar gradient-purple">
        <div className="top-bar-left">
          <div className="logo-container">
            <div className="logo-icon logo-stationary">
              <ParkingCircle size={32} strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <h2>SmartPark</h2>
              <span>Driver Portal</span>
            </div>
          </div>
        </div>
        <div className="top-bar-center">
          <div className="search-bar glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search parking spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="top-bar-right">
          <div className="stats-summary">
            <div className="stat-item glass">
              <span className="stat-value">{statistics.free || 0}</span>
              <span className="stat-label">Free</span>
            </div>
            <div className="stat-item glass">
              <span className="stat-value">{statistics.occupied || 0}</span>
              <span className="stat-label">Occupied</span>
            </div>
          </div>
          <div className="top-actions">
            <button 
              className="icon-btn glass" 
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={24} />
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </div>
            <button 
              className="icon-btn glass" 
              onClick={() => setShowHistory(!showHistory)}
              title="Parking History"
            >
              📋
            </button>
            <button className="btn-back glass" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Update Indicator */}
      <div className="update-indicator glass">
        <Activity size={14} className="pulse-icon" />
        <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
      </div>

      {/* Parking History Modal */}
      {showHistory && (
        <div className="history-modal glass">
          <div className="history-header">
            <h3>Parking History</h3>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          <div className="history-list">
            {parkingHistory.length > 0 ? (
              parkingHistory.map((item, idx) => (
                <div key={idx} className="history-item glass">
                  <div className="history-spot">
                    <MapPin size={16} />
                    <strong>{item.spotId}</strong>
                  </div>
                  <div className="history-details">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span className="duration">{item.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-history">No parking history yet</p>
            )}
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown glass">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setNotifications([])}>Clear All</button>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.type}`}>
                  <Bell size={16} />
                  <div className="notification-content">
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notifications">No new notifications</p>
            )}
          </div>
        </div>
      )}

      <div className="portal-content">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Reservation Panel */}
          {reservation && (
            <div className="panel reservation-panel gradient-purple glass">
              <div className="panel-icon">
                <Shield size={24} />
              </div>
              <h3>My Reservation</h3>
              <div className="reservation-info">
                <div className="info-row">
                  <MapPin size={16} />
                  <span><strong>Spot:</strong> {reservation.spotId}</span>
                </div>
                <div className="info-row">
                  <User size={16} />
                  <span><strong>Vehicle:</strong> {reservation.vehicleNumber}</span>
                </div>
                <div className="info-row">
                  <Clock size={16} />
                  <span><strong>Expires:</strong> {new Date(reservation.expiryTime).toLocaleTimeString()}</span>
                </div>
              </div>
              <button className="btn btn-warning" onClick={cancelReservation}>
                Cancel Reservation
              </button>
            </div>
          )}

          {/* Eco Stats */}
          <div className="panel eco-panel gradient-green glass">
            <div className="panel-icon">
              <Leaf size={24} />
            </div>
            <h3>Eco Impact</h3>
            <div className="eco-stats">
              <div className="eco-stat">
                <Zap size={20} />
                <span className="eco-value">0.5 L</span>
                <span className="eco-label">Fuel Saved</span>
              </div>
              <div className="eco-stat">
                <TrendingUp size={20} />
                <span className="eco-value">120 g</span>
                <span className="eco-label">CO₂ Reduced</span>
              </div>
            </div>
            <p className="eco-tip">💡 Park in shaded spots to reduce AC usage!</p>
          </div>

          {/* Quick Stats Panel */}
          <div className="panel stats-panel glass">
            <div className="panel-icon">
              <BarChart3 size={24} />
            </div>
            <h3>Quick Stats</h3>
            <div className="quick-stats-list">
              <div className="quick-stat-item">
                <span className="stat-icon">🎯</span>
                <div>
                  <p className="stat-title">Total Visits</p>
                  <p className="stat-number">{parkingHistory.length}</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <span className="stat-icon">⏱️</span>
                <div>
                  <p className="stat-title">Avg. Duration</p>
                  <p className="stat-number">1.5h</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <span className="stat-icon">💰</span>
                <div>
                  <p className="stat-title">Total Saved</p>
                  <p className="stat-number">$45</p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Spots Panel */}
          {favorites.length > 0 && (
            <div className="panel favorites-panel glass">
              <div className="panel-icon">
                <span>⭐</span>
              </div>
              <h3>Favorite Spots</h3>
              <div className="favorites-list">
                {favorites.map(spotId => (
                  <div key={spotId} className="favorite-item">
                    <MapPin size={14} />
                    <span>{spotId}</span>
                    <button 
                      className="remove-fav"
                      onClick={() => toggleFavorite(spotId)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="action-bar glass">
            <div className="view-tabs">
              <button 
                className={`tab-btn ${activeView === 'map' ? 'active' : ''}`}
                onClick={() => setActiveView('map')}
              >
                <MapPin size={18} /> Parking Map
              </button>
              <button 
                className={`tab-btn ${activeView === 'detection' ? 'active' : ''}`}
                onClick={() => setActiveView('detection')}
              >
                <Brain size={18} /> AI Detection
              </button>
              <button 
                className={`tab-btn ${activeView === 'camera' ? 'active' : ''}`}
                onClick={() => setActiveView('camera')}
              >
                <Video size={18} /> Live Camera
              </button>
              <button 
                className={`tab-btn ${activeView === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveView('analytics')}
              >
                <BarChart3 size={18} /> Analytics
              </button>
            </div>
            {activeView === 'map' && (
              <div className="action-buttons">
                <div className="filter-dropdown glass">
                  <Filter size={18} />
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Spots</option>
                    <option value="free">Free Only</option>
                    <option value="ev">EV Charging</option>
                    <option value="handicap">Handicap</option>
                  </select>
                </div>
                <button className="btn btn-warning" onClick={() => alert('Video upload coming soon!')}>
                  <Video size={18} /> Load Video
                </button>
                <button className="btn btn-success" onClick={findEcoSpot}>
                  <Leaf size={18} /> Eco Mode
                </button>
                <button className="btn btn-primary" onClick={findNearestSpot}>
                  <Target size={18} /> Find Nearest
                </button>
              </div>
            )}
          </div>

          {/* Conditional Content */}
          {activeView === 'map' ? (
            <>
              <AdvancedFilter 
                spots={spots}
                onFilterChange={(filteredSpots, stats) => {
                  console.log('Filtered spots:', filteredSpots);
                }}
                onSearchChange={(query) => {
                  setSearchQuery(query);
                }}
              />
              <div className="parking-map glass">
                <div className="map-legend">
                  <span><div className="legend-box spot-free"></div> Free</span>
                  <span><div className="legend-box spot-occupied"></div> Occupied</span>
                  <span><div className="legend-box spot-reserved"></div> Reserved</span>
                  <span><div className="legend-box spot-ev"></div> EV Charging</span>
                </div>
                
                <div className="spots-grid">
                  {spots
                    .filter(spot => {
                      if (filterType === 'free') return !spot.occupied && !spot.reserved;
                      if (filterType === 'ev') return spot.evCharging;
                      if (filterType === 'handicap') return spot.handicap;
                      return true;
                    })
                    .filter(spot => searchQuery === '' || spot.spotId.toLowerCase().includes(searchQuery.toLowerCase()) || spot.zone.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(spot => (
                    <div
                      key={spot.id}
                      id={`spot-${spot.spotId}`}
                      className={`parking-spot glass ${
                        spot.occupied ? 'spot-occupied' : 
                        spot.reserved ? 'spot-reserved' : 
                        'spot-free'
                      } ${favorites.includes(spot.spotId) ? 'is-favorite' : ''}`}
                      title={`${spot.spotId} - ${spot.zone}`}
                    >
                      <button 
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(spot.spotId);
                        }}
                      >
                        {favorites.includes(spot.spotId) ? '⭐' : '☆'}
                      </button>
                      <div onClick={() => !spot.occupied && !spot.reserved && reserveSpot(spot.spotId)}>
                        <span className="spot-id">{spot.spotId}</span>
                        <div className="spot-features">
                          {spot.shaded && <span className="spot-icon" title="Shaded">☀️</span>}
                          {spot.evCharging && <span className="spot-icon" title="EV Charging">⚡</span>}
                          {spot.handicap && <span className="spot-icon" title="Handicap">♿</span>}
                        </div>
                        {spot.occupied ? (
                          <button className="btn btn-danger btn-sm" disabled>
                            Occupied
                          </button>
                        ) : spot.reserved ? (
                          <button className="btn btn-warning btn-sm" disabled>
                            Reserved
                          </button>
                        ) : (
                          <button className="btn btn-success btn-sm">
                            Quick Reserve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeView === 'detection' ? (
            <div className="detection-view glass">
              <ParkingDetectionVisualizer 
                autoDetect={true}
                showConfidence={true}
                showMetadata={true}
                detectionMethod="deep_learning"
                classificationMethod="mlp_classifier"
              />
            </div>
          ) : activeView === 'camera' ? (
            <div className="camera-view glass">
              <CameraFeedDetector 
                onDetectionComplete={(results) => {
                  console.log('Camera detection completed:', results);
                  setRealTimeDetectionData(results);
                }}
                enableRecording={true}
                cameraId="default"
              />
            </div>
          ) : (
            <>
              <ExportManager 
                data={realTimeDetectionData}
                detectionHistory={detectionHistory}
                analyticsData={statistics}
                onExportComplete={(result) => {
                  console.log('Export completed:', result);
                }}
              />
              <DetectionAnalytics 
                detectionHistory={detectionHistory}
                realTimeData={realTimeDetectionData}
                onExport={() => console.log('Exporting analytics...')}
              />
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-btn ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => setActiveView('map')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          className={`nav-btn ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => setActiveView('map')}
        >
          <MapPin size={24} />
          <span>Map</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => alert('Alerts feature coming soon!')}
        >
          <Bell size={24} />
          <span>Alerts</span>
        </button>
        <button 
          className={`nav-btn ${activeView === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveView('analytics')}
        >
          <Leaf size={24} />
          <span>Eco</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => alert('Profile feature coming soon!')}
        >
          <User size={24} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}

export default DriverPortal;
