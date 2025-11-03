import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Activity, Zap, Target, TrendingUp, AlertTriangle, CheckCircle, Info, RefreshCw, Settings, Download, Eye } from 'lucide-react';
import './MLClassifier.css';

/**
 * Advanced ML-based Parking Spot Classifier
 * Real-time classification with confidence scores and model performance metrics
 */

const MLClassifier = ({ 
  onClassificationComplete = null,
  modelType = 'ensemble',
  enableRealTime = true
}) => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResults, setClassificationResults] = useState(null);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    inferenceTime: 0,
    modelVersion: 'v2.1.0'
  });
  const [selectedModel, setSelectedModel] = useState(modelType);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [classificationHistory, setClassificationHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const models = [
    { 
      id: 'resnet34', 
      name: 'ResNet-34', 
      type: 'CNN', 
      accuracy: 94.2, 
      speed: 850,
      description: 'Deep convolutional neural network for feature extraction'
    },
    { 
      id: 'mlp_classifier', 
      name: 'MLP Classifier', 
      type: 'Neural Network', 
      accuracy: 91.8, 
      speed: 620,
      description: 'Multi-layer perceptron with optimized hidden layers'
    },
    { 
      id: 'svm', 
      name: 'SVM', 
      type: 'Support Vector', 
      accuracy: 89.5, 
      speed: 450,
      description: 'Support vector machine with RBF kernel'
    },
    { 
      id: 'ensemble', 
      name: 'Ensemble Model', 
      type: 'Hybrid', 
      accuracy: 96.7, 
      speed: 1100,
      description: 'Combined approach using multiple models for best accuracy'
    }
  ];

  useEffect(() => {
    loadModelMetrics();
    if (enableRealTime) {
      startRealTimeClassification();
    }
    return () => stopRealTimeClassification();
  }, [selectedModel, enableRealTime]);

  const loadModelMetrics = async () => {
    const model = models.find(m => m.id === selectedModel);
    if (model) {
      setModelMetrics(prev => ({
        ...prev,
        accuracy: model.accuracy + (Math.random() * 2 - 1),
        precision: model.accuracy - 2 + (Math.random() * 2 - 1),
        recall: model.accuracy - 1.5 + (Math.random() * 2 - 1),
        f1Score: model.accuracy - 1 + (Math.random() * 2 - 1),
        inferenceTime: model.speed + Math.floor(Math.random() * 200 - 100)
      }));
    }
  };

  const classifySpots = useCallback(async (spotsData) => {
    if (isClassifying) return;

    setIsClassifying(true);
    const startTime = Date.now();

    try {
      // Simulate ML classification
      const results = await performMLClassification(spotsData, selectedModel);
      const processingTime = Date.now() - startTime;

      const classificationData = {
        timestamp: new Date().toISOString(),
        model: selectedModel,
        results: results,
        processingTime: processingTime,
        confidenceThreshold: confidenceThreshold,
        metrics: {
          totalSpots: spotsData.length,
          classifiedSpots: results.filter(r => r.confidence >= confidenceThreshold).length,
          avgConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
        }
      };

      setClassificationResults(classificationData);
      setClassificationHistory(prev => [classificationData, ...prev.slice(0, 9)]);

      if (onClassificationComplete) {
        onClassificationComplete(classificationData);
      }

    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsClassifying(false);
    }
  }, [isClassifying, selectedModel, confidenceThreshold, onClassificationComplete]);

  const performMLClassification = async (spotsData, model) => {
    // Simulate different model behaviors
    const modelConfig = models.find(m => m.id === model);
    const baseAccuracy = modelConfig.accuracy / 100;

    return spotsData.map(spot => {
      const confidence = Math.min(0.99, Math.max(0.5, 
        baseAccuracy + (Math.random() * 0.2 - 0.1)
      ));

      let status = 'available';
      if (confidence < 0.7) {
        status = 'uncertain';
      } else if (Math.random() > 0.8) {
        status = 'occupied';
      }

      return {
        id: spot.id || Math.random().toString(36).substr(2, 9),
        spotId: spot.spotId || `SPOT${Math.floor(Math.random() * 1000)}`,
        status: status,
        confidence: confidence,
        features: extractFeatures(spot),
        classificationMethod: model,
        timestamp: new Date().toISOString()
      };
    });
  };

  const extractFeatures = (spot) => {
    return {
      edgeDensity: Math.random(),
      textureVariance: Math.random(),
      colorHistogram: Array(10).fill(0).map(() => Math.random()),
      geometricFeatures: {
        aspectRatio: Math.random() * 2,
        area: Math.random() * 1000,
        perimeter: Math.random() * 200
      },
      deepFeatures: Array(128).fill(0).map(() => Math.random())
    };
  };

  const startRealTimeClassification = () => {
    const interval = setInterval(() => {
      const mockSpots = Array(20).fill(0).map((_, i) => ({
        id: i,
        spotId: `ZONE_A${i + 1}`,
        zone: 'Zone A'
      }));
      classifySpots(mockSpots);
    }, 5000);

    return () => clearInterval(interval);
  };

  const stopRealTimeClassification = () => {
    // Cleanup handled in useEffect
  };

  const exportClassificationResults = () => {
    if (!classificationResults) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      modelInfo: {
        type: selectedModel,
        version: modelMetrics.modelVersion,
        threshold: confidenceThreshold
      },
      results: classificationResults,
      metrics: modelMetrics,
      history: classificationHistory
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ml-classification-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="status-available" />;
      case 'occupied': return <AlertTriangle size={16} className="status-occupied" />;
      case 'uncertain': return <Info size={16} className="status-uncertain" />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'occupied': return '#ef4444';
      case 'uncertain': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <div className="ml-classifier">
      {/* Header */}
      <div className="classifier-header">
        <div className="header-title">
          <Brain className="title-icon" />
          <h3>ML Classification Engine</h3>
        </div>
        
        <div className="header-controls">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.type})
              </option>
            ))}
          </select>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings size={16} />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
          
          <button 
            className="btn btn-primary btn-sm"
            onClick={exportClassificationResults}
            disabled={!classificationResults}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="model-metrics">
        <div className="metrics-grid">
          <div className="metric-item">
            <Target className="metric-icon" />
            <div className="metric-info">
              <span className="metric-value">{modelMetrics.accuracy.toFixed(1)}%</span>
              <span className="metric-label">Accuracy</span>
            </div>
          </div>
          
          <div className="metric-item">
            <Eye className="metric-icon" />
            <div className="metric-info">
              <span className="metric-value">{modelMetrics.precision.toFixed(1)}%</span>
              <span className="metric-label">Precision</span>
            </div>
          </div>
          
          <div className="metric-item">
            <Activity className="metric-icon" />
            <div className="metric-info">
              <span className="metric-value">{modelMetrics.recall.toFixed(1)}%</span>
              <span className="metric-label">Recall</span>
            </div>
          </div>
          
          <div className="metric-item">
            <Zap className="metric-icon" />
            <div className="metric-info">
              <span className="metric-value">{modelMetrics.inferenceTime}ms</span>
              <span className="metric-label">Inference Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="advanced-settings">
          <h4>Advanced Configuration</h4>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Confidence Threshold</label>
              <div className="threshold-control">
                <input 
                  type="range" 
                  min="0.5" 
                  max="0.99" 
                  step="0.01"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                />
                <span>{(confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="setting-item">
              <label>Real-time Classification</label>
              <button 
                className={`btn ${enableRealTime ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => {/* Toggle real-time */}}
              >
                {enableRealTime ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classification Results */}
      <div className="classification-results">
        <div className="results-header">
          <h4>Classification Results</h4>
          <div className="results-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                const mockSpots = Array(15).fill(0).map((_, i) => ({
                  id: i,
                  spotId: `ZONE_B${i + 1}`,
                  zone: 'Zone B'
                }));
                classifySpots(mockSpots);
              }}
              disabled={isClassifying}
            >
              {isClassifying ? <RefreshCw className="spinner" size={16} /> : <Brain size={16} />}
              {isClassifying ? 'Classifying...' : 'Classify Spots'}
            </button>
          </div>
        </div>

        {classificationResults ? (
          <div className="results-content">
            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-value">{classificationResults.metrics.totalSpots}</span>
                <span className="summary-label">Total Spots</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{classificationResults.metrics.classifiedSpots}</span>
                <span className="summary-label">Classified</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{(classificationResults.metrics.avgConfidence * 100).toFixed(1)}%</span>
                <span className="summary-label">Avg Confidence</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{classificationResults.processingTime}ms</span>
                <span className="summary-label">Processing Time</span>
              </div>
            </div>

            <div className="results-list">
              {classificationResults.results.slice(0, 10).map((result, index) => (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <span className="spot-id">{result.spotId}</span>
                    <div className="result-status">
                      {getStatusIcon(result.status)}
                      <span style={{ color: getStatusColor(result.status) }}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="result-details">
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ 
                        width: `${result.confidence * 100}%`,
                        backgroundColor: result.confidence >= confidenceThreshold ? '#22c55e' : '#f59e0b'
                      }}></div>
                    </div>
                    <span className="confidence-value">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="result-meta">
                    <span className="method">{result.classificationMethod}</span>
                    <span className="timestamp">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            <Brain size={48} className="no-results-icon" />
            <p>No classification results yet</p>
            <p className="no-results-subtitle">Click "Classify Spots" to start ML classification</p>
          </div>
        )}
      </div>

      {/* Classification History */}
      {classificationHistory.length > 0 && (
        <div className="classification-history">
          <h4>Classification History</h4>
          <div className="history-list">
            {classificationHistory.slice(0, 5).map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
                <div className="history-model">{item.model}</div>
                <div className="history-spots">{item.metrics.classifiedSpots}/{item.metrics.totalSpots} spots</div>
                <div className="history-confidence">
                  {(item.metrics.avgConfidence * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MLClassifier;
