# Environment Setup Instructions

## Backend Environment Configuration

1. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update the `.env` file with your local values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - Other configuration values as needed

3. Never commit the `.env` file to version control.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The server will run on http://localhost:5000
