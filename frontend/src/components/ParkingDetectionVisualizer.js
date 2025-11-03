import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Camera, Activity, Zap, Eye, EyeOff, RefreshCw, Download, Settings, Maximize2, Grid3X3 } from 'lucide-react';
import ParkingDetectionEngine from '../utils/parkingDetectionEngine';
import MLClassifier from './MLClassifier';
import './ParkingDetectionVisualizer.css';

/**
 * Advanced Parking Spot Visualization Component
 * Features real-time detection overlays, confidence scores, and interactive controls
 */

const ParkingDetectionVisualizer = ({ 
  imageData = null, 
  autoDetect = true, 
  showConfidence = true, 
  showMetadata = true,
  detectionMethod = 'deep_learning',
  classificationMethod = 'mlp_classifier'
}) => {
  const canvasRef = useRef(null);
  const [engine] = useState(() => new ParkingDetectionEngine());
  const [detectionResults, setDetectionResults] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [realTimeMode, setRealTimeMode] = useState(autoDetect);
  const [showMLClassifier, setShowMLClassifier] = useState(false);
  const [detectionStats, setDetectionStats] = useState({
    totalDetections: 0,
    avgConfidence: 0,
    processingTime: 0
  });
  const intervalRef = useRef(null);

  // Initialize with sample data
  useEffect(() => {
    if (!imageData) {
      generateSampleImage();
    }
  }, []);

  // Real-time detection loop
  useEffect(() => {
    if (realTimeMode && !isDetecting) {
      intervalRef.current = setInterval(() => {
        performDetection();
      }, 3000); // Detect every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realTimeMode, isDetecting]);

  const generateSampleImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Create parking lot background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw parking lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    // Horizontal lines
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 120);
      ctx.lineTo(canvas.width, i * 120);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 1; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 90, 120);
      ctx.lineTo(i * 90, 480);
      ctx.stroke();
    }

    // Draw some sample cars
    const carPositions = [
      { x: 100, y: 150, width: 60, height: 80 },
      { x: 280, y: 270, width: 60, height: 80 },
      { x: 460, y: 150, width: 60, height: 80 },
      { x: 640, y: 390, width: 60, height: 80 }
    ];

    carPositions.forEach(pos => {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pos.x, pos.y, pos.width, pos.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x, pos.y, pos.width, pos.height);
    });

    // Add sample text
    ctx.fillStyle = '#475569';
    ctx.font = '16px Arial';
    ctx.fillText('Sample Parking Lot - Click "Start Detection" to analyze', 20, 30);
  };

  const performDetection = useCallback(async () => {
    if (isDetecting) return;

    setIsDetecting(true);
    const startTime = Date.now();

    try {
      // Create mock image data
      const mockImageData = {
        width: 800,
        height: 600,
        data: new Uint8ClampedArray(800 * 600 * 4).fill(128)
      };

      const results = await engine.detectParkingSpots(mockImageData, {
        regionMethod: detectionMethod,
        classificationMethod: classificationMethod,
        enablePreprocessing: true
      });

      const processingTime = Date.now() - startTime;

      setDetectionResults(results);
      setDetectionHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10

      // Update stats
      const avgConfidence = results.spots.reduce((sum, spot) => sum + spot.confidence, 0) / results.spots.length;
      setDetectionStats({
        totalDetections: results.spots.length,
        avgConfidence: avgConfidence,
        processingTime: processingTime
      });

    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [engine, detectionMethod, classificationMethod, isDetecting]);

  const drawDetectionOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !detectionResults || !showOverlay) return;

    const ctx = canvas.getContext('2d');
    
    // Clear previous overlay
    ctx.save();
    
    detectionResults.spots.forEach((spot, index) => {
      const isSelected = selectedSpot === spot.id;
      
      // Set color based on status
      let color = '#22c55e'; // available - green
      let strokeWidth = 2;
      
      if (spot.status === 'occupied') {
        color = '#ef4444'; // occupied - red
      } else if (spot.status === 'reserved') {
        color = '#f59e0b'; // reserved - yellow
      }

      if (isSelected) {
        strokeWidth = 4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }

      // Draw detection box
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(spot.x, spot.y, spot.width, spot.height);

      // Draw corner indicators
      const cornerSize = 8;
      ctx.fillStyle = color;
      
      // Top-left
      ctx.fillRect(spot.x - cornerSize/2, spot.y - cornerSize/2, cornerSize, cornerSize);
      // Top-right
      ctx.fillRect(spot.x + spot.width - cornerSize/2, spot.y - cornerSize/2, cornerSize, cornerSize);
      // Bottom-left
      ctx.fillRect(spot.x - cornerSize/2, spot.y + spot.height - cornerSize/2, cornerSize, cornerSize);
      // Bottom-right
      ctx.fillRect(spot.x + spot.width - cornerSize/2, spot.y + spot.height - cornerSize/2, cornerSize, cornerSize);

      // Draw label background
      if (showConfidence || showMetadata) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        const labelText = `${spot.id} ${(spot.confidence * 100).toFixed(1)}%`;
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillRect(spot.x, spot.y - 25, textWidth + 10, 20);
        
        // Draw label text
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(labelText, spot.x + 5, spot.y - 10);
      }

      // Draw type indicator
      if (spot.type !== 'regular') {
        ctx.fillStyle = getTypeColor(spot.type);
        ctx.beginPath();
        ctx.arc(spot.x + spot.width - 10, spot.y + 10, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [detectionResults, showOverlay, selectedSpot, showConfidence, showMetadata, showGrid]);

  useEffect(() => {
    drawDetectionOverlay();
  }, [drawDetectionOverlay]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'ev_charging': return '#8b5cf6';
      case 'handicap': return '#3b82f6';
      case 'shaded': return '#06b6d4';
      default: return '#64748b';
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !detectionResults) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked spot
    const clickedSpot = detectionResults.spots.find(spot => 
      x >= spot.x && x <= spot.x + spot.width &&
      y >= spot.y && y <= spot.y + spot.height
    );

    setSelectedSpot(clickedSpot ? clickedSpot.id : null);
  };

  const exportResults = () => {
    if (!detectionResults) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      metadata: detectionResults.metadata,
      spots: detectionResults.spots,
      statistics: detectionStats
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-detection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetDetection = () => {
    setDetectionResults(null);
    setSelectedSpot(null);
    setDetectionHistory([]);
    setDetectionStats({ totalDetections: 0, avgConfidence: 0, processingTime: 0 });
    generateSampleImage();
  };

  return (
    <div className="parking-visualizer">
      <div className="visualizer-header">
        <div className="header-title">
          <Brain className="title-icon" />
          <h3>Advanced Parking Detection</h3>
        </div>
        
        <div className="header-controls">
          <button
            className={`btn ${realTimeMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setRealTimeMode(!realTimeMode)}
            disabled={isDetecting}
          >
            {realTimeMode ? <Activity size={16} /> : <Zap size={16} />}
            {realTimeMode ? 'Real-time' : 'Manual'}
          </button>
          
          <button
            className="btn btn-primary btn-sm"
            onClick={performDetection}
            disabled={isDetecting}
          >
            {isDetecting ? <RefreshCw className="spinner" size={16} /> : <Camera size={16} />}
            {isDetecting ? 'Detecting...' : 'Start Detection'}
          </button>
        </div>
      </div>

      <div className="visualizer-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="detection-canvas"
            onClick={handleCanvasClick}
            width={800}
            height={600}
          />
          
          <div className="canvas-overlay">
            <div className="overlay-controls">
              <button
                className={`btn ${showOverlay ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setShowOverlay(!showOverlay)}
              >
                {showOverlay ? <Eye size={16} /> : <EyeOff size={16} />}
                Overlay
              </button>
              
              <button
                className={`btn ${showGrid ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 size={16} />
                Grid
              </button>
              
              <button
                className={`btn ${showMLClassifier ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setShowMLClassifier(!showMLClassifier)}
              >
                <Brain size={16} />
                ML Classifier
              </button>
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={exportResults}
                disabled={!detectionResults}
              >
                <Download size={16} />
                Export
              </button>
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={resetDetection}
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="detection-info">
          {/* Detection Stats */}
          <div className="info-card">
            <h4>Detection Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{detectionStats.totalDetections}</span>
                <span className="stat-label">Spots Found</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{(detectionStats.avgConfidence * 100).toFixed(1)}%</span>
                <span className="stat-label">Avg Confidence</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{detectionStats.processingTime}ms</span>
                <span className="stat-label">Process Time</span>
              </div>
            </div>
          </div>

          {/* Selected Spot Details */}
          {selectedSpot && detectionResults && (
            <div className="info-card">
              <h4>Selected Spot: {selectedSpot}</h4>
              {(() => {
                const spot = detectionResults.spots.find(s => s.id === selectedSpot);
                return spot ? (
                  <div className="spot-details">
                    <div className="detail-row">
                      <span>Status:</span>
                      <span className={`status-badge ${spot.status}`}>{spot.status}</span>
                    </div>
                    <div className="detail-row">
                      <span>Type:</span>
                      <span className="type-badge">{spot.type}</span>
                    </div>
                    <div className="detail-row">
                      <span>Confidence:</span>
                      <span>{(spot.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-row">
                      <span>Position:</span>
                      <span>({spot.x}, {spot.y})</span>
                    </div>
                    <div className="detail-row">
                      <span>Size:</span>
                      <span>{spot.width} × {spot.height}</span>
                    </div>
                    <div className="detail-row">
                      <span>Detection:</span>
                      <span>{spot.detectionMethod}</span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Detection History */}
          {detectionHistory.length > 0 && (
            <div className="info-card">
              <h4>Detection History</h4>
              <div className="history-list">
                {detectionHistory.slice(0, 5).map((result, index) => (
                  <div key={index} className="history-item">
                    <span className="history-time">
                      {new Date(result.metadata.processingTime).toLocaleTimeString()}
                    </span>
                    <span className="history-spots">{result.spots.length} spots</span>
                    <span className="history-method">{result.metadata.detectionMethod}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ML Classifier Panel */}
        {showMLClassifier && (
          <div className="ml-classifier-panel">
            <MLClassifier 
              onClassificationComplete={(results) => {
                console.log('ML Classification completed:', results);
              }}
              modelType="ensemble"
              enableRealTime={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingDetectionVisualizer;
