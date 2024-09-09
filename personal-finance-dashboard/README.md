# Personal Finance Dashboard - Frontend

This is the frontend application for the Personal Finance Dashboard.

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd personal-finance-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:3002
   ```
   Adjust the URL if your backend is running on a different port or host.

## Running the Application

Start the frontend development server:
```bash
npm start
```
The application will be available at `http://localhost:3002`.

## Building for Production

To create a production build:
```bash
npm run build
```
This will create a `build` directory with the compiled assets ready for deployment.

## Testing

Run the test suite:
```bash
npm test
```

## Folder Structure

- `src/components`: Reusable React components
- `src/pages`: Top-level page components
- `src/utils`: Utility functions and helpers
- `src/styles`: Global styles and theme configuration
- `src/api`: API service functions

For more detailed information about the project structure and components, please refer to the ARCHITECTURE.md file in this directory.