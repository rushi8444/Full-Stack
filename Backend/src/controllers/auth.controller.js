import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

class AuthController {
  //signup
  static async signup(req, res) {
    try {
      const { name, email, password, address } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create normal user[cite: 1]
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        address,
        role: 'Normal User',
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error during registration.',
        error: error.message,
      });
    }
  }

  // Single login endpoint for all user roles[cite: 1]
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Generate JWT Token including role[cite: 1]
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'your_fallback_jwt_secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error during login.',
        error: error.message,
      });
    }
  }
}

export default AuthController;