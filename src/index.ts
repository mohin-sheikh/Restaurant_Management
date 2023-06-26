import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { connectDatabase } from './database/database';
import logger from './utils/logger';
import morgan from 'morgan';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(morgan('combined')); // Add Morgan middleware for API logging

app.use(bodyParser.json()); // Enable parsing of JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Enable parsing of URL-encoded request bodies

// Middleware to handle errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  // Send a custom error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  });
});

// Database connection
connectDatabase()
  .then(() => {
    logger.info('Database connected.');

    app.get('/', (req: Request, res: Response) => {
      res.send({
        message: 'Welcome to Restaurant Management API',
      });
    })

    // Routes
    app.use('/api', routes);

    // Start the server
    app.listen(Number(port), host, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
    process.exit(1); // Terminate the application process with a non-zero exit code
  });
