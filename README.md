# Savaşan İHA - Combat Drone Competition Control System

A modern, responsive web-based control and monitoring system for combat drone competitions. Built with React, TypeScript, and Tailwind CSS, featuring real-time telemetry display, interactive arena mapping, and professional aviation-grade user interface.

![Savaşan İHA Control System](https://img.shields.io/badge/React-18.2+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Features

### Dashboard & Telemetry
- **Real-time Telemetry Display**: GPS coordinates, altitude, speed, heading, battery status
- **Interactive Arena Map**: Live drone positioning, no-fly zones, QR targets, flight trails
- **Advanced Warning System**: Boundary violations, low battery, signal loss alerts
- **Flight Controls**: Mode switching (Manual/Autonomous/Guided), emergency controls

### Video & Detection
- **Live Video Feed**: Placeholder for camera streaming with overlay controls
- **Lock-on Detection**: Target bounding boxes, confidence levels, lock duration tracking
- **QR Code Scanner**: Real-time QR code detection and validation panel

### User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Aviation Theme**: Clean, modern interface designed for competition environments
- **Smooth Animations**: Subtle motion with Framer Motion for enhanced user experience
- **Grid-based Layout**: Consistent card-based design with proper spacing

### Technical Features
- **Type-safe**: Full TypeScript implementation with comprehensive type definitions
- **State Management**: Zustand for client-side state, React Query for server state
- **Real-time Updates**: Mock WebSocket service simulating live telemetry data
- **Component Architecture**: Modular, reusable components with ShadCN/ui patterns

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **State Management**: Zustand + React Query
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd siha
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
siha/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Card, Button, Badge)
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── video/          # Video and detection components
│   │   └── layout/         # Layout components (Sidebar, Navigation)
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state management
│   ├── services/           # API and data services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🎯 Usage Guide

### Dashboard Navigation

1. **Sidebar Navigation**: Access different sections (Dashboard, Video Feed, QR Targets, Telemetry Logs, Settings)
2. **Main Content Area**: Primary dashboard with telemetry and controls
3. **Right Panel**: Live feeds and event timeline (collapsible)

### Flight Controls

- **Flight Modes**: Switch between Manual, Autonomous, and Guided modes
- **Emergency Actions**: Return to Home, Emergency Stop controls
- **Status Indicators**: Real-time connection and system status

### Telemetry Monitoring

- **GPS Position**: Live coordinates with accuracy indicators
- **Flight Metrics**: Altitude, speed, heading with trend indicators
- **Battery Status**: Percentage, voltage, and estimated remaining time
- **Connection Quality**: Signal strength and latency monitoring

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Map Configuration
VITE_MAPBOX_API_KEY=your_mapbox_api_key_here

# Feature Flags
VITE_ENABLE_MOCK_DATA=true
```

### Map Settings

The arena map supports multiple providers and customizable overlays:

```typescript
// Available map styles
mapStyle: 'satellite' | 'street' | 'hybrid'

// Toggle overlays
showGrid: boolean
showDistanceRings: boolean
showBearingLines: boolean
showTrail: boolean
```

## 🧪 Development

### Running Tests

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Code Quality

```bash
npm run lint          # ESLint checking
npm run type-check    # TypeScript type checking
npm run format        # Format code with Prettier
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions, issues, or contributions:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/siha/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/siha/discussions)

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for the lightning-fast build tool

---

**Built with ❤️ for the Savaşan İHA combat drone competition**