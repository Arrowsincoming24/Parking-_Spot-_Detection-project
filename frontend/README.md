# 🚗 Advanced Parking Detection System - Frontend

A sophisticated React-based parking spot detection and management system powered by machine learning, featuring real-time video processing, advanced analytics, and a modern user interface.

## 🌟 Features

### 🤖 AI-Powered Detection
- **Multiple Detection Methods**: Edge Detection, Selective Search, Connected Components, Deep Learning
- **Advanced Classification**: Modified SIFT, MLP Classifier, ResNet34, DCNN
- **Real-time Processing**: Live camera feed with instant detection overlays
- **Confidence Scoring**: Detailed confidence metrics for each detection

### 📊 Analytics Dashboard
- **Performance Metrics**: Accuracy, precision, recall, F1-score tracking
- **Time-series Analysis**: 24-hour performance trends and insights
- **Method Comparison**: Compare different detection algorithms
- **Confidence Distribution**: Visual analysis of detection confidence levels

### 🎥 Camera Integration
- **Live Camera Feed**: Real-time video processing with detection overlays
- **Recording Capabilities**: Export detection sessions as video files
- **Performance Monitoring**: FPS tracking, processing time metrics
- **Multiple Camera Support**: Switch between different camera sources

### 🔍 Advanced Filtering
- **Comprehensive Search**: Search by spot ID, zone, or features
- **Multi-criteria Filtering**: Status, type, zone, confidence level
- **Real-time Results**: Instant filtering with statistics
- **Smart Sorting**: Sort by distance, price, availability, confidence

### 📤 Export Functionality
- **Multiple Formats**: JSON, CSV, XML, PDF, Images, Video
- **Customizable Options**: Include metadata, analytics, history
- **Batch Export**: Export multiple detection sessions
- **Compression Support**: Optimize file sizes for large datasets

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── ParkingDetectionVisualizer.js    # Main detection visualization
│   ├── MLClassifier.js                  # ML classification engine
│   ├── DetectionAnalytics.js           # Analytics dashboard
│   ├── CameraFeedDetector.js           # Live camera processing
│   ├── AdvancedFilter.js               # Advanced filtering system
│   ├── ExportManager.js                # Export functionality
│   └── AnimatedLogo.js                 # Animated logo component
├── pages/
│   ├── HomePage.js                     # Landing page
│   ├── DriverPortal.js                 # Main application portal
│   └── Analytics.js                    # Analytics page
├── utils/
│   └── parkingDetectionEngine.js       # Core detection algorithms
└── styles/
    ├── modernDesignSystem.css          # Design system
    └── component-specific CSS files
```

### Detection Pipeline
1. **Image Input**: Camera feed or uploaded image
2. **Preprocessing**: Noise reduction, edge enhancement
3. **Region Proposal**: Identify potential parking spot regions
4. **Feature Extraction**: Extract visual features from regions
5. **Classification**: Classify regions as parking spots or not
6. **Post-processing**: Refine results, calculate confidence scores
7. **Visualization**: Render results with overlays and metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with WebRTC support

### Installation

1. **Navigate to the frontend directory**
```bash
cd "c:\Users\Aarav\OneDrive\Desktop\SAD Lab\demo\frontend"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open the application**
Navigate to `http://localhost:3000` in your browser

### Build for Production
```bash
npm run build
```

## 🎯 Usage Guide

### Parking Detection
1. **Upload Image**: Click "Load Image" to upload a parking lot image
2. **Select Detection Method**: Choose from Edge Detection, Selective Search, or Deep Learning
3. **Configure Classification**: Select classification algorithm (MLP, ResNet, etc.)
4. **Run Detection**: Click "Detect Spots" to process the image
5. **View Results**: See detected spots with confidence scores and overlays

### Live Camera Detection
1. **Select Camera**: Choose your camera from the dropdown
2. **Start Stream**: Click "Start" to begin camera feed
3. **Enable Detection**: Click "Start Detection" for real-time processing
4. **Adjust Settings**: Configure confidence threshold, detection interval
5. **Record Session**: Use "Record" to capture detection sessions

### Analytics
1. **View Metrics**: Monitor accuracy, precision, recall in real-time
2. **Compare Methods**: Analyze performance of different algorithms
3. **Track Trends**: View 24-hour performance trends
4. **Export Reports**: Generate PDF reports or export raw data

