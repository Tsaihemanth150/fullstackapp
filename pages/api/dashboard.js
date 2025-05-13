import bcrypt from 'bcryptjs';
import  { connect }  from '@/db/dbConfig';
import User from '@/model/userModel'; 
import jwt from 'jsonwebtoken';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connect();
    
    await connect();

        const authHeader = req.headers.authorization;

        // Validate Authorization Header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token is required" });
        }

        const token = authHeader.split(" ")[1];

    try {

        const decodedToken = jwt.verify(token, process.env.Token_SECRET);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });

    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}