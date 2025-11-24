#!/usr/bin/env python3
"""
Setup script for Savaşan İHA PyQt5 Application
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False

    version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"✅ Python {version} - Compatible")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("\n📦 Installing dependencies...")

    dependencies = [
        "PyQt5>=5.15.0",
        "PyQtGraph>=0.13.0",
        "numpy>=1.20.0",
        "pillow>=8.0.0"
    ]

    for dep in dependencies:
        try:
            print(f"   Installing {dep}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", dep])
            print(f"   ✅ {dep} installed successfully")
        except subprocess.CalledProcessError:
            print(f"   ❌ Failed to install {dep}")
            return False

    print("✅ All dependencies installed successfully")
    return True

def test_imports():
    """Test if all modules can be imported"""
    print("\n🧪 Testing imports...")

    modules = [
        ("PyQt5", "PyQt5"),
        ("PyQtGraph", "pyqtgraph"),
        ("NumPy", "numpy"),
        ("Pillow", "PIL")
    ]

    for name, module in modules:
        try:
            __import__(module)
            print(f"   ✅ {name} imported successfully")
        except ImportError:
            print(f"   ❌ Failed to import {name}")
            return False

    print("✅ All modules imported successfully")
    return True

def check_display():
    """Check if display is available"""
    print("\n🖥️  Checking display availability...")

    if os.name == 'nt':  # Windows
        print("✅ Windows - Display should be available")
        return True
    elif os.name == 'posix':  # Linux/macOS
        display = os.environ.get('DISPLAY')
        if display:
            print(f"✅ DISPLAY environment variable set: {display}")
            return True
        else:
            print("⚠️  DISPLAY environment variable not set")
            print("   If you're running this on a remote server, you may need to:")
            print("   1. Set up X11 forwarding: ssh -X user@server")
            print("   2. Set DISPLAY variable: export DISPLAY=:0")
            print("   3. Run with a virtual display: xvfb-run python3 main.py")
            return False

    return False

def main():
    """Main setup function"""
    print("🚁 Savaşan İHA - PyQt5 Desktop Application Setup")
    print("=" * 60)

    # Check Python version
    if not check_python_version():
        sys.exit(1)

    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed during dependency installation")
        sys.exit(1)

    # Test imports
    if not test_imports():
        print("\n❌ Setup failed during import testing")
        sys.exit(1)

    # Check display
    if not check_display():
        print("\n⚠️  Warning: Display issues detected")
        print("   The application may not run in this environment")

    print("\n" + "=" * 60)
    print("🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("   1. Run the application: python3 main.py")
    print("   2. Or if display issues: xvfb-run python3 main.py")
    print("   3. Check README.md for detailed usage instructions")
    print("\n🛠️  If you encounter issues:")
    print("   - Make sure your graphics drivers are up to date")
    print("   - Try running with: python3 -c \"import PyQt5; print('OK')\"")
    print("   - For remote servers, set up X11 forwarding")

if __name__ == "__main__":
    main()