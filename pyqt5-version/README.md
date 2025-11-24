# Savaşan İHA - PyQt5 Desktop Application

A professional desktop version of the Savaşan İHA combat drone competition control system built with PyQt5. This provides a native desktop experience with enhanced performance and integration.

![Python Version](https://img.shields.io/badge/Python-3.8+-blue.svg)
![PyQt5](https://img.shields.io/badge/PyQt5-5.15+-green.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Features

### Desktop Application Benefits
- **Native Performance**: Compiled application with fast rendering
- **System Integration**: Native menus, status bar, and window management
- **Advanced Graphics**: Hardware-accelerated rendering with PyQtGraph
- **Real-time Updates**: Multi-threaded telemetry updates
- **Professional Dark Theme**: Aviation-grade interface optimized for long sessions

### Core Functionality
- **Real-time Telemetry Dashboard**: GPS, altitude, speed, heading, battery status
- **Interactive Arena Map**: Custom-painted map with drone positions, no-fly zones, QR targets
- **Flight Controls Panel**: Mode switching, emergency controls, additional flight commands
- **Video Feed Display**: Simulated camera feed with lock-on detection overlay
- **QR Code Scanner**: Real-time QR detection simulation with status tracking
- **System Monitoring**: Connection status, GPS satellites, battery level, real-time clock

## 🛠 Technical Stack

- **UI Framework**: PyQt5 (Qt5 for Python)
- **Graphics**: PyQtGraph for high-performance plotting
- **Styling**: Custom dark theme with CSS-like stylesheets
- **Threading**: QThread for non-blocking real-time updates
- **Data Processing**: NumPy for efficient numerical operations

## 📋 Prerequisites

- **Python 3.8+**: Required for PyQt5 compatibility
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (with X11)
- **Graphics**: OpenGL-capable graphics card for hardware acceleration
- **Memory**: Minimum 4GB RAM, recommended 8GB+

## 🚀 Installation & Setup

### 1. System Requirements
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3-pyqt5 python3-pyqt5.qtopengl python3-pyqtgraph python3-numpy python3-pil

# macOS (using Homebrew)
brew install python@3.11 pyqt5 pyqtgraph numpy pillow

# Windows (using pip - works on most systems)
pip install PyQt5 PyQtGraph numpy pillow
```

### 2. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/fsuluu/siha.git
cd siha/pyqt5-version

# Install Python dependencies
pip install -r requirements.txt

# Run the application
python3 main.py
```

### 3. Virtual Environment (Recommended)
```bash
# Create virtual environment
python3 -m venv drone_control_env

# Activate environment
# Linux/macOS:
source drone_control_env/bin/activate
# Windows:
drone_control_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run application
python3 main.py
```

## 📁 Project Structure

```
pyqt5-version/
├── main.py                 # Main application entry point
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── src/                   # Additional source modules (if expanded)
├── assets/                # Images, icons, and resources
└── styles/                # QSS stylesheets and themes
```

## 🎯 Application Guide

### Main Interface Layout

1. **Left Sidebar**: Navigation buttons for different sections
   - 📊 Dashboard (Main telemetry view)
   - 📹 Video Feed
   - 📱 QR Scanner
   - 📋 Telemetry Logs
   - ⚙️ Settings

2. **Left Panel**: Real-time telemetry display
   - GPS coordinates with accuracy
   - Altitude with trend indicators
   - Ground speed in km/h
   - Heading with compass direction
   - Battery status with voltage

3. **Center Display**: Interactive arena map
   - Live drone position (blue triangle)
   - No-fly zones (red circles)
   - QR target locations (green markers)
   - Flight path trail (dashed line)
   - Grid overlay for reference

4. **Right Panel**: Video and QR systems
   - Camera feed with crosshair overlay
   - Lock-on detection boxes
   - QR scanner status panel
   - Detection and send controls

5. **Status Bar**: System information
   - Connection status indicator
   - GPS satellite count
   - Battery percentage
   - Current system time

### Flight Controls

- **Flight Modes**: Manual, Autonomous, Guided (with visual indicators)
- **Emergency Actions**: Return to Home, Emergency Stop (red emergency button)
- **Additional Controls**: Pause, Resume, Hold Position, Land

### Real-time Features

- **Telemetry Updates**: Every 2 seconds with smooth animations
- **Map Animations**: Drone position updates with realistic movement
- **QR Detection**: Simulated QR code scanning with success feedback
- **Video Overlay**: Random lock-on simulation with red bounding boxes

## 🎨 Customization

### Theme Customization
The application uses Qt stylesheets for theming. You can modify colors and styles in the `setup_ui()` method:

```python
# Example dark theme colors
BG_COLOR = "#1e1e1e"
ACCENT_COLOR = "#00ff88"
HIGHLIGHT_COLOR = "#00ccff"
WARNING_COLOR = "#ff0000"
```

### Adding New Widgets
To add new telemetry displays:

```python
# Create custom widget
class CustomTelemetryWidget(QFrame):
    def __init__(self):
        super().__init__()
        # Setup styles and layout

    def paintEvent(self, event):
        # Custom drawing
        painter = QPainter(self)
        # Your drawing code here
```

## 🔧 Advanced Configuration

### Performance Optimization
- **Hardware Acceleration**: Enable OpenGL in your graphics settings
- **Update Frequency**: Adjust telemetry update intervals in `TelemetryUpdateThread`
- **Graphics Quality**: Modify anti-aliasing and rendering settings

### Network Integration
The application is prepared for real drone integration:

```python
# Example WebSocket integration
class DroneConnection(QThread):
    def __init__(self):
        super().__init__()
        # Setup WebSocket connection

    def run(self):
        # Connect to drone WebSocket
        # Emit real telemetry data
```

## 🧪 Testing

### Unit Testing
```bash
# Install test dependencies
pip install pytest pytest-qt

# Run tests
pytest tests/
```

### Manual Testing Checklist
- [ ] Application launches without errors
- [ ] All panels display correctly
- [ ] Real-time updates are smooth
- [ ] Flight controls respond to clicks
- [ ] QR scanner shows status updates
- [ ] Status bar displays correct information
- [ ] Window resizing works properly
- [ ] Menu items are accessible

## 🚀 Deployment

### Create Executable
```bash
# Install PyInstaller
pip install pyinstaller

# Create executable
pyinstaller --onefile --windowed main.py

# Creates executable in dist/ directory
```

### Distribution
- **Windows**: Distribute the .exe file
- **macOS**: Create .app bundle
- **Linux**: Distribute .AppImage or .deb package

## 🆘 Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Ensure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **Display Errors**: Check graphics drivers and X11 server
   ```bash
   # Linux: Check X server
   echo $DISPLAY
   export DISPLAY=:0
   ```

3. **Performance Issues**: Disable hardware acceleration if needed
   ```python
   app.setAttribute(Qt.AA_UseSoftwareOpenGL, True)
   ```

4. **Style Issues**: Verify Qt styles are properly applied
   ```python
   app.setStyle('Fusion')  # Force Fusion style
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the main repository for details.

## 🙏 Acknowledgments

- **PyQt5**: Cross-platform GUI framework
- **PyQtGraph**: Scientific graphics and plotting
- **Qt Company**: For the excellent Qt framework
- **Python Community**: For the amazing ecosystem

---

**Built with ❤️ for professional drone competition control**

**Note**: This PyQt5 version provides enhanced performance and system integration compared to the web version, making it ideal for competition environments where reliability and speed are critical.