import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Restaurant from '../models/restaurant';

dotenv.config();

const mode = process.env.DB_MODE; // Get the mode from the environment variable

if (!mode) {
    throw new Error('Please provide the MODE environment variable.');
}

let sequelize: Sequelize;

if (mode === 'dev') {
    // Local database configuration
    const databaseName = process.env.DATABASE_NAME;
    const userName = process.env.DATABASE_USERNAME;
    const password = process.env.DATABASE_PASSWORD;
    const host = process.env.DATABASE_HOST;

    if (!databaseName || !userName || !password || !host) {
        throw new Error('Please provide DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, and DATABASE_HOST environment variables.');
    }

    sequelize = new Sequelize({
        database: databaseName,
        username: userName,
        password,
        host,
        dialect: 'postgres',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        timezone: '+00:00',
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    });
} else if (mode === 'prod') {
    // ElephantSQL configuration
    const databaseUrl = process.env.ELEPHANT_SQL_URL;

    if (!databaseUrl) {
        throw new Error('Please provide the ElephantSQL URL in the environment variables.');
    }

    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        timezone: '+00:00',
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    });
} else {
    throw new Error(`Unsupported mode: ${mode}`);
}

sequelize.addModels([Restaurant]); // Add the Restaurant model to Sequelize

export default sequelize;

export async function connectDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Execute a raw query to create the restaurant table
        await sequelize.query(`
        CREATE TABLE IF NOT EXISTS restaurant (
        id SERIAL PRIMARY KEY,
        restaurant_id UUID,
        restaurant_name VARCHAR,
        address VARCHAR,
        veg_only BOOLEAN,
        cost INTEGER,
        cuisine_types TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        is_open BOOLEAN)`
        );
        console.log('Restaurant table created successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
