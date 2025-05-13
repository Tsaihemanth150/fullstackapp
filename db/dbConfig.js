import mongoose from "mongoose";

let isConnected = false; // Track if we are connected to the database

export async function connect() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Avoid re-connecting if already connected
        if (isConnected) {
           
            return true;
        }

        // Set connection options to avoid long waits
        const options = { 
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout for server selection
        };

        // Establish the connection
        await mongoose.connect(uri, options);
        const connection = mongoose.connection;

        // Add listeners only if they aren't already present
        if (connection.listeners('connected').length === 0) {
            connection.on('connected', () => {
                console.log('Connected with database');
            });
        }

        if (connection.listeners('error').length === 0) {
            connection.on('error', (error) => {
                console.error('Database connection error:', error);
            });
        }

        isConnected = true; // Mark as connected

        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}