#!/usr/bin/env python3
"""
Savaşan İHA - Combat Drone Competition Control System
PyQt5 Desktop Application
"""

import sys
import os
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QGridLayout, QLabel, QPushButton, QFrame, QScrollArea,
    QSplitter, QTabWidget, QStatusBar, QMenuBar, QMenu,
    QAction, QMessageBox, QProgressBar, QGroupBox, QSlider
)
from PyQt5.QtCore import (
    Qt, QTimer, QThread, pyqtSignal, QRect, QSize, QPointF
)
from PyQt5.QtGui import (
    QFont, QPalette, QColor, QPainter, QPen, QBrush,
    QLinearGradient, QPixmap, QIcon
)
import pyqtgraph as pg
import numpy as np
from datetime import datetime
import random


class TelemetryWidget(QFrame):
    """Real-time telemetry display widget"""

    def __init__(self):
        super().__init__()
        self.setStyleSheet("""
            QFrame {
                background-color: #2b2b2b;
                border: 2px solid #3c3c3c;
                border-radius: 12px;
                color: #ffffff;
            }
            QLabel {
                color: #ffffff;
                background: transparent;
            }
            QLabel#title {
                font-size: 16px;
                font-weight: bold;
                color: #00ff88;
            }
            QLabel#value {
                font-size: 24px;
                font-weight: bold;
                color: #00ccff;
            }
            QLabel#label {
                font-size: 12px;
                color: #888888;
            }
        """)

        layout = QVBoxLayout()
        self.setLayout(layout)

        # GPS Position
        self.gps_group = self.create_metric_group("GPS Position", "40.7128°N, 74.0060°W", "Coordinates")
        # Altitude
        self.altitude_group = self.create_metric_group("Altitude", "120.5 m", "Height")
        # Speed
        self.speed_group = self.create_metric_group("Ground Speed", "25.3 km/h", "Velocity")
        # Heading
        self.heading_group = self.create_metric_group("Heading", "NE 45°", "Direction")
        # Battery
        self.battery_group = self.create_metric_group("Battery", "85%", "12.6V")

        layout.addWidget(self.gps_group)
        layout.addWidget(self.altitude_group)
        layout.addWidget(self.speed_group)
        layout.addWidget(self.heading_group)
        layout.addWidget(self.battery_group)

        layout.addStretch()

    def create_metric_group(self, title, value, subtitle):
        group = QGroupBox()
        group.setStyleSheet("""
            QGroupBox {
                background-color: #2b2b2b;
                border: 1px solid #444444;
                border-radius: 8px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px 0 5px;
                color: #00ff88;
                font-weight: bold;
            }
        """)

        layout = QVBoxLayout()
        group.setLayout(layout)

        title_label = QLabel(title)
        title_label.setObjectName("title")

        value_label = QLabel(value)
        value_label.setObjectName("value")

        subtitle_label = QLabel(subtitle)
        subtitle_label.setObjectName("label")

        layout.addWidget(title_label)
        layout.addWidget(value_label)
        layout.addWidget(subtitle_label)

        return group


class ArenaMapWidget(QFrame):
    """Interactive arena map widget"""

    def __init__(self):
        super().__init__()
        self.setMinimumSize(400, 400)
        self.setStyleSheet("""
            QFrame {
                background-color: #1a1a1a;
                border: 2px solid #3c3c3c;
                border-radius: 12px;
            }
        """)

        # Drone position (mock data)
        self.drone_x = 200
        self.drone_y = 200
        self.drone_heading = 45

        # Mock no-fly zones
        self.no_fly_zones = [
            QRect(100, 100, 80, 80),
            QRect(250, 250, 100, 60),
        ]

        # Mock QR targets
        self.qr_targets = [
            QPointF(150, 300),
            QPointF(350, 150),
        ]

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        # Background
        painter.fillRect(self.rect(), QColor(26, 26, 26))

        # Grid
        painter.setPen(QPen(QColor(40, 40, 40), 1))
        for x in range(0, self.width(), 20):
            painter.drawLine(x, 0, x, self.height())
        for y in range(0, self.height(), 20):
            painter.drawLine(0, y, self.width(), y)

        # No-fly zones
        painter.setPen(QPen(QColor(255, 0, 0, 128), 2))
        painter.setBrush(QBrush(QColor(255, 0, 0, 50)))
        for zone in self.no_fly_zones:
            painter.drawEllipse(zone)

        # QR targets
        painter.setPen(QPen(QColor(0, 255, 0), 2))
        painter.setBrush(QBrush(QColor(0, 255, 0, 128)))
        for target in self.qr_targets:
            painter.drawEllipse(QRectF(target.x() - 8, target.y() - 8, 16, 16))

        # Drone
        painter.save()
        painter.translate(self.drone_x, self.drone_y)
        painter.rotate(self.drone_heading)

        # Drone body
        painter.setPen(QPen(QColor(0, 204, 255), 2))
        painter.setBrush(QBrush(QColor(0, 204, 255, 128)))

        # Draw drone as a triangle pointing in heading direction
        drone_points = [
            QPointF(10, 0),
            QPointF(-8, -6),
            QPointF(-8, 6)
        ]
        painter.drawPolygon(*drone_points)

        painter.restore()

        # Flight trail
        painter.setPen(QPen(QColor(0, 204, 255, 100), 2, Qt.DashLine))
        trail_points = [
            QPointF(180, 180),
            QPointF(190, 190),
            QPointF(200, 200)
        ]
        for i in range(len(trail_points) - 1):
            painter.drawLine(trail_points[i], trail_points[i + 1])


