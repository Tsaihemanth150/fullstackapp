// Update the API route (pages/api/signup.js)

import bcrypt from 'bcryptjs';
import validator from 'validator'; // Library for validation
import  { connect }  from '@/db/dbConfig';
import User from '@/model/userModel'; // Assuming your User model is in models/User.js


export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connect();
    try {
      const { username, Firstname,Lastname,email, password, confirmPassword } = req.body;


      // Validate input
      if (!username || ! Firstname|| !Lastname || !email || !password || !confirmPassword ) {
        return res.status(400).json({ error: 'All fields are required' });
      }

       // Check if user already exists
       const existingUser = await User.findOne({ $or: [{ email }, {username}] });
       if (existingUser) {
         return res.status(400).json({ error: 'User with this email or username already exists' });
       }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number' });
      }
     

     
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        username,
        Firstname,
        Lastname,
        email,
        password: hashedPassword,
      });

      await user.save();

      return res.status(200).json({ success: 'Account created successfully' });

    } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
      
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}