### Filtering and Search
1. **Basic Search**: Use the search bar for quick spot lookup
2. **Advanced Filters**: Click "Advanced Filters" for detailed options
3. **Apply Filters**: Select status, type, zone, confidence level
4. **Sort Results**: Choose sorting method (distance, price, etc.)
5. **View Statistics**: See filtered results count and availability

### Export Data
1. **Choose Format**: Select export format (JSON, CSV, PDF, etc.)
2. **Configure Options**: Include metadata, analytics, history as needed
3. **Quick Export**: Use preset options for common export types
4. **Download File**: Click export to download the file

## 🔧 Configuration

### Detection Settings
- **Confidence Threshold**: Minimum confidence for valid detections (0.5-0.99)
- **Detection Interval**: Time between detections (0.5-5 seconds)
- **Frame Rate**: Camera processing frame rate (15-60 FPS)
- **Resolution**: Video resolution (480p, 720p, 1080p, 4K)

### ML Model Settings
- **Region Method**: Algorithm for region proposal
- **Classification Method**: Algorithm for spot classification
- **Enable Preprocessing**: Apply image preprocessing
- **Model Confidence**: Minimum confidence for model predictions

### Export Settings
- **Include Metadata**: Add system and detection metadata
- **Include Images**: Export detection images
- **Include Analytics**: Add analytics data
- **Compression**: Enable file compression

## 🎨 Design System

### Color Palette
- **Primary**: #0ea5e9 (Sky Blue)
- **Success**: #22c55e (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Secondary**: #64748b (Slate)

### Typography
- **Headings**: Inter, 600 weight
- **Body**: Inter, 400 weight
- **Monospace**: JetBrains Mono for metrics

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent sizing, hover states
- **Forms**: Modern inputs with focus states
- **Overlays**: Glass morphism effects

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

## 📈 Performance

### Optimization Techniques
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Cached computation results
- **Virtual Scrolling**: Efficient large list rendering
- **Image Optimization**: Compressed image assets
- **Code Splitting**: Reduced bundle sizes

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

### Security Measures
- **Input Validation**: Sanitized user inputs
- **XSS Protection**: Content Security Policy
- **HTTPS Only**: Secure communication
- **Data Encryption**: Encrypted local storage

### Best Practices
- **No Eval()**: Avoid dynamic code execution
- **Secure Headers**: Proper HTTP headers
- **Dependency Updates**: Regular security updates
- **Access Control**: Proper permission handling

## 🌐 Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required Features
- **WebRTC**: Camera access
- **Canvas API**: Image processing
- **Web Workers**: Background processing
- **LocalStorage**: Data persistence

## 📝 API Reference

### Detection Engine
```javascript
// Initialize detection engine
const engine = new ParkingDetectionEngine();

// Detect parking spots
const results = await engine.detectParkingSpots(imageData, {
  regionMethod: 'deep_learning',
  classificationMethod: 'mlp_classifier',
  enablePreprocessing: true
});
```

### ML Classifier
```javascript
// Initialize classifier
const classifier = new MLClassifier({
  modelType: 'ensemble',
  confidenceThreshold: 0.8
});

// Classify spots
const classification = await classifier.classify(spotsData);
```

### Export Manager
```javascript
// Export detection results
const exportData = await exportManager.export({
  format: 'json',
  data: detectionResults,
  options: {
    includeMetadata: true,
    includeAnalytics: true
  }
});
```

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
- Check browser permissions
- Ensure HTTPS connection
- Try different camera source
- Clear browser cache

#### Detection Not Working
- Check image format (JPG, PNG supported)
- Verify image quality
- Adjust confidence threshold
- Try different detection method

#### Export Not Working
- Check browser download permissions
- Verify data availability
- Try different export format
- Clear browser storage

### Performance Issues
- Reduce detection frequency
- Lower video resolution
- Disable unnecessary features
- Clear browser cache

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### Code Standards
- **ESLint**: Consistent code style
- **Prettier**: Formatted code
- **TypeScript**: Type safety
- **JSDoc**: Documentation

### Commit Guidelines
- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation
- **style**: Code style
- **refactor**: Code refactoring
- **test**: Testing
- **chore**: Maintenance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RiccardoRettore/Parking_Slot_Detector**: Detection algorithm inspiration
- **React**: UI framework
- **Lucide React**: Icon library
- **OpenCV**: Computer vision algorithms
- **TensorFlow.js**: Machine learning models

## 📞 Support

For support and questions:
- **Documentation**: [Component Documentation](./docs/)
- **Issues**: [GitHub Issues](https://github.com/username/parking-detection/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/parking-detection/discussions)

---

**Built with ❤️ for smarter parking solutions**