class FlightControlsWidget(QFrame):
    """Flight controls panel"""

    def __init__(self):
        super().__init__()
        self.setStyleSheet("""
            QFrame {
                background-color: #2b2b2b;
                border: 2px solid #3c3c3c;
                border-radius: 12px;
                color: #ffffff;
            }
            QGroupBox {
                background-color: #333333;
                border: 1px solid #444444;
                border-radius: 8px;
                margin-top: 10px;
                padding-top: 10px;
                font-weight: bold;
                color: #00ff88;
            }
            QPushButton {
                background-color: #3c3c3c;
                border: 2px solid #555555;
                border-radius: 8px;
                color: #ffffff;
                padding: 10px;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #4a4a4a;
                border-color: #00ff88;
            }
            QPushButton:pressed {
                background-color: #2a2a2a;
            }
            QPushButton#emergency {
                background-color: #cc0000;
                border-color: #ff0000;
            }
            QPushButton#emergency:hover {
                background-color: #ff0000;
            }
            QPushButton#active {
                background-color: #00aa00;
                border-color: #00ff00;
            }
        """)

        layout = QVBoxLayout()
        self.setLayout(layout)

        # Flight mode section
        mode_group = QGroupBox("Flight Mode")
        mode_layout = QGridLayout()
        mode_group.setLayout(mode_layout)

        self.manual_btn = QPushButton("Manual")
        self.manual_btn.setCheckable(True)
        self.autonomous_btn = QPushButton("Autonomous")
        self.autonomous_btn.setCheckable(True)
        self.guided_btn = QPushButton("Guided")
        self.guided_btn.setCheckable(True)
        self.guided_btn.setObjectName("active")  # Set as active

        mode_layout.addWidget(self.manual_btn, 0, 0)
        mode_layout.addWidget(self.autonomous_btn, 0, 1)
        mode_layout.addWidget(self.guided_btn, 0, 2)

        # Emergency controls
        emergency_group = QGroupBox("Emergency Controls")
        emergency_layout = QHBoxLayout()
        emergency_group.setLayout(emergency_layout)

        self.rth_btn = QPushButton("Return to Home")
        self.emergency_btn = QPushButton("Emergency Stop")
        self.emergency_btn.setObjectName("emergency")

        emergency_layout.addWidget(self.rth_btn)
        emergency_layout.addWidget(self.emergency_btn)

        # Additional controls
        controls_group = QGroupBox("Additional Controls")
        controls_layout = QGridLayout()
        controls_group.setLayout(controls_layout)

        self.pause_btn = QPushButton("Pause")
        self.resume_btn = QPushButton("Resume")
        self.hold_btn = QPushButton("Hold Position")
        self.land_btn = QPushButton("Land")

        controls_layout.addWidget(self.pause_btn, 0, 0)
        controls_layout.addWidget(self.resume_btn, 0, 1)
        controls_layout.addWidget(self.hold_btn, 1, 0)
        controls_layout.addWidget(self.land_btn, 1, 1)

        layout.addWidget(mode_group)
        layout.addWidget(emergency_group)
        layout.addWidget(controls_group)
        layout.addStretch()


