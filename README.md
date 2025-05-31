# E-Sports Event Platform

A full-stack web application for managing and participating in e-sports events. This platform allows users to create, manage, and participate in various e-sports events across different game titles.

## Project Structure

```
.
├── backend/               # NestJS backend server
├── frontend/             # Next.js frontend application
├── database/             # Database schema and related files
├── docker-compose.yml    # Docker compose configuration
└── mysql_data/          # MySQL data directory
```

## Features

- 👥 User Authentication & Authorization
- 🎮 Event Creation and Management
- 🏆 Team Management
- 💬 Real-time Chat
- 📊 Event Statistics
- 🖼️ Image Upload & Management
- 📱 Responsive Design

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- MySQL
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Start the Docker containers:
```bash
docker-compose up -d
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run start:dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:3306

## Tech Stack

### Backend
- NestJS
- TypeScript
- MySQL
- Docker

### Frontend
- Next.js
- TypeScript
- CSS Modules
- React

## Database Schema

The database includes tables for:
- Users/Creators
- Events
- Teams
- Players
- Event Teams
- Chat Messages

## API Documentation

The backend provides RESTful APIs for:
- User management
- Event operations
- Team management
- Chat functionality
- Image upload and management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- E-Sports images and assets used in this project
- Contributors and team members
- University project supervisors and instructors
