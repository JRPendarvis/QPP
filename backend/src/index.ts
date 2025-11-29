import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware - these run on every request
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Health check endpoint - test if server is running
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'QuiltPlannerPro API is running',
    timestamp: new Date().toISOString()
  });
});

// TODO: Routes will go here later
// app.use('/api/auth', authRoutes);
// app.use('/api/designs', designRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Health check at http://localhost:${port}/health`);
});