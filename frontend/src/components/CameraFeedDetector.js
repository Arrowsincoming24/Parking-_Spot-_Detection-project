import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Video, VideoOff, Activity, Settings, Download, Maximize2, Grid3X3, Eye, EyeOff, Play, Square } from 'lucide-react';
import ParkingDetectionEngine from '../utils/parkingDetectionEngine';
import './CameraFeedDetector.css';

/**
 * Advanced Camera Feed Detection Component
 * Real-time video processing with live detection overlays and performance monitoring
 */

const CameraFeedDetector = ({ 
  onDetectionComplete = null,
  enableRecording = false,
  cameraId = 'default'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionEngineRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [detectionResults, setDetectionResults] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    frameTime: 0,
    detectionTime: 0,
    totalDetections: 0,
    accuracy: 0
  });
  
  const [cameraSettings, setCameraSettings] = useState({
    resolution: '720p',
    frameRate: 30,
    detectionInterval: 1000,
    confidenceThreshold: 0.8,
    enableMotionDetection: true,
    enableObjectTracking: true
  });
  
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(cameraId);
  const [showSettings, setShowSettings] = useState(false);

  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  }, [selectedCamera]);

  useEffect(() => {
    detectionEngineRef.current = new ParkingDetectionEngine();
    enumerateDevices();
    
    return () => {
      stopStream();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enumerateDevices]);

  const startStream = async () => {
    try {
      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: getResolutionWidth() },
          height: { ideal: getResolutionHeight() },
          frameRate: { ideal: cameraSettings.frameRate }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsStreaming(true);
      startVideoProcessing();
      
    } catch (error) {
      console.error('Error starting camera stream:', error);
      // Fallback to mock video
      startMockStream();
    }
  };

  const startMockStream = () => {
    // Create mock video stream for demo purposes
    if (videoRef.current) {
      // Simulate video with canvas animation
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      const mockVideo = canvas.captureStream(30);
      videoRef.current.srcObject = mockVideo;
      
      // Animate mock video
      let frame = 0;
      const animate = () => {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw parking lot simulation
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 8; j++) {
            const x = j * 160 + 20;
            const y = i * 120 + 20;
            ctx.strokeRect(x, y, 140, 100);
            
            // Simulate cars
            if (Math.sin(frame * 0.01 + i * j) > 0.5) {
              ctx.fillStyle = '#718096';
              ctx.fillRect(x + 10, y + 10, 120, 80);
            }
          }
        }
        
        // Add timestamp
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(`Mock Camera Feed - ${new Date().toLocaleTimeString()}`, 20, 30);
        
        frame++;
        requestAnimationFrame(animate);
      };
      animate();
      
      setIsStreaming(true);
      startVideoProcessing();
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsStreaming(false);
    setIsDetecting(false);
  };

  const startVideoProcessing = () => {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    
    const processFrame = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      frameCount++;
      
      // Update FPS counter
      if (currentTime - lastFpsUpdate > 1000) {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: frameCount,
          frameTime: deltaTime.toFixed(2)
        }));
        frameCount = 0;
        lastFpsUpdate = currentTime;
      }
      
      // Draw video frame to canvas
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Perform detection at specified interval
      if (isDetecting && currentTime % cameraSettings.detectionInterval < 20) {
        await performDetection();
      }
      
      // Draw overlays
      if (showOverlay && detectionResults) {
        drawDetectionOverlay(ctx);
      }
      
      if (showGrid) {
        drawGrid(ctx);
      }
      
      animationFrameRef.current = requestAnimationFrame(processFrame);
    };
    
    processFrame();
  };

  const performDetection = async () => {
    if (!canvasRef.current || !detectionEngineRef.current) return;
    
    const startTime = performance.now();
    
    try {
      // Get image data from canvas
      const ctx = canvasRef.current.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Perform detection
      const results = await detectionEngineRef.current.detectParkingSpots(imageData, {
        regionMethod: 'deep_learning',
        classificationMethod: 'ensemble',
        enablePreprocessing: true
      });
      
      const detectionTime = performance.now() - startTime;
      
      setDetectionResults(results);
      setPerformanceMetrics(prev => ({
        ...prev,
        detectionTime: detectionTime.toFixed(2),
        totalDetections: results.spots.length,
        accuracy: calculateAccuracy(results)
      }));
      
      if (onDetectionComplete) {
        onDetectionComplete(results);
      }
      
    } catch (error) {
      console.error('Detection failed:', error);
    }
  };

  const calculateAccuracy = (results) => {
    if (!results.spots.length) return 0;
    const avgConfidence = results.spots.reduce((sum, spot) => sum + spot.confidence, 0) / results.spots.length;
    return (avgConfidence * 100).toFixed(1);
  };

  const drawDetectionOverlay = (ctx) => {
    if (!detectionResults) return;
    
    detectionResults.spots.forEach(spot => {
      // Scale coordinates to canvas size
      const scaleX = canvasRef.current.width / (videoRef.current.videoWidth || 1280);
      const scaleY = canvasRef.current.height / (videoRef.current.videoHeight || 720);
      
      const x = spot.x * scaleX;
      const y = spot.y * scaleY;
      const width = spot.width * scaleX;
      const height = spot.height * scaleY;
      
      // Set color based on status
      let color = '#22c55e'; // available
      if (spot.status === 'occupied') color = '#ef4444';
      else if (spot.status === 'reserved') color = '#f59e0b';
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw confidence label
      if (spot.confidence >= cameraSettings.confidenceThreshold) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        const label = `${spot.id} ${(spot.confidence * 100).toFixed(1)}%`;
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(x, y - 25, textWidth + 10, 20);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(label, x + 5, y - 10);
      }
    });
  };

  const drawGrid = (ctx) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let x = 0; x <= canvasRef.current.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasRef.current.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasRef.current.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasRef.current.width, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!canvasRef.current) return;
    
    const stream = canvasRef.current.captureStream(cameraSettings.frameRate);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parking-detection-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Store media recorder instance
    window.currentMediaRecorder = mediaRecorder;
  };

  const stopRecording = () => {
    if (window.currentMediaRecorder) {
      window.currentMediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const getResolutionWidth = () => {
    switch (cameraSettings.resolution) {
      case '480p': return 640;
      case '720p': return 1280;
      case '1080p': return 1920;
      case '4k': return 3840;
      default: return 1280;
    }
  };

  const getResolutionHeight = () => {
    switch (cameraSettings.resolution) {
      case '480p': return 480;
      case '720p': return 720;
      case '1080p': return 1080;
      case '4k': return 2160;
      default: return 720;
    }
  };

  const exportDetectionData = () => {
    if (!detectionResults) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      cameraSettings: cameraSettings,
      results: detectionResults,
      metrics: performanceMetrics
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `camera-detection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="camera-feed-detector">
      {/* Header */}
      <div className="detector-header">
        <div className="header-title">
          <Camera className="title-icon" />
          <h3>Live Camera Detection</h3>
        </div>
        
        <div className="header-controls">
          <select 
            value={selectedCamera} 
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="camera-select"
          >
            {availableCameras.map(camera => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
          
          <button 
            className={`btn ${isDetecting ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setIsDetecting(!isDetecting)}
            disabled={!isStreaming}
          >
            <Activity size={16} />
            {isDetecting ? 'Detecting' : 'Start Detection'}
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="video-container">
        <video 
          ref={videoRef}
          className="camera-feed"
          autoPlay 
          playsInline
          muted
        />
        
        <canvas 
          ref={canvasRef}
          className="detection-canvas"
          width={1280}
          height={720}
        />
        
        {/* Video Controls Overlay */}
        <div className="video-controls">
          <div className="controls-left">
            <button 
              className={`btn ${isStreaming ? 'btn-danger' : 'btn-primary'} btn-sm`}
              onClick={isStreaming ? stopStream : startStream}
            >
              {isStreaming ? <VideoOff size={16} /> : <Video size={16} />}
              {isStreaming ? 'Stop' : 'Start'}
            </button>
            
            {enableRecording && (
              <button 
                className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                onClick={toggleRecording}
                disabled={!isStreaming}
              >
                {isRecording ? <Square size={16} /> : <Play size={16} />}
                {isRecording ? 'Recording' : 'Record'}
              </button>
            )}
          </div>
          
          <div className="controls-right">
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
              className="btn btn-secondary btn-sm"
              onClick={toggleFullscreen}
            >
              <Maximize2 size={16} />
              Fullscreen
            </button>
            
            <button 
              className="btn btn-secondary btn-sm"
              onClick={exportDetectionData}
              disabled={!detectionResults}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        
        {/* Performance Metrics Overlay */}
        <div className="metrics-overlay">
          <div className="metric-item">
            <span className="metric-label">FPS</span>
            <span className="metric-value">{performanceMetrics.fps}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Frame Time</span>
            <span className="metric-value">{performanceMetrics.frameTime}ms</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Detection</span>
            <span className="metric-value">{performanceMetrics.detectionTime}ms</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Spots</span>
            <span className="metric-value">{performanceMetrics.totalDetections}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Accuracy</span>
            <span className="metric-value">{performanceMetrics.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h4>Camera Settings</h4>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Resolution</label>
              <select 
                value={cameraSettings.resolution}
                onChange={(e) => setCameraSettings(prev => ({ ...prev, resolution: e.target.value }))}
              >
                <option value="480p">480p (640x480)</option>
                <option value="720p">720p (1280x720)</option>
                <option value="1080p">1080p (1920x1080)</option>
                <option value="4k">4K (3840x2160)</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Frame Rate</label>
              <select 
                value={cameraSettings.frameRate}
                onChange={(e) => setCameraSettings(prev => ({ ...prev, frameRate: parseInt(e.target.value) }))}
              >
                <option value="15">15 FPS</option>
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Detection Interval</label>
              <select 
                value={cameraSettings.detectionInterval}
                onChange={(e) => setCameraSettings(prev => ({ ...prev, detectionInterval: parseInt(e.target.value) }))}
              >
                <option value="500">0.5 seconds</option>
                <option value="1000">1 second</option>
                <option value="2000">2 seconds</option>
                <option value="5000">5 seconds</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Confidence Threshold</label>
              <input 
                type="range" 
                min="0.5" 
                max="0.99" 
                step="0.01"
                value={cameraSettings.confidenceThreshold}
                onChange={(e) => setCameraSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
              />
              <span>{(cameraSettings.confidenceThreshold * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeedDetector;
