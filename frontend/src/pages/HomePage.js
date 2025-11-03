import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, Lock, Brain, Camera, Shield, Zap, BarChart3, Users, Settings, Globe } from 'lucide-react';
import Logo from '../components/Logo';
import './HomePage.css';
import '../styles/modernDesignSystem.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-background">
        <div className="background-pattern"></div>
        <div className="background-gradient"></div>
      </div>
      
      <div className="home-container">
        {/* Header with Logo */}
        <header className="home-header">
          <div className="header-content">
            <Logo size="large" animated={true} />
            <div className="header-text">
              <h1 className="home-title">Advanced Parking Detection</h1>
              <p className="home-subtitle">AI-Powered Slot Detection & Management System</p>
            </div>
          </div>
        </header>

        {/* Main Portal Cards */}
        <main className="home-main">
          <div className="portal-cards">
            <div className="portal-card driver-card" onClick={() => navigate('/driver')}>
              <div className="card-background">
                <div className="card-pattern"></div>
              </div>
              
              <div className="card-content">
                <div className="card-icon">
                  <Navigation size={48} />
                </div>
                
                <div className="card-text">
                  <h2 className="card-title">Driver Portal</h2>
                  <p className="card-description">Experience AI-powered parking detection with real-time spot availability</p>
                </div>

                <div className="card-features">
                  <div className="feature-item">
                    <Brain size={16} />
                    <span>Smart Detection</span>
                  </div>
                  <div className="feature-item">
                    <Camera size={16} />
                    <span>Live Camera Feeds</span>
                  </div>
                  <div className="feature-item">
                    <Zap size={16} />
                    <span>Instant Results</span>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-number">98.5%</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">&lt;2s</span>
                    <span className="stat-label">Detection Time</span>
                  </div>
                </div>

                <button className="btn btn-primary btn-lg">
                  Enter Driver Portal
                  <Navigation size={20} />
                </button>
              </div>
            </div>

            <div className="portal-card admin-card" onClick={() => navigate('/admin/login')}>
              <div className="card-background">
                <div className="card-pattern"></div>
              </div>
              
              <div className="card-content">
                <div className="card-icon">
                  <Lock size={48} />
                </div>
                
                <div className="card-text">
                  <h2 className="card-title">Admin Dashboard</h2>
                  <p className="card-description">Comprehensive management with advanced analytics and system controls</p>
                </div>

                <div className="card-features">
                  <div className="feature-item">
                    <BarChart3 size={16} />
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="feature-item">
                    <Shield size={16} />
                    <span>Security Controls</span>
                  </div>
                  <div className="feature-item">
                    <Settings size={16} />
                    <span>System Management</span>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Monitoring</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">Real</span>
                    <span className="stat-label">Time Data</span>
                  </div>
                </div>

                <button className="btn btn-secondary btn-lg">
                  Admin Login
                  <Lock size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Technology Features */}
        <section className="tech-features">
          <div className="section-header">
            <h2 className="section-title">Advanced Detection Technology</h2>
            <p className="section-subtitle">Powered by cutting-edge computer vision and machine learning</p>
          </div>

          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">
                <Brain size={32} />
              </div>
              <h3>Deep Learning Detection</h3>
              <p>State-of-the-art neural networks for accurate parking slot identification</p>
              <ul className="tech-list">
                <li>ResNet34 Classification</li>
                <li>Custom DCNN Architecture</li>
                <li>Real-time Processing</li>
              </ul>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <Camera size={32} />
              </div>
              <h3>Multi-Camera Integration</h3>
              <p>Comprehensive surveillance with intelligent video analysis</p>
              <ul className="tech-list">
                <li>IP Camera Support</li>
                <li>Live Feed Processing</li>
                <li>Zone-based Detection</li>
              </ul>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <Shield size={32} />
              </div>
              <h3>Advanced Security</h3>
              <p>Intelligent monitoring for violations and safety enforcement</p>
              <ul className="tech-list">
                <li>Violation Detection</li>
                <li>Alert System</li>
                <li>Access Control</li>
              </ul>
            </div>

            <div className="tech-card">
              <div className="tech-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive insights and reporting for parking optimization</p>
              <ul className="tech-list">
                <li>Occupancy Trends</li>
                <li>Performance Metrics</li>
                <li>Export Reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detection Methods Showcase */}
        <section className="detection-showcase">
          <div className="section-header">
            <h2 className="section-title">Detection Methods</h2>
            <p className="section-subtitle">Multiple approaches for maximum accuracy</p>
          </div>

          <div className="detection-methods">
            <div className="method-card">
              <div className="method-header">
                <h4>Edge Detection</h4>
                <span className="method-badge classic">Classical</span>
              </div>
              <p>Canny edge detection with contour finding for traditional slot identification</p>
              <div className="method-specs">
                <span>Processing: Fast</span>
                <span>Accuracy: 85%</span>
              </div>
            </div>

            <div className="method-card">
              <div className="method-header">
                <h4>Selective Search</h4>
                <span className="method-badge ml">ML-Based</span>
              </div>
              <p>Machine learning region proposals for diverse parking slot detection</p>
              <div className="method-specs">
                <span>Processing: Medium</span>
                <span>Accuracy: 92%</span>
              </div>
            </div>

            <div className="method-card featured">
              <div className="method-header">
                <h4>Deep Learning</h4>
                <span className="method-badge advanced">Advanced</span>
              </div>
              <p>Neural network-based detection with custom trained models</p>
              <div className="method-specs">
                <span>Processing: Optimized</span>
                <span>Accuracy: 98.5%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <Logo size="small" variant="icon-only" />
              <span>ParkVision AI</span>
            </div>
            
            <div className="footer-links">
              <div className="link-group">
                <h5>Technology</h5>
                <a href="#" className="footer-link">Detection Algorithms</a>
                <a href="#" className="footer-link">Machine Learning</a>
                <a href="#" className="footer-link">Computer Vision</a>
              </div>
              
              <div className="link-group">
                <h5>Features</h5>
                <a href="#" className="footer-link">Real-time Detection</a>
                <a href="#" className="footer-link">Analytics</a>
                <a href="#" className="footer-link">Security</a>
              </div>
              
              <div className="link-group">
                <h5>Resources</h5>
                <a href="#" className="footer-link">Documentation</a>
                <a href="#" className="footer-link">API Reference</a>
                <a href="#" className="footer-link">Support</a>
              </div>
            </div>
            
            <div className="footer-info">
              <p>Powered by Advanced AI Technology</p>
              <div className="footer-badges">
                <span className="badge badge-primary">AI-Powered</span>
                <span className="badge badge-success">Real-time</span>
                <span className="badge badge-warning">Enterprise</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
