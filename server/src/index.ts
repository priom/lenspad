import express, { Express, Request, Response } from 'express';
import path from 'path';
import bigqueryRoutes from './routes/bigquery.routes';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/bigquery', bigqueryRoutes);

// Simple test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'BigQuery Express API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
