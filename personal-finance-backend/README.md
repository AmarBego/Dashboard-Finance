# Personal Finance Dashboard - Backend

This is the backend API for the Personal Finance Dashboard application.

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)

## Installation

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

## Running the Application

Start the backend server:
```bash
npm run dev
```

The server will start on the port specified in your .env file (default: 5000).

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- GET /api/transactions - Get all transactions for the logged-in user
- POST /api/transactions - Add a new transaction
- PUT /api/transactions/:id - Update a transaction
- DELETE /api/transactions/:id - Delete a transaction

For more detailed API documentation, please refer to the API.md file in this directory.