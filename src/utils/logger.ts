import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', // Set the desired log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to log entries
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'error.log', level: 'error' }) // Log errors to a file
        // Add more transports as needed (e.g., log to a file, log to a remote service)
    ]
});

export default logger;
