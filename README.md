# 🅿️ Parking Spot Detection and Safety Management System

A comprehensive smart parking solution with advanced features including real-time spot detection, safety management, emergency alerts, and eco-friendly recommendations.

## 🌟 Features

### Core Functionality
- **Real-Time Parking Detection**: Live monitoring of parking spot availability
- **Interactive Parking Map**: Visual representation with color-coded spots
- **Dual Interface**: Separate dashboards for drivers and administrators

### Advanced Features

#### 1. 🛡️ Parking Safety Assistant
- Route analysis from entrance to parking spot
- Real-time detection of incoming vehicles and pedestrians
- Safety alerts to prevent collisions
- Blind spot monitoring

#### 2. 🚨 Emergency Alert System
- Violation detection (double parking, blocking fire lanes, etc.)
- Instant notifications to drivers and administrators
- Admin dashboard for violation management
- Reserved/handicap spot enforcement

#### 3. 🌿 Eco-Friendly Features
- Shaded spot recommendations (reduce AC usage)
- Exit-proximity suggestions (minimize fuel waste)
- Personal eco-impact tracking (fuel saved, CO₂ reduced)
- Sustainable parking practices

## 🏗️ Architecture

### Technology Stack
- **Frontend**: JavaFX 21
- **Language**: Java 17
- **Build Tool**: Maven
- **Data Format**: JSON (Gson)

### Project Structure
```
demo/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/
│       │       ├── model/              # Data models
│       │       │   ├── ParkingSpot.java
│       │       │   ├── Alert.java
│       │       │   ├── User.java
│       │       │   ├── CameraFeed.java
│       │       │   └── ParkingStatistics.java
│       │       ├── ui/
│       │       │   ├── components/     # Reusable UI components
│       │       │   │   ├── ParkingMapView.java
│       │       │   │   ├── AlertPanel.java
│       │       │   │   ├── StatCard.java
│       │       │   │   └── CameraFeedView.java
│       │       │   ├── driver/         # Driver interface
│       │       │   │   └── DriverDashboard.java
│       │       │   └── admin/          # Admin interface
│       │       │       └── AdminDashboard.java
│       │       └── ParkingSystemApp.java  # Main application
│       └── resources/
│           └── styles/
│               └── application.css     # UI styling
└── pom.xml                             # Maven configuration
```

## 🎨 GUI Components

### Driver Interface
1. **Home/Overview Screen**
   - Live parking map with color-coded spots
   - Summary statistics (free spots, occupied, avg. time)
   - Quick access to find nearest spot

2. **Parking Suggestion Panel**
   - Best available spot recommendations
   - Eco-friendly spot suggestions
   - Navigation assistance
   - Route safety information

3. **Safety Alerts Panel**
   - Real-time safety warnings
   - Incoming vehicle alerts
   - Pedestrian crossing notifications

4. **Eco Stats Panel**
   - Personal fuel savings tracker
   - CO₂ reduction metrics
   - Eco-friendly tips

5. **Bottom Navigation**
   - 🏠 Home
   - 🗺️ Map
   - ⚠️ Alerts
   - 🌿 Eco
   - 👤 Profile

### Admin Dashboard
1. **Dashboard Overview**
   - Statistics cards (total spots, free, occupied, violations, etc.)
   - Quick action buttons
   - Recent alerts panel

2. **Live View Tab**
   - Full parking lot map
   - Real-time spot status updates
   - Manual override controls
   - Map filters and zoom controls

3. **Alerts Management Tab**
   - Comprehensive alert table
   - Filter by type, severity, status
   - Alert resolution workflow
   - Export capabilities

4. **Camera Feeds Tab**
   - Grid view of all camera feeds
   - Detection statistics per camera
   - Camera status indicators
   - Zone-based organization

5. **Reports & Analytics Tab**
   - Occupancy trend charts
   - Violation statistics
   - Peak hour analysis
   - Export to PDF/CSV/Excel

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\Aarav\OneDrive\Desktop\SAD Lab\demo"
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn javafx:run
   ```

### Quick Login
The application provides demo accounts for testing:

- **Driver Account**: Click "Demo Driver" button
- **Admin Account**: Click "Demo Admin" button

Or manually enter:
- Username: Any name
- Password: (not validated in demo)
- Role: Driver/Admin/Security/Manager

## 📊 Data Models

### ParkingSpot
- Spot ID, position (x, y), zone
- Status: occupied, reserved, shaded, near exit
- Type: regular, handicap, EV charging, reserved
- Eco score calculation

### Alert
- Types: Safety, Violation, Emergency, Eco-Tip, System
- Severity: Critical, High, Medium, Low
- Status: Pending, Acknowledged, Resolved, Dismissed
- Timestamp and description

### User
- User ID, username, email, role
- Vehicle information
- Eco statistics (fuel saved, CO₂ reduced)
- Handicap permit status

### CameraFeed
- Camera ID, name, zone, stream URL
- Active status
- Detection counts (vehicles, pedestrians)
- Position mapping

### ParkingStatistics
- Total/free/occupied/reserved spots
- Violation and safety alert counts
- Occupancy rate calculation
- Average parking time

## 🎯 Key Features Implementation

### Color Coding
- 🟩 **Green**: Free spot
- 🟥 **Red**: Occupied spot
- 🟨 **Yellow**: Reserved spot
- 🟢 **Bright Green**: Recommended spot

### Special Indicators
- 🟠 **Orange Circle**: Shaded spot
- 🔵 **Blue Square**: EV charging
- 🟣 **Purple Circle**: Handicap accessible

### Alert Severity Colors
- 🔴 **Red**: Critical
- 🟠 **Orange**: High
- 🟡 **Yellow**: Medium
- 🟢 **Green**: Low

## 🔧 Customization

### Adding New Parking Spots
Modify the `loadSampleData()` method in `DriverDashboard.java` or `AdminDashboard.java`:

```java
ParkingSpot spot = new ParkingSpot("A1", x, y, "Zone A");
spot.setShaded(true);
spot.setNearExit(true);
parkingSpots.add(spot);
```

### Integrating Camera Feeds
Update `CameraFeed` objects with actual RTSP/HTTP stream URLs:

```java
CameraFeed feed = new CameraFeed("CAM-01", "Entrance", "Zone A", "rtsp://your-camera-url");
cameraFeeds.add(feed);
```

### Customizing Alerts
Create custom alerts in your logic:

```java
Alert alert = new Alert("ALERT-ID", Alert.AlertType.SAFETY, 
    "A12", "Custom message", Alert.AlertSeverity.HIGH);
alerts.add(alert);
```

## 🔮 Future Enhancements

- [ ] Integration with actual CCTV/IP cameras
- [ ] Machine learning-based spot detection
- [ ] Mobile app (iOS/Android)
- [ ] Payment system integration
- [ ] Predictive availability analysis
- [ ] Multi-language support
- [ ] Voice navigation
- [ ] License plate recognition
- [ ] Automated barrier control
- [ ] Cloud-based data synchronization

## 📝 License

This project is created for educational purposes as part of the SAD Lab coursework.

## 👨‍💻 Author

**Aarav**  
Software Analysis and Design Lab Project

## 🙏 Acknowledgments

- JavaFX community for excellent documentation
- Material Design for color palette inspiration
- Smart parking research papers for feature ideas

---

**Note**: This is a demonstration/prototype system. For production use, integrate with actual camera systems, databases, and security measures.