class VideoFeedWidget(QFrame):
    """Video feed display widget"""

    def __init__(self):
        super().__init__()
        self.setMinimumSize(320, 240)
        self.setStyleSheet("""
            QFrame {
                background-color: #1a1a1a;
                border: 2px solid #3c3c3c;
                border-radius: 12px;
            }
        """)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        # Background
        painter.fillRect(self.rect(), QColor(26, 26, 26))

        # Simulated video feed
        gradient = QLinearGradient(0, 0, self.width(), self.height())
        gradient.setColorAt(0, QColor(40, 40, 60))
        gradient.setColorAt(1, QColor(20, 20, 40))
        painter.fillRect(self.rect(), gradient)

        # Center crosshair
        center_x, center_y = self.width() // 2, self.height() // 2
        painter.setPen(QPen(QColor(255, 255, 255, 128), 2))
        painter.drawLine(center_x - 20, center_y, center_x + 20, center_y)
        painter.drawLine(center_x, center_y - 20, center_x, center_y + 20)

        # Simulated lock-on box
        if random.random() > 0.7:  # Random lock-on
            painter.setPen(QPen(QColor(255, 0, 0), 2))
            painter.setBrush(QBrush(QColor(255, 0, 0, 50)))
            lock_box = QRect(center_x + 30, center_y - 20, 60, 40)
            painter.drawRect(lock_box)

            # Lock indicator
            painter.setPen(QPen(QColor(255, 0, 0), 3))
            painter.drawRect(lock_box.adjusted(-5, -5, 5, 5))

        # Status text
        painter.setPen(QPen(QColor(255, 255, 255)))
        painter.drawText(10, 20, "CAMERA FEED")
        painter.drawText(10, self.height() - 10, "1080p @ 30fps")


class QRScannerWidget(QFrame):
    """QR Code Scanner panel"""

    def __init__(self):
        super().__init__()
        self.setStyleSheet("""
            QFrame {
                background-color: #2b2b2b;
                border: 2px solid #3c3c3c;
                border-radius: 12px;
                color: #ffffff;
            }
            QLabel#title {
                font-size: 14px;
                font-weight: bold;
                color: #00ff88;
            }
            QLabel#status {
                font-size: 12px;
                color: #ffffff;
            }
            QLabel#value {
                font-size: 10px;
                color: #888888;
                font-family: monospace;
            }
            QPushButton {
                background-color: #3c3c3c;
                border: 1px solid #555555;
                border-radius: 6px;
                color: #ffffff;
                padding: 8px;
                font-size: 12px;
            }
            QPushButton:hover {
                background-color: #4a4a4a;
                border-color: #00ff88;
            }
        """)

        layout = QVBoxLayout()
        self.setLayout(layout)

        # Title
        title = QLabel("QR Scanner Status")
        title.setObjectName("title")
        layout.addWidget(title)

        # Scanner view
        scanner_frame = QFrame()
        scanner_frame.setFixedSize(150, 150)
        scanner_frame.setStyleSheet("""
            QFrame {
                background-color: #1a1a1a;
                border: 2px solid #444444;
                border-radius: 8px;
            }
        """)

        scanner_layout = QVBoxLayout(scanner_frame)

        # Simulated scanner animation
        self.scanner_label = QLabel("Scanning...")
        self.scanner_label.setObjectName("status")
        self.scanner_label.setAlignment(Qt.AlignCenter)
        scanner_layout.addWidget(self.scanner_label)

        layout.addWidget(scanner_frame)

        # Status
        self.status_label = QLabel("Status: Active")
        self.status_label.setObjectName("status")
        layout.addWidget(self.status_label)

        # Detected value
        self.value_label = QLabel("No QR code detected")
        self.value_label.setObjectName("value")
        self.value_label.setWordWrap(True)
        layout.addWidget(self.value_label)

        # Buttons
        self.scan_btn = QPushButton("Start Scan")
        layout.addWidget(self.scan_btn)

        self.send_btn = QPushButton("Send to Server")
        self.send_btn.setEnabled(False)
        layout.addWidget(self.send_btn)


class TelemetryUpdateThread(QThread):
    """Thread for updating telemetry data"""
    update_signal = pyqtSignal(dict)

    def run(self):
        while True:
            # Generate mock telemetry data
            telemetry = {
                'latitude': 40.7128 + random.uniform(-0.001, 0.001),
                'longitude': -74.0060 + random.uniform(-0.001, 0.001),
                'altitude': random.uniform(100, 150),
                'speed': random.uniform(15, 30),
                'heading': random.uniform(0, 360),
                'battery': random.uniform(75, 95),
                'voltage': random.uniform(12.2, 12.8)
            }

            self.update_signal.emit(telemetry)
            self.msleep(2000)  # Update every 2 seconds


