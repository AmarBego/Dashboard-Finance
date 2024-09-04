# Personal Finance Dashboard

A full-stack web application for managing personal finances, built with React, Node.js, Express, and MongoDB.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Features](#features)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [Technologies Used](#technologies-used)
10. [Contributing](#contributing)
11. [License](#license)

## Project Overview

This Personal Finance Dashboard allows users to track their income and expenses, visualize spending patterns, and manage their budget effectively. The application features user authentication, transaction management, and various charts for financial analysis.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)
- Git

## Installation

Clone the repository:
```bash
git clone https://github.com/AmarBego/personal-finance-dashboard.git

cd personal-finance-dashboard
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd personal-finance-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/personal_finance
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_jwt_secret_here` with a secure random string.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../personal-finance-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### Database Setup

1. Ensure MongoDB is running on your local machine.
2. The application will automatically create the necessary collections when it first runs.

### Environment Variables

Backend (personal-finance-backend/.env):
- `PORT`: The port on which the backend server will run (default: 5000)
- `MONGODB_URI`: The connection string for your MongoDB database
- `JWT_SECRET`: A secret key for JWT token generation

Frontend (personal-finance-dashboard/.env):
- `REACT_APP_API_URL`: The URL of your backend API (default: http://localhost:5000)

## Running the Application

1. Start the backend server:
   ```bash
   cd personal-finance-backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd personal-finance-dashboard
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Features

- User authentication (register, login, logout)
- Add, edit, and delete transactions
- Categorize transactions as income or expense
- View recent transactions
- Visualize expenses by category (pie chart)
- Compare income vs expenses (bar chart)
- Monthly budget overview
- Responsive design for mobile and desktop

## Project Structure

<pre> personal-finance-dashboard/

├── public/

├── src/

│ ├── components/

│ ├── pages/

│ ├── App.js

│ ├── index.js

│ └── theme.js

├── package.json

└── README.md

personal-finance-backend/

├── middleware/

├── models/

├── routes/

├── server.js

├── package.json

└── .env</pre>

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/transactions - Get all transactions for the logged-in user
- POST /api/transactions - Add a new transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Delete a transaction

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Chart.js
  - Framer Motion
  - date-fns
- Backend:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT) for authentication
  - bcrypt for password hashing
- Development Tools:
  - nodemon
  - dotenv

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.