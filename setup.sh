#!/bin/bash

# Workspace Booking System - Setup Script
# This script installs dependencies for both backend and frontend

echo "🏢 Workspace Booking System - Setup"
echo "===================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detected: $NODE_VERSION"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=5000
NODE_ENV=development
TIMEZONE=Asia/Kolkata
EOL
    echo "✅ Created backend/.env"
fi

echo "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
    echo "✅ Created frontend/.env"
fi

echo "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..
echo ""

# Done
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "  1. Start the backend:"
echo "     cd backend && npm run dev"
echo ""
echo "  2. In another terminal, start the frontend:"
echo "     cd frontend && npm run dev"
echo ""
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Read README.md for more information"