class DroneControlMainWindow(QMainWindow):
    """Main application window"""

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Savaşan İHA - Combat Drone Control System")
        self.setGeometry(100, 100, 1400, 900)

        # Set dark theme
        self.setStyleSheet("""
            QMainWindow {
                background-color: #1e1e1e;
            }
            QWidget {
                background-color: #1e1e1e;
                color: #ffffff;
            }
            QStatusBar {
                background-color: #2b2b2b;
                color: #ffffff;
                border-top: 1px solid #3c3c3c;
            }
            QMenuBar {
                background-color: #2b2b2b;
                color: #ffffff;
                border-bottom: 1px solid #3c3c3c;
            }
            QMenuBar::item {
                background-color: transparent;
                padding: 8px 12px;
            }
            QMenuBar::item:selected {
                background-color: #3c3c3c;
            }
            QMenu {
                background-color: #2b2b2b;
                color: #ffffff;
                border: 1px solid #3c3c3c;
            }
            QMenu::item {
                padding: 8px 20px;
            }
            QMenu::item:selected {
                background-color: #3c3c3c;
            }
        """)

        # Set window icon
        self.setWindowIcon(QIcon())

        self.setup_ui()
        self.setup_menu()
        self.setup_status_bar()

        # Start telemetry updates
        self.telemetry_thread = TelemetryUpdateThread()
        self.telemetry_thread.update_signal.connect(self.update_telemetry)
        self.telemetry_thread.start()

        # Setup update timer
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_displays)
        self.update_timer.start(100)  # Update every 100ms for smooth animations

    def setup_ui(self):
        """Setup the main UI layout"""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Main horizontal layout
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)

        # Left sidebar (sidebar with navigation)
        left_sidebar = QFrame()
        left_sidebar.setMaximumWidth(80)
        left_sidebar.setStyleSheet("""
            QFrame {
                background-color: #2b2b2b;
                border-right: 2px solid #3c3c3c;
            }
        """)
        left_layout = QVBoxLayout()
        left_sidebar.setLayout(left_layout)

        # Navigation buttons
        self.dashboard_btn = QPushButton("📊")
        self.dashboard_btn.setToolTip("Dashboard")
        self.video_btn = QPushButton("📹")
        self.video_btn.setToolTip("Video Feed")
        self.qr_btn = QPushButton("📱")
        self.qr_btn.setToolTip("QR Scanner")
        self.logs_btn = QPushButton("📋")
        self.logs_btn.setToolTip("Telemetry Logs")
        self.settings_btn = QPushButton("⚙️")
        self.settings_btn.setToolTip("Settings")

        # Style nav buttons
        nav_style = """
            QPushButton {
                background-color: #3c3c3c;
                border: none;
                border-radius: 8px;
                color: #ffffff;
                padding: 15px;
                font-size: 20px;
                min-height: 20px;
                max-height: 20px;
                min-width: 20px;
                max-width: 20px;
            }
            QPushButton:hover {
                background-color: #00ff88;
                color: #000000;
            }
            QPushButton:checked {
                background-color: #00aa00;
                color: #ffffff;
            }
        """

        for btn in [self.dashboard_btn, self.video_btn, self.qr_btn, self.logs_btn, self.settings_btn]:
            btn.setStyleSheet(nav_style)
            btn.setCheckable(True)
            left_layout.addWidget(btn)

        self.dashboard_btn.setChecked(True)

        left_layout.addStretch()

        # Main content area
        content_widget = QWidget()
        content_layout = QHBoxLayout()
        content_widget.setLayout(content_layout)

        # Left content (telemetry and controls)
        left_content = QWidget()
        left_content.setMaximumWidth(400)
        left_layout = QVBoxLayout()
        left_content.setLayout(left_layout)

        # Telemetry widget
        self.telemetry_widget = TelemetryWidget()
        left_layout.addWidget(self.telemetry_widget)

        # Flight controls
        self.flight_controls = FlightControlsWidget()
        left_layout.addWidget(self.flight_controls)

        # Center content (map and main display)
        center_content = QWidget()
        center_layout = QVBoxLayout()
        center_content.setLayout(center_layout)

        # Arena map
        self.arena_map = ArenaMapWidget()
        center_layout.addWidget(self.arena_map)

        # Right panel (video and QR scanner)
        right_panel = QWidget()
        right_panel.setMaximumWidth(350)
        right_layout = QVBoxLayout()
        right_panel.setLayout(right_layout)

        # Video feed
        self.video_feed = VideoFeedWidget()
        right_layout.addWidget(self.video_feed)

        # QR scanner
        self.qr_scanner = QRScannerWidget()
        right_layout.addWidget(self.qr_scanner)

        # Add all panels to main layout
        main_layout.addWidget(left_sidebar)
        content_layout.addWidget(left_content)
        content_layout.addWidget(center_content)
        content_layout.addWidget(right_panel)
        main_layout.addWidget(content_widget)

    def setup_menu(self):
        """Setup the menu bar"""
        menubar = self.menuBar()

        # File menu
        file_menu = menubar.addMenu('File')

        connect_action = QAction('Connect Drone', self)
        connect_action.setShortcut('Ctrl+C')
        file_menu.addAction(connect_action)

        file_menu.addSeparator()

        export_action = QAction('Export Telemetry', self)
        file_menu.addAction(export_action)

        file_menu.addSeparator()

        exit_action = QAction('Exit', self)
        exit_action.setShortcut('Ctrl+Q')
        exit_action.triggered.connect(self.close)
        file_menu.addAction(exit_action)

        # View menu
        view_menu = menubar.addMenu('View')

        fullscreen_action = QAction('Fullscreen', self)
        fullscreen_action.setShortcut('F11')
        view_menu.addAction(fullscreen_action)

        # Tools menu
        tools_menu = menubar.addMenu('Tools')

        calibrate_action = QAction('Calibrate Sensors', self)
        tools_menu.addAction(calibrate_action)

        diagnostics_action = QAction('System Diagnostics', self)
        tools_menu.addAction(diagnostics_action)

        # Help menu
        help_menu = menubar.addMenu('Help')

        about_action = QAction('About', self)
        help_menu.addAction(about_action)

    def setup_status_bar(self):
        """Setup the status bar"""
        self.statusBar = self.statusBar()

        # Connection status
        self.connection_label = QLabel("🟢 Connected")
        self.statusBar.addPermanentWidget(self.connection_label)

        # GPS status
        self.gps_label = QLabel("🛰️ GPS: 12 satellites")
        self.statusBar.addPermanentWidget(self.gps_label)

        # Battery status
        self.battery_label = QLabel("🔋 85%")
        self.statusBar.addPermanentWidget(self.battery_label)

        # Time
        self.time_label = QLabel()
        self.statusBar.addPermanentWidget(self.time_label)

        # Update time
        self.time_timer = QTimer()
        self.time_timer.timeout.connect(self.update_time)
        self.time_timer.start(1000)
        self.update_time()

    def update_time(self):
        """Update the time display"""
        current_time = datetime.now().strftime("%H:%M:%S")
        self.time_label.setText(f"🕐 {current_time}")

    def update_telemetry(self, data):
        """Update telemetry data"""
        # Update status bar
        self.battery_label.setText(f"🔋 {data['battery']:.0f}%")

        # This would update the telemetry widget with new data
        # Implementation would depend on the specific widget structure

    def update_displays(self):
        """Update all displays with smooth animations"""
        # Animate drone position on map
        if hasattr(self, 'arena_map'):
            # Small random movements to simulate real telemetry
            self.arena_map.drone_x += random.uniform(-2, 2)
            self.arena_map.drone_y += random.uniform(-2, 2)

            # Keep drone within bounds
            self.arena_map.drone_x = max(50, min(350, self.arena_map.drone_x))
            self.arena_map.drone_y = max(50, min(350, self.arena_map.drone_y))

            # Update heading
            self.arena_map.drone_heading += random.uniform(-5, 5)
            if self.arena_map.drone_heading < 0:
                self.arena_map.drone_heading += 360
            elif self.arena_map.drone_heading >= 360:
                self.arena_map.drone_heading -= 360

            self.arena_map.update()

        # Update QR scanner status
        if hasattr(self, 'qr_scanner'):
            if random.random() > 0.95:  # 5% chance to detect QR
                qr_value = f"QR-{random.randint(1000, 9999)}"
                self.qr_scanner.value_label.setText(qr_value)
                self.qr_scanner.send_btn.setEnabled(True)
                self.qr_scanner.status_label.setText("Status: QR Detected")
            else:
                self.qr_scanner.scanner_label.setText("Scanning..." if random.random() > 0.5 else "🔍 Scanning...")

    def closeEvent(self, event):
        """Handle application close"""
        # Stop telemetry thread
        if hasattr(self, 'telemetry_thread'):
            self.telemetry_thread.terminate()
            self.telemetry_thread.wait()

        # Stop timers
        if hasattr(self, 'update_timer'):
            self.update_timer.stop()

        if hasattr(self, 'time_timer'):
            self.time_timer.stop()

        event.accept()


def main():
    """Main entry point"""
    app = QApplication(sys.argv)

    # Set application style
    app.setStyle('Fusion')

    # Create and show main window
    window = DroneControlMainWindow()
    window.show()

    # Start the event loop
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()