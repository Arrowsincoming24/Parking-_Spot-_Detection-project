import React, { useState, useRef } from 'react';
import { Download, FileText, Image, Video, Database, Settings, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './ExportManager.css';

/**
 * Advanced Export Manager Component
 * Comprehensive export functionality for detection results and analytics
 */

const ExportManager = ({ 
  data = null,
  detectionHistory = [],
  analyticsData = null,
  onExportComplete = null 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeImages: false,
    includeAnalytics: true,
    includeHistory: true,
    compressionEnabled: false,
    timestampEnabled: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef(null);

  const exportFormats = [
    { id: 'json', label: 'JSON', icon: FileText, description: 'Structured data format' },
    { id: 'csv', label: 'CSV', icon: Database, description: 'Spreadsheet compatible' },
    { id: 'xml', label: 'XML', icon: FileText, description: 'Markup language format' },
    { id: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted report document' },
    { id: 'images', label: 'Image Pack', icon: Image, description: 'Export detection images' },
    { id: 'video', label: 'Video Compilation', icon: Video, description: 'Export detection video' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      let exportData;
      let filename;
      let mimeType;

      switch (exportFormat) {
        case 'json':
          exportData = await prepareJSONExport();
          filename = `parking-detection-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          exportData = await prepareCSVExport();
          filename = `parking-detection-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'xml':
          exportData = await prepareXMLExport();
          filename = `parking-detection-${Date.now()}.xml`;
          mimeType = 'application/xml';
          break;
        case 'pdf':
          exportData = await preparePDFExport();
          filename = `parking-report-${Date.now()}.pdf`;
          mimeType = 'application/pdf';
          break;
        case 'images':
          exportData = await prepareImageExport();
          filename = `parking-images-${Date.now()}.zip`;
          mimeType = 'application/zip';
          break;
        case 'video':
          exportData = await prepareVideoExport();
          filename = `parking-video-${Date.now()}.webm`;
          mimeType = 'video/webm';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Download the file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus({
        type: 'success',
        message: `Successfully exported ${filename}`
      });

      if (onExportComplete) {
        onExportComplete({ format: exportFormat, filename, size: exportData.length });
      }

    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus({
        type: 'error',
        message: `Export failed: ${error.message}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const prepareJSONExport = async () => {
    const exportData = {
      exportInfo: {
        timestamp: exportOptions.timestampEnabled ? new Date().toISOString() : null,
        format: 'JSON',
        version: '1.0',
        generatedBy: 'Parking Detection System'
      },
      data: data || null,
      analytics: exportOptions.includeAnalytics ? analyticsData : null,
      history: exportOptions.includeHistory ? detectionHistory : [],
      metadata: exportOptions.includeMetadata ? {
        totalDetections: data?.spots?.length || 0,
        exportOptions: exportOptions,
        systemInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        }
      } : null
    };

    return JSON.stringify(exportData, null, 2);
  };

  const prepareCSVExport = async () => {
    if (!data?.spots?.length) {
      throw new Error('No detection data available for CSV export');
    }

    const headers = ['ID', 'Spot ID', 'Status', 'Confidence', 'X', 'Y', 'Width', 'Height', 'Zone', 'Timestamp'];
    const rows = data.spots.map(spot => [
      spot.id || '',
      spot.spotId || '',
      spot.status || '',
      spot.confidence || '',
      spot.x || '',
      spot.y || '',
      spot.width || '',
      spot.height || '',
      spot.zone || '',
      spot.timestamp || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const prepareXMLExport = async () => {
    const xmlData = `
<?xml version="1.0" encoding="UTF-8"?>
<parkingDetection>
  <exportInfo>
    <timestamp>${exportOptions.timestampEnabled ? new Date().toISOString() : ''}</timestamp>
    <format>XML</format>
    <version>1.0</version>
  </exportInfo>
  <data>
    ${data?.spots?.map(spot => `
    <spot>
      <id>${spot.id || ''}</id>
      <spotId>${spot.spotId || ''}</spotId>
      <status>${spot.status || ''}</status>
      <confidence>${spot.confidence || ''}</confidence>
      <coordinates>
        <x>${spot.x || ''}</x>
        <y>${spot.y || ''}</y>
        <width>${spot.width || ''}</width>
        <height>${spot.height || ''}</height>
      </coordinates>
      <zone>${spot.zone || ''}</zone>
      <timestamp>${spot.timestamp || ''}</timestamp>
    </spot>`).join('') || ''}
  </data>
  ${exportOptions.includeAnalytics ? `<analytics>${JSON.stringify(analyticsData)}</analytics>` : ''}
  ${exportOptions.includeHistory ? `<history>${JSON.stringify(detectionHistory)}</history>` : ''}
</parkingDetection>`;

    return xmlData.trim();
  };

  const preparePDFExport = async () => {
    // Simple PDF generation using text content
    const pdfContent = `
Parking Detection Report
Generated: ${new Date().toLocaleString()}

Detection Summary:
- Total Spots Detected: ${data?.spots?.length || 0}
- Available Spots: ${data?.spots?.filter(s => s.status === 'available').length || 0}
- Occupied Spots: ${data?.spots?.filter(s => s.status === 'occupied').length || 0}
- Reserved Spots: ${data?.spots?.filter(s => s.status === 'reserved').length || 0}

Detailed Results:
${data?.spots?.map(spot => `
Spot: ${spot.spotId}
Status: ${spot.status}
Confidence: ${spot.confidence}
Position: (${spot.x}, ${spot.y})
Zone: ${spot.zone}
Timestamp: ${spot.timestamp}
`).join('') || ''}

${exportOptions.includeAnalytics ? `
Analytics Data:
${JSON.stringify(analyticsData, null, 2)}
` : ''}

${exportOptions.includeHistory ? `
Detection History:
${detectionHistory.map(item => `
${item.timestamp}: ${item.spots?.length || 0} spots detected
`).join('')}
` : ''}
    `;

    // For demo purposes, return as text (in real implementation, use PDF library)
    return pdfContent;
  };

  const prepareImageExport = async () => {
    // Simulate image export (in real implementation, capture canvas or process images)
    const imageData = {
      images: data?.spots?.map((spot, index) => ({
        filename: `spot_${spot.spotId}_${index}.png`,
        data: 'base64-encoded-image-data-placeholder',
        metadata: {
          spotId: spot.spotId,
          confidence: spot.confidence,
          timestamp: spot.timestamp
        }
      })) || []
    };

    return JSON.stringify(imageData);
  };

  const prepareVideoExport = async () => {
    // Simulate video export (in real implementation, compile video frames)
    const videoData = {
      video: {
        filename: `detection_compilation_${Date.now()}.webm`,
        duration: '00:30',
        frames: 900,
        fps: 30,
        data: 'base64-encoded-video-data-placeholder'
      },
      metadata: {
        totalDetections: data?.spots?.length || 0,
        exportOptions: exportOptions
      }
    };

    return JSON.stringify(videoData);
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="status-success" />;
      case 'error': return <AlertCircle size={16} className="status-error" />;
      case 'info': return <Info size={16} className="status-info" />;
      default: return null;
    }
  };

  return (
    <div className="export-manager">
      {/* Header */}
      <div className="export-header">
        <div className="header-title">
          <Download className="title-icon" />
          <h3>Export Manager</h3>
        </div>
        
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings size={16} />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Format Selection */}
      <div className="format-section">
        <h4>Export Format</h4>
        <div className="format-grid">
          {exportFormats.map(format => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                className={`format-card ${exportFormat === format.id ? 'active' : ''}`}
                onClick={() => setExportFormat(format.id)}
              >
                <Icon size={24} className="format-icon" />
                <div className="format-info">
                  <span className="format-name">{format.label}</span>
                  <span className="format-description">{format.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      {showAdvanced && (
        <div className="options-section">
          <h4>Export Options</h4>
          <div className="options-grid">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
              />
              <span>Include metadata</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.includeImages}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
              />
              <span>Include images</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.includeAnalytics}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
              />
              <span>Include analytics</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.includeHistory}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeHistory: e.target.checked }))}
              />
              <span>Include history</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.compressionEnabled}
                onChange={(e) => setExportOptions(prev => ({ ...prev, compressionEnabled: e.target.checked }))}
              />
              <span>Enable compression</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={exportOptions.timestampEnabled}
                onChange={(e) => setExportOptions(prev => ({ ...prev, timestampEnabled: e.target.checked }))}
              />
              <span>Add timestamp</span>
            </label>
          </div>
        </div>
      )}

      {/* Export Status */}
      {exportStatus && (
        <div className={`export-status ${exportStatus.type}`}>
          {getStatusIcon(exportStatus.type)}
          <span>{exportStatus.message}</span>
        </div>
      )}

      {/* Export Actions */}
      <div className="export-actions">
        <button 
          className="btn btn-primary"
          onClick={handleExport}
          disabled={isExporting || (!data && !detectionHistory.length)}
        >
          {isExporting ? (
            <>
              <div className="spinner" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} />
              Export {exportFormats.find(f => f.id === exportFormat)?.label}
            </>
          )}
        </button>
        
        <div className="export-info">
          <span className="info-text">
            {data?.spots?.length || 0} detection results • 
            {detectionHistory.length} history items
          </span>
        </div>
      </div>

      {/* Quick Export Options */}
      <div className="quick-export">
        <h4>Quick Export</h4>
        <div className="quick-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setExportFormat('json');
              setExportOptions({
                includeMetadata: true,
                includeImages: false,
                includeAnalytics: true,
                includeHistory: true,
                compressionEnabled: false,
                timestampEnabled: true
              });
              handleExport();
            }}
          >
            <FileText size={14} />
            Full Report
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setExportFormat('csv');
              setExportOptions({
                includeMetadata: false,
                includeImages: false,
                includeAnalytics: false,
                includeHistory: false,
                compressionEnabled: false,
                timestampEnabled: false
              });
              handleExport();
            }}
          >
            <Database size={14} />
            Data Only
          </button>
          
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setExportFormat('pdf');
              setExportOptions({
                includeMetadata: true,
                includeImages: false,
                includeAnalytics: true,
                includeHistory: false,
                compressionEnabled: false,
                timestampEnabled: true
              });
              handleExport();
            }}
          >
            <FileText size={14} />
            Summary Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;
