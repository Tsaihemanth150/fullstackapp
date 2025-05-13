"use server";

import bcrypt from 'bcryptjs';
import { connect } from '@/db/dbConfig';
import User from '@/model/userModel';
import jwt from 'jsonwebtoken';

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

export default async function handler(req, res) {
    const origin = req.headers.origin;

    // CORS setup
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies with CORS
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle main POST request
    if (req.method === 'POST') {
        await connect();

        try {
            const { username, password } = req.body;


            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }


            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: 'Incorrect username or password.' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ error: 'Incorrect password.' });
            }


            // Generate token
            const tokenPayload = {
                email: user.email,
                name: user.name,
                id: user._id,
            };
            const token = jwt.sign(tokenPayload, process.env.Token_SECRET, { expiresIn: '30m' });

           
            //for prodcution
           // const cookieOptions = process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : 'SameSite=Strict';
           //res.setHeader('Set-Cookie', `Token=${token}; Path=/; HttpOnly; ${cookieOptions}`);
           
           const cookieHeader = `Token=${token}; Path=/; Max-Age=86400;`;
            res.setHeader('Set-Cookie', cookieHeader);
            return res.status(200).json({ success: true, message: `Welcome, ${user.Firstname} ${user.Lastname}!` });

        } catch (error) {
            console.error('Authentication error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed.' });
    }
}